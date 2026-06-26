/*import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise; */

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

const options = {
  maxPoolSize: 10,        // max connections kept open per server instance
  minPoolSize: 2,         // keep at least 2 warm so first requests don't wait
  maxIdleTimeMS: 30000,   // close idle connections after 30s
  serverSelectionTimeoutMS: 5000,  // fail fast if MongoDB is unreachable
  socketTimeoutMS: 45000,          // drop stalled queries after 45s
  connectTimeoutMS: 10000,         // give up connecting after 10s
  retryWrites: true,               // auto-retry transient write failures
  retryReads: true,                // auto-retry transient read failures
};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, reuse the client across hot reloads to avoid exhausting connections
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production each server instance gets its own pool
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;