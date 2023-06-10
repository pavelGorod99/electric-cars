require("./electric-cars-model");
const mongoose= require("mongoose");
const callbackify= require("util").callbackify;

const mongooseCloseDBConnectionWithCallback= callbackify(function() {
    return mongoose.connection.close();
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", function() {
    console.log("Mongoose connected to " + process.env.DB_NAME);
});

mongoose.connection.on("disconnected", function() {
    console.log("Mongoose disconnected");
});

mongoose.connection.on("error", function(err) {
    console.log("Mongoose connection error " + err);
});

process.on("SIGINT", function() {
    mongooseCloseDBConnectionWithCallback(function() {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});