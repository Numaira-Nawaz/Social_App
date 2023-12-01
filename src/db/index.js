const mongoose = require("mongoose");

module.exports = {
  connect: async () => {
    try {
      await mongoose.connect(process.env.DB_URL);
      console.log("database connect");
    } catch (error) {
      console.log(error);
    }
  },
};
