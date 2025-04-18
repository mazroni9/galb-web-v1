import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User, User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // تحديد ما إذا كنا في بيئة الإنتاج أم لا
  const isProduction = process.env.NODE_ENV === 'production';
  
  // التكوين الأساسي لجلسة العمل
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "galb-super-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    // تكوين ملف تعريف الارتباط
    cookie: {
      httpOnly: true, // منع الوصول إلى ملف تعريف الارتباط من خلال JavaScript
      secure: isProduction, // استخدام HTTPS فقط في بيئة الإنتاج
      sameSite: isProduction ? 'strict' : 'lax', // الحماية من هجمات CSRF
      maxAge: 1000 * 60 * 60 * 24 * 7, // صلاحية لمدة أسبوع
    }
  };

  // إضافة دومين الكوكي في بيئة الإنتاج
  if (isProduction) {
    sessionSettings.cookie!.domain = '.qalb9.com'; // سيطبق على app.qalb9.com وأي نطاق فرعي آخر
  }

  app.set("trust proxy", 1); // ضروري عند استخدام HTTPS خلف بروكسي عكسي
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Check if the password is hashed (contains a dot separator)
        if (user.password.includes('.')) {
          // Compare using the secure function
          const isMatch = await comparePasswords(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid username or password" });
          }
        } else {
          // For backward compatibility with non-hashed passwords
          if (user.password !== password) {
            return done(null, false, { message: "Invalid username or password" });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password for security
      const hashedPassword = await hashPassword(req.body.password);
      
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err: any) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err: any) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
