import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    pricing: { type: number, default: 0 },
    stock: { type: number, default: 0 },
    productImage: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);


// ! 19:30 Lec_05 E-commerce and Hospital management Data modelling