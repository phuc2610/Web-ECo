import mongoose from "mongoose";

const customerActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    sessionId: { type: String, required: true, index: true },
    customerName: { type: String, default: "Khách vãng lai" },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    isRegistered: { type: Boolean, default: false },
    preferredCategory: { type: String, default: "" },
    preferredBrand: { type: String, default: "" },
    viewedProducts: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        productName: { type: String },
        category: { type: String },
        brand: { type: String },
        price: { type: Number },
        image: { type: String },
        viewCount: { type: Number, default: 1 },
        lastViewedAt: { type: Date, default: Date.now },
      },
    ],
    searchKeywords: [
      {
        keyword: { type: String },
        count: { type: Number, default: 1 },
        lastSearchedAt: { type: Date, default: Date.now },
      },
    ],
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const customerActivityModel =
  mongoose.models.customerActivity ||
  mongoose.model("customerActivity", customerActivitySchema);

export default customerActivityModel;
