import connectDB from "./db/db_helper.js";
import { app } from "./app.js";
console.log("MONGODB_URI:", process.env.MONGODB_URI);

(async () => {
  console.log("\n->\tConnecting to MongoDB...");
  try {
    await connectDB()
      .then(() => {
        app.listen(process.env.PORT, () => {
          console.log(`Server is running at port: `);
        });
      })
      .catch((err) => {
        console.log("Mongo db connection failed", err);
      });

    app.on("error", (error) => {
      console.log("Error:->", error);
      throw error;
    });
    // app.listen(process.env.PORT, () => {
    //   console.log(`App running on port:${process.env.PORT}`);
    // });
  } catch (error) {
    console.error("Fhhhaaaaa Error", error);
    throw error;
  }
})();
