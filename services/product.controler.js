/*
    PRODUCT CONTROLER 

    -- CREATE PRODUCT (USING MAIN INFO AND MAKE VARIANT)
    -- UPDATE PRODUCT (ALSO UPDATE VARIANT)
    -- DELETE PRODUCT (ALL VARIANT OR CERTIAN ONE )
    -- GET ALL PRODUCTS (USING CATEGORY OR SUB OR USING TAG - SORT AND PAGINATION)
    -- GET CERTAIN PRODUCT
*/

import mongoose from "mongoose";
import Product from "../models/product.model.js";
import CustomError from "../utils/Custom-Api-error.js";
import cloudinary from "../utils/cloudinary.js";
import Variant from "../models/variant.model.js";
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, subcategory, price, variant } = req.body;
    const images = req.files;

    if (!images || !images.length)
      return res
        .status(400)
        .json({ success: false, message: "Images are required" });

    // CHECK IF THE PRODUCT EXISTS
    const existingProduct = await Product.findOne({ name });

    if (!existingProduct) {
      // CREATE BASE PRODUCT
      const newProduct = await Product.create({
        name,
        description,
        subcategory: new mongoose.Types.ObjectId(subcategory),
        price,
      });

      if (!newProduct)
        return res
          .status(400)
          .json({ success: false, message: "We Couldn't Create a Product" });

      // CREATE VARIANT FIRST (without images)
      const newVariant = await Variant.create({
        product: newProduct._id,
        color: variant.color,
        sizes: variant.sizes,
        pictures: [], // will update after images upload
      });

      // UPLOAD IMAGES TO CLOUDINARY
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.path)
            throw new Error(
              "Image path is missing. Make sure you uploaded a file from Postman."
            );

          const { public_id, secure_url } = await cloudinary.uploader.upload(
            img.path,
            {
              folder: `${newProduct._id}-${newVariant._id}-${variant.color.name}`,
            }
          );

          if (!public_id || !secure_url)
            return res.status(400).json({
              success: false,
              message: "Couldn't upload Cover Image Of Product",
            });

          return { public_id, secure_url };
        })
      );

      // UPDATE VARIANT WITH UPLOADED IMAGES
      newVariant.pictures = uploadedImages;
      await newVariant.save();

      // OPTIONAL: add variant to product's variants array
      newProduct.variants.push(newVariant._id);
      await newProduct.save();

      return res
        .status(201)
        .json({ success: true, message: "Product Created Successfully" });
    }

    // CHECK THE VARIANT EXISTED OR NOT
    const existingVariant = await Variant.findOne({
      $and: {
        product: existingProduct._id,
        color: variant.color,
        sizes: variant.sizes,
      },
    });
    // IF NOT → CREATE NEW VARIANT
    if (!existingVariant) {
      const newVariant = await Variant.create({
        product: existingProduct._id,
        color: variant.color,
        sizes: variant.sizes,
      });

      if (!newVariant)
        return res
          .status(400)
          .json({ success: false, message: "We Couldn't Create Variant" });

      // UPLOAD IMAGES
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.path)
            throw new Error(
              "Image path is missing. Make sure you uploaded a file from Postman."
            );

          const { public_id, secure_url } = await cloudinary.uploader.upload(
            img.path,
            {
              folder: `${newProduct._id}-${newVariant._id}-${variant.color.name}`,
            }
          );

          if (!public_id || !secure_url)
            return res.status(400).json({
              success: false,
              message: "Couldn't upload Cover Image Of Product",
            });

          return { public_id, secure_url };
        })
      );

      newVariant.pictures = uploadedImages;
      await newVariant.save();

      return res.status(400).json({
        success: true,
        message: "Variant Created Successfully",
        data: newVariant,
      });
    }
    // IF YES FIND THE VARIANT BY COLOR AND SIZE AND UPDATE THE QUANTITY AND IMAGES
    for (let x = 0; x < variant.sizes.length; x++) {
      const size = variant.sizes[x];
      const existingSize = existingVariant.sizes.find(
        (s) => s.name === size.name
      );
      if (existingSize) {
        existingSize.quantity += Number(size.quantity);
      } else {
        existingVariant.sizes.push(size);
      }
      await existingVariant.save();
    }
    // CHECK IF THE IMAGES IS LOWER THAN 5 PICS THEN UPLOAD THEM TO CLOUDINARY AND ADD PICS TO THE VARIANT
    if (existingVariant.pictures.length < 5) {
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.path)
            throw new Error(
              "Image path is missing. Make sure you uploaded a file from Postman."
            );

          const { public_id, secure_url } = await cloudinary.uploader.upload(
            img.path,
            {
              folder: `${existingProduct._id}-${existingVariant._id}-${variant.color.name}`,
            }
          );

          if (!public_id || !secure_url)
            return res.status(400).json({
              success: false,
              message: "Couldn't upload Cover Image Of Product",
            });

          return { public_id, secure_url };
        })
      );
      existingVariant.pictures.push(...uploadedImages);
      await existingVariant.save();
    }
    // IF NOT THEN RETURN ERROR OR RES.JSON({success: false, message: "You can upload only 5 pics"})
    else {
      return res
        .status(400)
        .json({ success: false, message: "You can upload only 5 pics" });
    }

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: existingProduct,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, subcategory, price } = req.body;
    const images = req.files;

    if (!images || !images.length)
      return res
        .status(400)
        .json({ success: false, message: "Images are required" });

    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product Id" });

    // CHECK IF THE PRODUCT IS EXISTED OR NOT
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "We couldn't find the Product" });

    // WHEN UPDATE THE PRODUCT IT WILL UPDATE THE BASIC ONLY
    const newProduct = await Product.findByIdAndUpdate(id, {
      name,
      description,
      subcategory,
      price,
    });

    if (!newProduct)
      return res
        .status(400)
        .json({ success: false, message: "We couldn't update the Product" });

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      data: newProduct,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product Id" });
    }

    const product = await Product.findByIdAndDelete(id);
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const subcategory = req.query.subcategory;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    if (!subcategory || !mongoose.Types.ObjectId.isValid(subcategory)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product Id" });
    }

    const products = await Product.find({
      $and: [{ name: { $regex: search, $options: "i" } }, { subcategory }],
    })
      .populate("variants")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find The Product",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      data: products,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product Id" });

    const product = await Product.findById(id).populate("variants");

    if (!product)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find The Product",
      });

    product.views += 1;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      data: product,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
