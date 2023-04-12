const http = require("http");
const app = require("./app");
const { PORT } = require("./config/index");
const { dbConnect } = require("./config/db");
const server = http.createServer(app);

(() => {
  dbConnect();

  try {
    server.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });

    const onListenting = () => {
      console.log(`listening on port ${PORT}`);
    };

    server.listen(PORT, onListenting);
  } catch (error) {
    console.log("ERROR: ", error);
    throw error;
  }
})();
