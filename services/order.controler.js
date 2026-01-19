import { io } from "../server.js";
import CustomError from "../utils/Custom-Api-error.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";
import mongoose from "mongoose";
import Variant from "../models/variant.model.js";
export const createOrder = async (req, res, next) => {
  try {
    const user = req.user.user._id;

    const { paymentMethod, address } = req.body;
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return res
        .status(400)
        .json({ success: false, message: "User is required" });
    }

    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is required" });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!address || address.length < 10 || address.length > 50) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address" });
    }
    const availablePaymentMethods = ["cash", "visa"];
    if (!paymentMethod || !availablePaymentMethods.includes(paymentMethod)) {
      return res
        .status(400)
        .json({ success: false, message: "Payment method is required" });
    }

    const coupon = await Coupon.findById(cart.coupon);

    if (coupon) {
      if (coupon.used) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon already used" });
      }

      if (new Date(coupon.expiry) < Date.now()) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon expired" });
      }

      coupon.used = true;
      await coupon.save();
    }

    // DECREASE THE AMOUNT OF THE PRODUCT

    await Promise.all(
      cart.products.map(async (product) => {
        const resut = await Variant.findOneAndUpdate(
          {
            _id: product.variantId,
            sizes: { $elemMatch: { name: product.variant.name } },
          },
          {
            $inc: {
              "sizes.$.quantity": -product.quantity,
              "sizes.$.sold": product.quantity,
            },
          },
          { new: true }
        );
      })
    );

    // CREATE THE ORDER
    const order = await Order.create({
      user,
      products: cart.products,
      orderNote: cart.orderNote,
      orderCoupon: cart.coupon,
      paymentMethod,
      address,
      total: cart.totalPrice,
    });

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Error creating order" });
    }

    //TODO -- PAYMENT GATEWAY

    await Cart.findOneAndUpdate(
      { user },
      { $set: { products: [], note: "", coupon: null, totalPrice: 0 } }
    );
    io.to("admin").emit("createOrder", order);

    return res.status(200).json({ success: true, message: "Order created" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.user._id }).sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .json({ success: true, message: "Orders Fetched", data: orders });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(400)
        .json({ success: false, message: "Order Not Found" });
    return res
      .status(200)
      .json({ success: true, message: "Order Fetched", data: order });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(400)
        .json({ success: false, message: "Order Not Found" });

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "Status is Required" });

    if (status === "cancelled") {
      await Promise.all(
        order.products.map(async (product) => {
          const result = await Variant.findOneAndUpdate(
            {
              _id: product.variantId,
              sizes: { $elemMatch: { name: product.variant.name } },
            },
            {
              $inc: {
                "sizes.$.quantity": product.quantity,
                "sizes.$.sold": -product.quantity,
              },
            },
            { new: true }
          );
          // FETCH EXACLTY SIZE OF THE VARIANT
        })
      );
    }
    order.orderStatus = status;
    await order.save();
    return res
      .status(200)
      .json({ success: true, message: "Order Updated", data: order });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
