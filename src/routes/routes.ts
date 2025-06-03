import { catchAll } from "@/controller/catch-all.controller";
import { Router } from "express";

const api = Router().all("*", catchAll);

export default Router().use("/", api) as Router;
