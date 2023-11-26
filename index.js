const app = require("./app");
const connectToDb = require("./db/db");

connectToDb();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`connected to port ${PORT}`);
});
