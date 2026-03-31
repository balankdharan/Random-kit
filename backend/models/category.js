import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
    },

    icon: String,
  },
  { timestamps: true },
);

// Create slug from title
categorySchema.pre("save", function () {
  if (!this.isModified("name")) return;

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
});

export default mongoose.model("Category", categorySchema);
