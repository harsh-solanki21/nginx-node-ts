import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "redis";
import NodeCache from "node-cache";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

// Redis client for caching
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// In-memory cache as fallback
const localCache = new NodeCache({ stdTTL: 600 });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// API endpoint demonstrating caching
app.get("/api/data", async (_req: Request, res: Response) => {
  const cacheKey = "api-data";

  try {
    // Try Redis first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Try local cache
    const localCachedData = localCache.get(cacheKey);
    if (localCachedData) {
      return res.json(localCachedData);
    }

    // Simulate data fetch
    const data = {
      message: "This response will be cached",
      timestamp: new Date().toISOString(),
    };

    // Store in Redis
    await redisClient.setEx(cacheKey, 600, JSON.stringify(data));
    // Store in local cache
    localCache.set(cacheKey, data);

    res.json(data);
  } catch (error) {
    console.error("Cache error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint for load balancer
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Service endpoints to demonstrate API Gateway functionality
app.get("/api/service1", (_req: Request, res: Response) => {
  res.json({ service: "Service 1", data: "Some data from service 1" });
});

app.get("/api/service2", (_req: Request, res: Response) => {
  res.json({ service: "Service 2", data: "Some data from service 2" });
});

app.get("/api/service3", (_req: Request, res: Response) => {
  res.json({ service: "Service 3", data: "Some data from service 3" });
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
