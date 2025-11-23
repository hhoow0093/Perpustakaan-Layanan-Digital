import express from "express";
import cors from "cors";
import routerUser from "./routes/user.route.js";
import { verifyRole, verifyToken } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", routerUser);

export default app;