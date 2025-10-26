import express from "express";
import {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  addProjectMember,
  removeProjectMember,
  searchProjects,
  toggleArchiveProject,
  updateProjectStatus,
  updateProjectDates,
  transferProjectOwnership,
} from "../controllers/projectControllers.js";
import { protect, authorisedRoles } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Create project (Admin) done
router.post("/create", protect,authorisedRoles("Admin"), createProject);

// Get all projects (Auth) done
router.get("/", protect, getProject);



// Update project (Admin / Project Manager) dene
router.put("/:id", protect, authorisedRoles("Admin", "Project Manager"), updateProject);

// Delete project (Admin) done
router.delete("/:id", protect, authorisedRoles("Admin"), deleteProject);

// GET /api/projects/my-projects not getting the projects
router.get("/my-projects", protect, getMyProjects);

// PATCH /api/projects/:id/add-member issue:member is not being add it shows null in the database 
router.patch("/:id/add-member", protect, authorisedRoles("Admin", "ProjectManager"), addProjectMember); 

// PATCH /api/projects/:id/remove-member 
router.patch("/:id/remove-member", protect, authorisedRoles("Admin", "ProjectManager"), removeProjectMember);

// GET /api/projects/search?name=abc not being search properly
router.get("/search", protect, searchProjects);

// PATCH /api/projects/:id/archive
router.patch("/:id/archive", protect, authorisedRoles("Admin", "ProjectManager"), toggleArchiveProject);


// PATCH /api/projects/:id/status
router.patch("/:id/status", updateProjectStatus);

// PATCH /api/projects/:id/dates done
router.patch("/:id/dates", updateProjectDates);

// Get single project (Auth) done
router.get("/:id", protect, getProjectById);

// PATCH /api/projects/:id/transfer
router.patch("/:id/transfer", transferProjectOwnership);



export default router;

