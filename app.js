require("dotenv").config();
require("./api/data/dbconnection");
const routes= require("./api/routes");
const express= require("express");
const app= express();

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);

const server= app.listen(process.env.PORT, function() {
    let port= server.address().port;
    console.log(process.env.MSG_SERVER_START, port);
});