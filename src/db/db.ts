import mongoose from "mongoose";

const connectDB = async (MONGO_URI: string) => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.Promise = global.Promise;

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // stop app if DB fails
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });
};

export default connectDB;
