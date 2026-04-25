import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri =
      (typeof process.env.MONGO_URI === "string" && process.env.MONGO_URI.trim()) ||
      "mongodb://127.0.0.1:27017/Student_Learning";

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;