import mongoose from "mongoose";

await mongoose
  .connect(`${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useMongoClient: true,
  })
  .then(() => {
    console.log("DB OK!");
  });
