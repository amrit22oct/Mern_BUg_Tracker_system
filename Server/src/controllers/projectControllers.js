import Project from "../models/projectModel.js";
import User from "../models/userModel.js";
//  Creating Project (Admin only)
/*
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
*/

// Creating project enhance version
export const createProject = async(req,res) => {
  try {
    const { name, description, members, startDate, endDate,tags } = req.body;

    //  validate required fields
    if(!name || name.trim().length <3  ) {
      return res.status(400).json({message:"Project name is required and must be at least 3 character"});
    }

    // check for duplicate project name 
    const existingProject = await Project.findOne({ name: name.trim() });
    if (existingProject)  {
      return res.status(400).json({message:"A project with the same name is already registered try with another name "});
    }


    // verify that members (if Provided) exists
    let validMembers = [];
    if (members && members.length>0) {
      const foundMembers = await User.find({_id: {$in: members }});
      if (foundMembers.length !== members.length) {
        return res.status(400).json({message: "One or more members not found "});
      }
      validMembers = foundMembers.map((u) => u._id);
    }

    //  creating the new project
    const project = await Project.create({
      name:name.trim(),
      description: description?.trim() || "",
      members: validMembers,
      createdBy: req.user._id,
      startDate,
      endDate,
      tags,
    });

    // Populate members & creator info in the response
    const populatedProject = await Project.findById(project._id)
    .populate("members","name email role")
    .populate("createdBy", "name email role");

    res.status(201).json({
      success:true,
      message: "Project created Succesfully",
      data: populatedProject,
    });

  } catch (error) {
    console.error("Create Project Error", error.message);
    res.status(500).json({message: "Internal Server Error"});
    
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
 

//   Getting my projects 

export const getMyProjects = async(req,res) => {
   try {
      const projects = await Project.find({members: req.user._id }).populate("Members", "name email");
      res.status(200).json({success: true,count: projects.length, data: projects})
   } catch (error) {
      res.status(500).json({message: "Internal Server Error"});
      
   };
}

// Adding the memeber to the projects 

export const addProjectMember = async (req, res) => {
   try {
     const { memberId } = req.body;
     const project = await Project.findById(req.params.id);
     if (!project) return res.status(404).json({ message: "Project not found" });
 
     if (!project.members.includes(memberId)) {
       project.members.push(memberId);
       await project.save();
     }
 
     res.status(200).json({ success: true, message: "Member added", data: project });
   } catch (error) {
     res.status(500).json({ message: "Server Error" });
   }
 };
 

 export const removeProjectMember = async (req, res) => {
   try {
     const { memberId } = req.body;
     const project = await Project.findById(req.params.id);
     if (!project) return res.status(404).json({ message: "Project not found" });
 
     project.members = project.members.filter(
       (id) => id.toString() !== memberId.toString()
     );
     await project.save();
 
     res.status(200).json({ success: true, message: "Member removed", data: project });
   } catch (error) {
     res.status(500).json({ message: "Server Error" });
   }
 };
 
 export const searchProjects = async (req, res) => {
   try {
     const { name } = req.query;
     const query = {};
 
     if (name) query.name = { $regex: name, $options: "i" };
 
     const projects = await Project.find(query)
       .populate("members", "name email");
     res.status(200).json({ success: true, count: projects.length, data: projects });
   } catch (error) {
     res.status(500).json({ message: "Server Error" });
   }
 };
 

 export const toggleArchiveProject = async (req, res) => {
   try {
     const project = await Project.findById(req.params.id);
     if (!project) return res.status(404).json({ message: "Project not found" });
 
     project.archived = !project.archived;
     await project.save();
 
     res.status(200).json({
       success: true,
       message: project.archived ? "Project archived" : "Project unarchived",
       data: project,
     });
   } catch (error) {
     res.status(500).json({ message: "Server Error" });
   }
 };
 