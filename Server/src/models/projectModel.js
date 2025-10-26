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

    // 👥 Members of the project (only user references now)
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 👤 Project creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["Active", "On Hold", "Completed", "Archived"],
      default: "Active",
    },

    issues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],

    archived: {
      type: Boolean,
      default: false,
    },

    stats: {
      totalBugs: { type: Number, default: 0 },
      openBugs: { type: Number, default: 0 },
      resolvedBugs: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
