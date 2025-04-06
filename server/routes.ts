import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCarSchema, insertVideoSchema } from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Public routes
  
  // Get all cars
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get featured videos
  app.get("/api/videos/featured", async (req, res) => {
    try {
      const videos = await storage.getFeaturedVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured videos" });
    }
  });

  // Get single car by ID
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      if (isNaN(carId)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const car = await storage.getCar(carId);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car" });
    }
  });

  // Get single video by ID
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Admin routes

  // Create a new car
  app.post("/api/cars", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCarSchema.parse(req.body);
      const newCar = await storage.createCar(validatedData);
      res.status(201).json(newCar);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create car" });
    }
  });

  // Update a car
  app.put("/api/cars/:id", isAdmin, async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      if (isNaN(carId)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const validatedData = insertCarSchema.partial().parse(req.body);
      const updatedCar = await storage.updateCar(carId, validatedData);
      
      if (!updatedCar) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(updatedCar);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update car" });
    }
  });

  // Delete a car
  app.delete("/api/cars/:id", isAdmin, async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      if (isNaN(carId)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const deleted = await storage.deleteCar(carId);
      if (!deleted) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete car" });
    }
  });

  // Create a new video
  app.post("/api/videos", isAdmin, async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const newVideo = await storage.createVideo(validatedData);
      res.status(201).json(newVideo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Update a video
  app.put("/api/videos/:id", isAdmin, async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const updatedVideo = await storage.updateVideo(videoId, validatedData);
      
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(updatedVideo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  // Delete a video
  app.delete("/api/videos/:id", isAdmin, async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const deleted = await storage.deleteVideo(videoId);
      if (!deleted) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Set video as featured
  app.patch("/api/videos/:id/featured", isAdmin, async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const { featured } = req.body;
      if (typeof featured !== 'boolean') {
        return res.status(400).json({ message: "Featured status must be a boolean" });
      }
      
      const updatedVideo = await storage.setVideoFeatured(videoId, featured);
      
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: "Failed to update video feature status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
