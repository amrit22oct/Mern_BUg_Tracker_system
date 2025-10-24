import express from "express";
import {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectControllers.js";
import { protect, authorisedRoles } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Create project (Admin) done
router.post("/create", protect,authorisedRoles("Admin"), createProject);

// Get all projects (Auth) done
router.get("/", protect, getProject);

// Get single project (Auth) done
router.get("/:id", protect, getProjectById);

// Update project (Admin / Project Manager) dene
router.put("/:id", protect, authorisedRoles("Admin", "Project Manager"), updateProject);

// Delete project (Admin) done
router.delete("/:id", protect, authorisedRoles("Admin"), deleteProject);

export default router;
