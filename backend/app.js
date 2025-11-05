import express from "express";
import cors from "cors";
import routerUser from "./routes/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", routerUser);

app.get("/", (req, res) => { 
    res.send("hi");
})


export default app;