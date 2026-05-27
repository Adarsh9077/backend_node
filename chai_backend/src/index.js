import express from "express";
import connectDB from "./db/db_helper.js";

const app = express();

console.log("MONGODB_URI:", process.env.MONGODB_URI);

(async () => {
  console.log("\n->\tConnecting to MongoDB...");
  try {
    await connectDB();
    app.on("error", (error) => {
      console.log("Error:->", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App running on port:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Fhhhaaaaa Error", error);
    throw error;
  }
})();

// ! Lec_08 00:00 Custom api response and error handling
