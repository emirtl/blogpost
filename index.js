const app = require("./app");

const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASSWORD}@master.xebze3l.mongodb.net/${process.env.MONGOOSE_DATABSE_NAME}`
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
