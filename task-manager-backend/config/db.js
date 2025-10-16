const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use environment variable or fallback to default
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;