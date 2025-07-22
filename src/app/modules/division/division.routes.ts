import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.zod.validation";

const divisionRoute = express.Router();

divisionRoute.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidateRequest(createDivisionSchema),
  DivisionController.createDivision
);

divisionRoute.get("/", DivisionController.getAllDivisions);

divisionRoute.get("/:slug", DivisionController.getSingleDivision);

divisionRoute.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidateRequest(updateDivisionSchema),
  DivisionController.updateDivision
);

divisionRoute.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export default divisionRoute;
