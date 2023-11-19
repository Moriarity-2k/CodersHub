import mongoose from "mongoose";

let isConected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.DATABASE) {
    return console.log("No Database to connect !!");
  }

  if (isConected) return console.log("Already connected to database ! ");

  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      isConected = true;
      console.log("Database connection successfull !!");
    })
    .catch((err) => console.log("Error in connection to DB", err));
};
