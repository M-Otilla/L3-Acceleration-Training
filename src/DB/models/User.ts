import mongoose, { Schema } from "mongoose";

import { normalizeEmail } from "@/API/helpers";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: (value: string) => normalizeEmail(value),
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "email must be a valid email address."],
    },
    passwordHash: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        const json = { ...(ret as Record<string, unknown>) };

        if (typeof json._id !== "undefined") {
          json.id = String(json._id);
          delete json._id;
        }

        if (typeof json.__v !== "undefined") {
          delete json.__v;
        }

        delete json.passwordHash;
        return json;
      },
    },
  },
);

UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;