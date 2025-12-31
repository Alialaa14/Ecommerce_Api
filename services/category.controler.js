/* 
    CATEGORY CONTROLER (BY USER ADMIN ONLY)

    -- CREATE CATEGORY
    -- UPDATE CATEGORY
    -- DELETE CATEGORY (DELETE SUBCATEGORY AND PRODUCTS OF IT)
    -- GET ALL CATEGORIES
    -- GET CERTAIN CATEGORY (SORT BY SOLD OR ALPHAPITCAL ORDER - USE PAGNATION BY LIMIT , PAGE AND SKIP)
*/

import Category from "../models/cateogry.model.js";
import CustomError from "../utils/Custom-Api-error.js";
import cloudinary from "../utils/cloudinary.js";
export const createCategory = async (req, res, next) => {
  try {
    const cover = req.file;
    const { name, quote } = req.body;

    if (!cover)
      return res
        .status(400)
        .json({ success: false, message: "Category Cover Image is Required" });

    if (!name || !quote)
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });

    // UPLOAD IMAGE TO CLOUDINARY
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      cover.path,
      { folder: name }
    );
    if (!public_id || !secure_url)
      return res.status(400).json({
        success: false,
        message: "Couldn't upload Cover Image Of Category",
      });

    const category = await Category.create({
      name,
      quote,
      cover: {
        public_id,
        secure_url,
      },
    });

    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Create Category" });

    return res
      .status(200)
      .json({ success: true, message: "Category Created Successfully" });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cover = req.file;
    const { name, quote } = req.body;

    const category = await Category.findById(id);
    console.log(category.cover);

    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Find Category" });

    // DELETE OLD IMAGE FROM CLOUDINARY
    await cloudinary.uploader.destroy(category.cover.public_id);
    // UPLOAD NEW IMAGE TO CLOUDINARY
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      cover.path,
      { folder: name }
    );
    if (!public_id || !secure_url)
      return res.status(400).json({
        success: false,
        message: "Couldn't upload Cover Image Of Category",
      });
    console.log(public_id);
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        quote,
        cover: {
          public_id,
          secure_url,
        },
      },
      { new: true }
    );

    if (!updatedCategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Update Category" });

    return res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Find Category" });

    // DELETE IMAGE FROM CLOUDINARY
    const deleteCover = await cloudinary.uploader.destroy(
      category.cover.public_id
    );
    if (!deleteCover)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Delete Cover Image" });

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Delete Category" });

    return res
      .status(200)
      .json({ success: true, message: "Category Deleted Successfully" });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .limit(limit)
      .skip(skip)
      .sort({ name: 1 });

    if (!categories)
      return res
        .status(400)
        .json({ success: false, message: "No Found Categories" });

    return res.status(200).json({
      success: true,
      message: "Found Categories Successfully",
      data: categories,
    });
  } catch (error) {}
};

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cateogry = await Category.findById(id);
    if (!cateogry)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Categories" });

    return res.status(200).json({ success: true, data: cateogry });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
