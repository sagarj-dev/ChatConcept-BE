import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then((db) => {
      console.log("Database Connected Successfuly.", db.connection.host);
    })
    .catch((err) => {
      console.log("Error Connectiong to the Database", err);
    });
};

export default connectDB;
