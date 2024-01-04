const mongoose = require("mongoose");
require("dotenv").config();

// connect db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Conntected");
  } catch (error) {
    console.log(error, "DB not connected");
  }
};

(async () => {
  await connectDB();
})();
