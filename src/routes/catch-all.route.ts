import { catchAll } from "@/controller/catch-all.controller";
import { Router } from "express";

const router: Router = Router();

/**
 * Returns 404 error
 * @route {GET} /status
 * @auth optional
 */
router.route("/").all(catchAll);

export default router;
