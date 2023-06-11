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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "PUT");
    res.header("Access-Control-Allow-Methods", "DELETE");
    next();
});

app.use("/api", routes);

const server= app.listen(process.env.PORT, function() {
    let port= server.address().port;
    console.log(process.env.MSG_SERVER_START, port);
});