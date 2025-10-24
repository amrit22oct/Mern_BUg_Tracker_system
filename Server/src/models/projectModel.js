import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // 👥 Members of the project
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["Admin", "Developer", "Tester", "Manager"],
          default: "Developer",
        },
      },
    ],

    // 👤 Project creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📅 Project metadata
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    // 📊 Project status for filtering on dashboard
    status: {
      type: String,
      enum: ["Active", "On Hold", "Completed", "Archived"],
      default: "Active",
    },

    // 🐞 Bugs/issues linked to this project
    issues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue", // assuming you have an Issue (Bug) model
      },
    ],

    // 📎 Optional: tags or labels for grouping
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],

    // 🔒 Archived flag (soft delete)
    archived: {
      type: Boolean,
      default: false,
    },

    // 📈 Optional: performance metrics
    stats: {
      totalBugs: { type: Number, default: 0 },
      openBugs: { type: Number, default: 0 },
      resolvedBugs: { type: Number, default: 0 },
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("Project", projectSchema);
