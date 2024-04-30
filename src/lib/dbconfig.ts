import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.mongodb_uri || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected!");
  } catch (error) {
    console.log("db connection failed!", error);
    process.exit(1);
  }
}

export default dbConnect;
