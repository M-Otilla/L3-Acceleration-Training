import mongoose, { Schema } from "mongoose";

import { VALID_PRODUCT_CATEGORIES } from "@/API/helpers";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    productCode: { type: String, required: true, trim: true, uppercase: true, unique: true },
    category: {
      type: String,
      required: true,
      lowercase: true,
      enum: [...VALID_PRODUCT_CATEGORIES],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    badges: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        const json = { ...(ret as Record<string, unknown>) };

        if (typeof json._id !== "undefined") {
          json.id = String(json._id);
          delete json._id;
        }

        if (typeof json.__v !== "undefined") {
          delete json.__v;
        }

        return json;
      },
    },
  },
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ productCode: 1 }, { unique: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;