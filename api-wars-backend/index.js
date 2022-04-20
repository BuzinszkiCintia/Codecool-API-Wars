const path = require("path");
const { init } = require("./src/db");
const app = require("./src/app");

const port = process.env?.PORT ?? 8080;

init(path.join(__dirname, "db.json")).then(() => {
  app.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
});
