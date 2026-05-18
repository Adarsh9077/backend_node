import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    costumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    address: { type: String, required: true },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);

// ! 28:30 Lec_05 E-commerce and Hospital management Data modelling
