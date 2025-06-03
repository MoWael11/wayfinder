import { Router } from "express";
import catchAllRoute from "./catch-all.route";

const api = Router().all("*", catchAllRoute);

export default Router().use("/", api) as Router;
