const app = require("./app");


const mongoose = require("mongoose");


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



const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`connected to port ${PORT}`);
});


