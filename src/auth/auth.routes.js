import { Router } from "express";
import { login,register } from "./auth.controller.js";
import { registerValidator,loginValidator} from "../middleware/validator.js";

const router = new Router();

router.post(
    '/login',
    loginValidator,
    login
);

router.post(
    '/register',
    registerValidator,
    register
)

export default router