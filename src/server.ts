import express from 'express';
import payload from 'payload';
import appList from './router/app-list';
import distInfo from './router/dist-info';
import distList from './router/dist-list';
import fs from "fs";

require('dotenv').config();
const app = express();


app.set("views", __dirname + "/templates");
app.set('view engine', "ejs");
app.use("/assets", express.static(__dirname + "/assets"))

const ipaPath = (process.env.UPLOAD_DIR || __dirname) + "/ipa";
if (!fs.existsSync(ipaPath)){
  fs.mkdirSync(ipaPath);
}
const apkPath = (process.env.UPLOAD_DIR || __dirname) + "/apk";
if (!fs.existsSync(apkPath)){
  fs.mkdirSync(apkPath);
}

app.use("/ipa", express.static(ipaPath));
app.use("/apk", express.static(apkPath));
app.get("/app-list", appList);
app.get("/dist-list", distList);
app.get("/dist-info", distInfo);
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const mongoBaseUri = `mongodb://${
    process.env.MONGO_HOST || "localhost"
}:${
    parseInt(process.env.MONGO_PORT || "27017")
}`

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: mongoBaseUri + "/itms-cms",
  mongoOptions: {
    authSource: "admin",
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
  },
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
  },
})

// Add your own express routes here

app.listen(Number(process.env.PORT) || 3001);
