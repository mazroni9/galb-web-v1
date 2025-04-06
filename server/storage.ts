import { users, type User, type InsertUser } from "@shared/schema";
import { cars, type Car, type InsertCar } from "@shared/schema";
import { videos, type Video, type InsertVideo } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Create a properly typed memory store for session data
const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Car operations
  getCars(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getFeaturedVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  setVideoFeatured(id: number, featured: boolean): Promise<Video | undefined>;
  
  // Session store
  sessionStore: ReturnType<typeof createMemoryStore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private videos: Map<number, Video>;
  sessionStore: ReturnType<typeof createMemoryStore>;
  private userId: number;
  private carId: number;
  private videoId: number;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.videos = new Map();
    this.userId = 1;
    this.carId = 1;
    this.videoId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with an admin user
    this.createUser({
      username: "admin",
      password: "adminpassword", // In a real app, this would be hashed
      isAdmin: true
    });
    
    // Initialize with some sample cars
    this.createCar({
      name: "مرسيدس AMG GT",
      year: 2023,
      speed: "315 كم/س",
      price: "$145,000",
      description: "سيارة رياضية فاخرة بمحرك V8 بقوة 585 حصان، تتميز بالأداء العالي والتصميم الأنيق",
      imageUrl: "https://images.unsplash.com/photo-1555353540-64580b51c258",
      tag: "جديد"
    });
    
    this.createCar({
      name: "بورش 911 تيربو",
      year: 2023,
      speed: "330 كم/س",
      price: "$175,000",
      description: "أيقونة السيارات الرياضية مع محرك سداسي الاسطوانات، تجمع بين الأداء الرياضي والاستخدام اليومي",
      imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a",
      tag: null
    });
    
    this.createCar({
      name: "فيراري SF90",
      year: 2023,
      speed: "340 كم/س",
      price: "$520,000",
      description: "سيارة هجينة فائقة بقوة 986 حصان، تجمع بين أحدث تقنيات المحركات الكهربائية ومحرك V8",
      imageUrl: "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
      tag: "هجين"
    });
    
    // Initialize with sample videos
    this.createVideo({
      title: "تجربة قيادة بورش 911 الجديدة على مضمار السباق",
      description: "تجربة حصرية لأداء بورش 911 الجديدة على مضمار السباق",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5",
      duration: "04:32",
      featured: true
    });
    
    this.createVideo({
      title: "استعراض شامل لفيراري روما: الأداء والتصميم والقيادة",
      description: "استعراض تفصيلي لفيراري روما الجديدة",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      duration: "08:15",
      featured: true
    });
    
    this.createVideo({
      title: "استعراض لامبورغيني أفينتادور الجديدة",
      description: "لامبورغيني أفينتادور SVJ - سيارة رياضية فائقة بتصميم مذهل وأداء لا يضاهى",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd",
      duration: "10:22",
      featured: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    // Ensure isAdmin is always non-nullable
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin === undefined ? false : insertUser.isAdmin 
    };
    this.users.set(id, user);
    return user;
  }

  // Car methods
  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.carId++;
    // Ensure tag is always non-nullable (null is allowed but undefined is not)
    const car: Car = { 
      ...insertCar, 
      id,
      tag: insertCar.tag === undefined ? null : insertCar.tag 
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: number, carUpdate: Partial<InsertCar>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...carUpdate };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: number): Promise<boolean> {
    return this.cars.delete(id);
  }

  // Video methods
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getFeaturedVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.featured);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.videoId++;
    // Ensure featured is always non-nullable
    const video: Video = { 
      ...insertVideo, 
      id,
      uploadDate: new Date(),
      featured: insertVideo.featured === undefined ? false : insertVideo.featured
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: number, videoUpdate: Partial<InsertVideo>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, ...videoUpdate };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  async setVideoFeatured(id: number, featured: boolean): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, featured };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }
}

export const storage = new MemStorage();
