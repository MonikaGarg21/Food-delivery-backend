import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb://food-delivery-project-user:GIxRFOtzYgrPFmwh@ac-wd9tosp-shard-00-00.kvt67xx.mongodb.net:27017,ac-wd9tosp-shard-00-01.kvt67xx.mongodb.net:27017,ac-wd9tosp-shard-00-02.kvt67xx.mongodb.net:27017/?ssl=true&replicaSet=atlas-e7q84b-shard-0&authSource=admin&appName=Cluster0",
    )
    .then(() => console.log("DB Connected"));
};
