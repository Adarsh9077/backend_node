import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({}, { timestamps: true });

export const HospitalRecord = mongoose.model(
  "HospitalRecord",
  medicalRecordSchema,
);
