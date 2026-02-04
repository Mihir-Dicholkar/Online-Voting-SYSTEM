// models/Election.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
 logoUrl: {
  type: String,
  required: function () {
    return this.isNew;
  },
},// ✅ NEW
  votes: { type: Number, default: 0 },
});

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },               // e.g., "2025 Pune Municipal Election"
  region: { type: String, required: true },              // e.g., "Pune", "Mumbai Suburban"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  candidates: [candidateSchema],
  status: { 
    type: String, 
    enum: ["upcoming", "active", "completed"], 
    default: "upcoming" 
  },
  winner: { type: String },
  createdBy: { type: String, required: true },           // Clerk userId
  createdByName: { type: String },                       // Optional: admin name
}, { timestamps: true });

export default mongoose.model("Election", electionSchema);