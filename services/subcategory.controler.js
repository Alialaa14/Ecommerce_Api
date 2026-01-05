/*
    SUBCATEGORY CONTROLER

    -- CREATE SUBCATEGORY 
    -- UPDATE SUBCATEGORY
    -- DELETE SUBCATEGORY (AND ALL PRODUCTS UNDER IT)
    -- GET ALL SUBCATEGORY (UNDER CATEGORY SORT AND PAGINATION ALSO)
    -- GET CERTAIN SUBCATEGORY 
*/
import mongoose from "mongoose";
import Subcategory from "../models/subcategory.model.js";
import CustomError from "../utils/Custom-Api-error.js";
import cloudinary from "../utils/cloudinary.js";
export const createSubCategory = async (req, res, next) => {
  try {
    const cover = req.file;
    const { name, quote } = req.body;
    const categoryId = req.params.id;

    if (!cover)
      return res.status(400).json({
        success: false,
        message: "SubCategory Cover Image is Required",
      });

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
        message: "Couldn't upload Cover Image Of SubCategory",
      });

    const subCategory = await Subcategory.create({
      category: categoryId,
      name,
      quote,
      cover: {
        public_id,
        secure_url,
      },
    });

    if (!subCategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Create SubCategory" });

    return res
      .status(200)
      .json({ success: true, message: "SubCategory Created Successfully" });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cover = req.file;
    const { name, quote } = req.body;

    const subCategory = await Subcategory.findById(id);

    if (!subCategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Find SubCategory" });

    // DELETE OLD IMAGE FROM CLOUDINARY
    await cloudinary.uploader.destroy(subCategory.cover.public_id);
    // UPLOAD NEW IMAGE TO CLOUDINARY
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      cover.path,
      { folder: name }
    );
    if (!public_id || !secure_url)
      return res.status(400).json({
        success: false,
        message: "Couldn't upload Cover Image Of SubCategory",
      });
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
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

    if (!updatedSubcategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Update SubCategory" });

    return res.status(200).json({
      success: true,
      message: "SubCategory Updated Successfully",
      data: updatedSubcategory,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subCategory = await Subcategory.findById(id);
    if (!subCategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Find SubCategory" });

    // DELETE IMAGE FROM CLOUDINARY
    const deleteCover = await cloudinary.uploader.destroy(
      subCategory.cover.public_id
    );
    if (!deleteCover)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Delete Cover Image" });

    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);
    if (!deletedSubcategory)
      return res
        .status(400)
        .json({ success: false, message: "Couldn't Delete SubCategory" });

    return res
      .status(200)
      .json({ success: true, message: "SubCategory Deleted Successfully" });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getSubCategories = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const subCategories = await Subcategory.find()
      .limit(limit)
      .skip(skip)
      .sort({ name: 1 });

    if (!subCategories)
      return res
        .status(400)
        .json({ success: false, message: "No Found SubCategories" });

    return res.status(200).json({
      success: true,
      message: "Found SubCategories Successfully",
      data: subCategories,
    });
  } catch (error) {}
};

export const getSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subcateogry = await Subcategory.findById(id);
    if (!subcateogry)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find SubCategory" });

    return res.status(200).json({ success: true, data: subcateogry });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getSubcategoryOfCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Category Id" });

    const subcategory = await Subcategory.find({ category: id });
    if (!subcategory)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find SubCategory of this Category",
      });

    return res
      .status(200)
      .json({
        success: true,
        message: "SubCategory Fetched Successfully",
        data: subcategory,
      });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
