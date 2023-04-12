const mongoose = require("mongoose");
const { MONGO_URI } = require("./index");

exports.dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log("ERROR: ", error);
    throw error;
  }
};
