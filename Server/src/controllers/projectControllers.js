import Project from "../models/projectModel.js";

//  Creating Project (Admin only)

export const createProject = async(req,res) => {
   try {
      const { name,description, members } = req.body;
      if (!name) return res.status(400).json({ message:"Project name is required"});

      const project = await Project.create({
         name,
         description,
         members,
         createdBy: req.user._id,
      });

      res.status(201).json({
         success:true,
         message: "Project created Successfully",
         data: project,
      });

   } catch (error) {

      console.error("Created Project Error", error.message);
      res.status(500).json({message:"Server Error"});
      
   }
};

// Get all Project (Authenticated users)

export const getProject = async(req,res) => {
   try {
      const projects = await Project.find().populate("members","name email");
      res.status(200).json({
         success:true,
         count: projects.length,
         data: projects,
      });
   } catch (error) {
      console.error("GET PROJECTS ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
      
   }
}

// Get single project by id
export const getProjectById = async(req,res) => {
   try {
      const project = await Project.findById(req.params.id).populate("members", "name email");
      if (!project) return res.status(404).json({message: "Project not found"});

      res.status(200).json({success:true,data:project });

      
   } catch (error) {
      console.error("Get Project error",error.message);
      res.status(500).json({message: "Internal server error"});
      
   }
};

// Update project (Admin/Project mananger)
export const updateProject = async (req, res) => {
   try {
     const project = await Project.findById(req.params.id);
     if (!project) return res.status(404).json({ message: "Project not found" });
 
     const { name, description, members } = req.body;
 
     if (name) project.name = name;
     if (description) project.description = description;
     if (members) project.members = members;
 
     await project.save();
 
     res.status(200).json({ success: true, message: "Project updated", data: project });
   } catch (error) {
     console.error("UPDATE PROJECT ERROR:", error.message);
     res.status(500).json({ message: "Server Error" });
   }
 };
 
 // Delete project (Admin only)
 export const deleteProject = async (req, res) => {
   try {
     const project = await Project.findById(req.params.id);
 
     if (!project) {
       return res.status(404).json({ message: "Project not found" });
     }
 
     // Optional: Ensure only Admin or project creator can delete
     if (req.user.role !== "Admin" && project.createdBy.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: "Access denied: not allowed to delete this project" });
     }
 
     // ✅ Modern Mongoose deletion
     await Project.deleteOne({ _id: project._id });
 
     res.status(200).json({
       success: true,
       message: "Project deleted successfully",
     });
 
   } catch (error) {
     console.error("DELETE PROJECT ERROR:", error.message);
     res.status(500).json({ message: "Internal Server Error" });
   }
 };
 