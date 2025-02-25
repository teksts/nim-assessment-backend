const mongoose = require("../db.js");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "MenuItems"
      },

      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
orderSchema.set("toJSON", {
  virtuals: true
});
orderSchema.statics.calcTotal = (items) =>
  items.reduce((total, item) => total + item.item.price * item.quantity, 0);

// order model
const Order = mongoose.model("Order", orderSchema);

const getAll = async () => {
  // populate each item
  const orders = await Order.find().populate("items.item");

  return orders;
};

const getOne = async (id) => {
  const order = await Order.findById(id).populate("items.item");
  return order;
};

const create = async (body) => {
  const order = await Order.create(body);
  return order;
};

const update = async (id, body) => {
  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  return order;
};

const remove = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order.id;
};

const getOrderByDate = async (startParam, endParam) => {
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(startParam),
      $lte: new Date(endParam)
    }
  }).populate("items.item");
  return orders;
};

const calcTotalSales = (orders) => {
  const sales = { total: 0 };
  orders.forEach((order) => {
    const subtotal = Order.calcTotal(order.items);
    sales.total += subtotal;
  });
  return sales;
};

const getByStatus = async (statusParam, startParam, endParam) => {
  let orders;
  if (startParam) {
    orders = await Order.find({
      status: statusParam,
      createdAt: {
        $gte: new Date(startParam),
        $lte: new Date(endParam)
      }
    }).populate("items.item");
  } else {
    orders = await Order.find({
      status: statusParam
    }).populate("items.item");
  }
  return orders;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getByStatus,
  getOrderByDate,
  calcTotalSales,
  Order
};
