const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(
      "mongodb+srv://tlemir55:w7UTiKDTwt7eEHGo@master.xebze3l.mongodb.net/blogpost-app"
    )
    .then(() => {
      console.log("connected to db ");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectToDb;
