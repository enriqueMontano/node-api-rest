import { MongoClient } from "mongodb";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  const url = process.env.MONGO_URI || "mongodb://127.0.0.1/";
  const dbName = process.env.MONGO_DB_NAME || "test";

  // Encrypt and hash the password
  const password = "0000";
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const adminUser = {
    name: "admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    roles: ["admin"],
  };

  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("MongoDB connected successfully");

    const db = client.db(dbName);
    const collection = db.collection("users");

    const result = await collection.insertOne(adminUser);
    console.log(`${JSON.stringify(result)} user created successfully`);
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    await client.close();
    console.log("Closed connection");
  }
}

seedDatabase();
