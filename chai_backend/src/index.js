import connectDB from "./db/db_helper.js";
import { app } from "./app.js";
console.log("MONGODB_URI:", process.env.MONGODB_URI);

(async () => {
  console.log("\n->\tConnecting to MongoDB...");
  try {
    await connectDB()
      .then(() => {
        app.listen(process.env.PORT, () => {
          console.log(`Server is running at port: ${process.env.PORT}`);
          console.log(`\n\nhttp://localhost:${process.env.PORT}`);
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
    console.error("Error in start methods", error);
    throw error;
  }
})();

//! 06:00 Lec_23 Build in public and open source | Only video that you need  | Backend with JS
// *  9555491667 message this no.
//? Step: 1 user(email,password,username,mobile No.)
//? step:2 save to db
//? step:3 send response to client (registration completed , pending , failed )
