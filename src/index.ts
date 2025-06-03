import cors from "./middlewares/cors";
import express from "express";
import "dotenv/config";
import routes from "@/routes/routes";
import requestLogger from "@/middlewares/request-logger";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors);
app.set("trust proxy", "127.0.0.1"); // to show real request ip
app.set("view engine", "ejs");
app.set("subdomain offset", 2);
app.use(express.static("public"));
app.use(requestLogger);

// Routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
