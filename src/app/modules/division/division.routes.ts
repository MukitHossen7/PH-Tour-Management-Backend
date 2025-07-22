import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createDivisionSchema } from "./division.zod.validation";

const divisionRoute = express.Router();

divisionRoute.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidateRequest(createDivisionSchema),
  DivisionController.createDivision
);

export default divisionRoute;
