/*
    CART CONTROLER 
    -- CREATE CART WHEN REGISTER
    -- ADD TO CART
    -- UPDATE CART (VARIANT INCREASE OR DECREASE) OR NOTE AND COUPON
    -- DELETE CART
    -- GET CART
*/

import mongoose, { Schema } from "mongoose";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Variant from "../models/variant.model.js";
import CustomError from "../utils/Custom-Api-error.js";
import Coupon from "../models/coupon.model.js";

export const addToCart = async (req, res, next) => {
  try {
    const user = new mongoose.Types.ObjectId(req.user.user._id);
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    let { color, size, quantity } = req.body;
    quantity = quantity || 1;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({
        success: false,
        message: "Invalid Product Id",
      });

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find The Product" });

    const cart = await Cart.findOne({ user });
    if (!cart)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find The Cart",
      });

    // GET THE EXACTLY THE SIZE OF THE VARIANT
    const variant = await Variant.findOne({
      product: productId,
      color,
    });
    if (!variant)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find The Variant" });

    const exactSize = variant.sizes.find((s) => {
      if (s.name === size) {
        return s;
      }
    });

    if (!exactSize)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find The Size" });

    // Check The Stock
    if (exactSize.quantity < quantity)
      return res.status(400).json({
        success: false,
        message: "The Stock Is Not Enough",
      });

    // CHECK IF THE ITEM IS ALREADY IN THE CART
    const isExistInCart = cart.products.find((p) => {
      if (p.productId.toString() === productId.toString()) {
        if (p.variant.name === exactSize.name && p.color === color) {
          return p;
        }
      }
    });

    if (isExistInCart) {
      isExistInCart.quantity += Number(quantity);
      cart.subtotal += Number(product.price) * Number(quantity);
      await cart.save();
      return res
        .status(200)
        .json({ success: true, message: "Item Added To Cart" });
    }

    const cartItem = {
      productId: productId,
      variantId: variant._id,
      color: color,
      variant: exactSize,
      quantity,
      picture: {
        public_id: variant.pictures[0].public_id,
        secure_url: variant.pictures[0].secure_url,
      },
    };
    cart.subtotal += Number(product.price) * Number(quantity);
    cart.totalPrice = cart.subtotal;
    cart.products.push(cartItem);
    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Item Added To Cart" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const variantId = new mongoose.Types.ObjectId(req.params.variantId);
    const userId = new mongoose.Types.ObjectId(req.user.user._id);
    const productId = new mongoose.Types.ObjectId(req.params.productId);

    if (!variantId || !mongoose.Types.ObjectId.isValid(variantId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Variant Id" });
    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product Id" });

    const cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find The Product" });

    if (!cart)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find The Cart",
      });

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { _id: variantId } } },
      { new: true }
    );

    if (!updatedCart)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Update The Cart" });

    const updatedTotalPrice = updatedCart.products.reduce((acc, p) => {
      return acc + Number(product.price) * Number(p.quantity);
    }, 0);

    cart.subtotal = updatedTotalPrice;
    cart.totalPrice = subtotal;
    await cart.save();
    return res.status(200).json({ success: true, message: "Item Removed" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.user._id);
    const { note, coupon } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid User Id" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res.status(400).json({
        success: false,
        message: "We Couldn't Find The Cart",
      });

    if (note) {
      if (note.length > 100)
        return res.status(400).json({
          success: false,
          message: "Note Is Too Long",
        });

      cart.orderNote = note;
      await cart.save();
      return res.status(200).json({ success: true, message: "Note Updated" });
    }

    const couponCode = await Coupon.findOne({ code: coupon });
    if (!couponCode)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Coupon Code" });

    if (couponCode.expiry < Date.now())
      return res.status(400).json({
        success: false,
        message: "Coupon Is Expired",
      });

    if (couponCode.used)
      return res.status(400).json({
        success: false,
        message: "Coupon Is Already Used",
      });

    cart.coupon = couponCode.id;
    cart.totalPrice =
      cart.subtotal - (cart.subtotal * couponCode.discount) / 100;
    await cart.save();
    return res.status(200).json({ success: true, message: "Coupon Applied" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const cancelCoupon = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.user._id);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid User Id" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res
        .status(400)
        .json({ success: false, message: "Cart Not Found" });

    const couponUsed = cart.coupon;
    const coupon = await Coupon.findById(couponUsed);
    if (!coupon)
      return res
        .status(400)
        .json({ success: false, message: "Coupon Not Found" });

    cart.totalPrice = cart.totalPrice + (cart.subtotal * coupon.discount) / 100;
    cart.coupon = null;
    await cart.save();

    return res.status(200).json({ success: true, message: "Coupon Cancelled" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
export const resetCart = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.user._id);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid User Id" });

    const resetedCart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          products: [],
          totalPrice: 0,
          subtotal: 0,
          coupon: null,
          orderNote: "",
        },
      },
      { new: true }
    );

    if (!resetedCart)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Reset Cart" });

    return res
      .status(200)
      .json({ success: true, message: "Cart Reseted Successfully" });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.user._id);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid User Id" });

    const cart = await Cart.findOne({ user: userId })
      .populate("coupon")
      .populate("products.productId");
    if (!cart)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find The Cart" });

    return res.status(200).json({
      success: true,
      message: "Cart Fetched Successfully",
      data: cart,
    });
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
