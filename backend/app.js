import express from "express";
import cors from "cors";
import routerUser from "./routes/user.route.js";
import { verifyRole, verifyToken } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", routerUser);

app.get("/dashboard/admin/:adminID", verifyToken, verifyRole(["admin"]), (req, res) => {
  res.json({ message: "Selamat datang di admin dashboard!" });
});

app.get("/dashboard/user/:userID", verifyToken, verifyRole(["user"]), (req, res) => {
  res.json({ message: "Selamat datang di user dashboard!" });
});


export default app;