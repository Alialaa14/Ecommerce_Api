// GET ALL VARIANTS OF A PRODUCT
// GET CERTIAN VARIANT
// UPDATE CERTIAN VARIANT
// DELETE CERTIAN VARIANT

import mongoose from "mongoose";
import CustomError from "../utils/Custom-Api-error.js";
import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";
import cloudinary from "../utils/cloudinary.js";

export const variantsOfProduct = async (req, res, next) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Product" });

    const product = await Product.findById(productId).populate("variants");

    if (!product)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find Product's Variants",
      });

    return res.status(200).json({
      success: true,
      message: "Variants Fetched Successfully",
      data: product.variants,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getVariant = async (req, res, next) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const variantId = new mongoose.Types.ObjectId(req.params.variantId);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Product Id " });
    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Variant Id" });

    const product = await Product.findById(productId).populate("variants");

    if (!product)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find Product's Variants",
      });

    const variant = product.variants.find(
      (v) => v._id.toString() == variantId.toString()
    );

    if (!variant)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Varaiant" });

    return res.status(200).json({
      success: true,
      message: "Variant Fetched Successfully",
      data: variant,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const updateVariant = async (req, res, next) => {
  try {
    // THE ADMIN IS ALLOWED TO CHANGE THE PICTURES OF MAX 3 PCS
    // ALLOWD TO ADD SIZES THAT IS NOT EXISTED
    // ADD QUNATITY TO EXISTED SIZE
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const variantId = new mongoose.Types.ObjectId(req.params.variantId);
    const { size } = req.query;
    const { quantity } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Product Id " });
    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Variant Id" });

    const product = await Product.findById(productId).populate("variants");

    const variant = product.variants.find(
      (v) => v._id.toString() == variantId.toString()
    );

    if (!variant)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Varaiant" });

    const variantSize = variant.sizes.find((s) => s.name == size);

    if (variantSize) {
      variantSize.quantity += Number(quantity);
    } else {
      variant.sizes.push({ name: size, quantity: Number(quantity) });
    }

    await variant.save();

    return res.status(200).json({
      success: true,
      message: "Variant Updated Successfully",
      data: variant,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const deleteVariant = async (req, res, next) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const variantId = new mongoose.Types.ObjectId(req.params.variantId);
    const { size } = req.query;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Product Id " });
    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Variant Id" });

    const product = await Product.findById(productId).populate("variants");

    if (!product)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find Product's Variants",
      });

    const variant = product.variants.find(
      (v) => v._id.toString() == variantId.toString()
    );

    if (!variant)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Varaiant" });

    if (size) {
      const variantSize = variant.sizes.find((s) => s.name == size);
      if (!variantSize)
        return res
          .status(400)
          .json({ success: false, message: "We Couldn't Find Varaiant Size" });

      variant.sizes = variant.sizes.filter((s) => s.name != size);
      await variant.save();

      return res.status(200).json({
        success: true,
        message: "Variant Size Deleted Successfully",
        data: variant,
      });
    }

    const deletedVariant = await Variant.findByIdAndDelete(variantId);

    if (!deletedVariant)
      return res
        .status(400)
        .json({ success: false, message: "Error While Deleting Varaiant" });

    const updateProduct = await Product.findByIdAndUpdate(productId, {
      $pull: { variants: variantId },
    });

    return res.status(200).json({
      success: true,
      message: "Variant Deleted Successfully",
      data: updateProduct,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const addImage = async (req, res, next) => {
  try {
    const images = req.files;

    if (!images || !images.length)
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });

    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const variantId = new mongoose.Types.ObjectId(req.params.variantId);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Product Id " });

    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Variant Id" });

    const product = await Product.findById(productId).populate("variants");

    if (!product)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find Product's Variants",
      });

    const variant = product.variants.find(
      (v) => v._id.toString() == variantId.toString()
    );

    if (!variant)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Varaiant" });

    if (images.length + variant.pictures.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 images are allowed",
      });
    }

    const uploadedImages = await Promise.all(
      images.map(async (img) => {
        if (!img.path)
          throw new Error(
            "Image path is missing. Make sure you uploaded a file from Postman."
          );

        const { public_id, secure_url } = await cloudinary.uploader.upload(
          img.path,
          {
            folder: `${product._id}-${variant._id}-${variant.color.name}`,
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

    variant.pictures.push(...uploadedImages);
    await variant.save();

    return res.status(200).json({
      success: true,
      message: "Images Added Successfully",
      data: variant,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.query;
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const variantId = new mongoose.Types.ObjectId(req.params.variantId);

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Product Id " });

    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId))
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Variant Id" });

    const product = await Product.findById(productId).populate("variants");

    if (!product)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find Product's Variants",
      });

    const variant = product.variants.find(
      (v) => v._id.toString() == variantId.toString()
    );

    if (!variant)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Varaiant" });

    const image = variant.pictures.filter((img) => img.public_id !== imageId);

    variant.pictures = image;

    await variant.save();
    await cloudinary.uploader.destroy(imageId);

    return res.status(200).json({
      success: true,
      message: "Image Deleted Successfully",
      data: variant,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
