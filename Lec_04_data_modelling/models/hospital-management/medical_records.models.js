import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    prescriptions: { type: String, required: true },
    testResult: String,
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: Date,
    status: {
      type: String,
      enum: ["Active", "Discharge"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export const HospitalRecord = mongoose.model(
  "HospitalRecord",
  medicalRecordSchema,
);
