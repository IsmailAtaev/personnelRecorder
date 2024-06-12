require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./database");
const router = require("./routes/index");
const fileUploader = require("express-fileupload");


const PORT = process.env.PORT || 5023;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use("/files", express.static("files"));
app.use(express.static("public"))


//app.use(fileUploader({}));


app.use("/api", router);



const main = async () => {
    try {
        const a = await sequelize.authenticate();
        // const b = await sequelize.sync({ alter: true });

        app.listen(PORT, () => console.log("Server started port: " + PORT))
    } catch (e) {
        console.log("catch " + e)
    }
}

main();
