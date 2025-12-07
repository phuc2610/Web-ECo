import express from "express";
import {
  compareProducts,
  compareWithExternal,
  getProductsForComparison,
  analyzeSingleProduct,
  suggestSimilarProducts
} from "../controllers/compareController.js";

const compareRouter = express.Router();

// Get products for comparison
compareRouter.get('/products', getProductsForComparison);

// Compare products from database
compareRouter.post('/products', compareProducts);

// Compare with external product
compareRouter.post('/external', compareWithExternal);

// Analyze single product in detail
compareRouter.post('/analyze', analyzeSingleProduct);

// Suggest similar products from NP Computer
compareRouter.post('/suggest', suggestSimilarProducts);

export default compareRouter;
