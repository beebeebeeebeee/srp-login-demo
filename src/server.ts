import * as express from 'express'
import * as http from 'http'
import {Server} from 'socket.io'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import {AuthRoutes} from "./routes";

const app = express();
const io = new Server()
const server = http.createServer(app)
const servIo = io.listen(server)

app.use(bodyParser.json())
app.use("/api/auth", AuthRoutes)

app.use("/", express.static(path.join(__dirname, "public")));
app.get("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
})

const {PORT = 8876} = process.env;
server.listen(PORT, () => {
    console.log();
    console.log(`  App running in port ${PORT}`);
    console.log();
    console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
});