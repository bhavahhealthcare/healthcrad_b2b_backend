import mongoose from "mongoose";
export const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://abhishekanandok:GUoERRqD4H261Ayd@cluster0.bbf9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/med", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};