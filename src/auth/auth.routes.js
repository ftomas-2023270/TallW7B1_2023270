import { Router } from "express";
import { login } from "./auth.controller.js";

const router = new Router();

router.post(
    '/login',
    login
);


export default router