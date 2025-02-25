const MenuItems = require("../db/models/menuItems.js");

const getAll = async (req, res) => {
  try {
    const menu = await MenuItems.getAll();
    res.send(menu);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOne = async (req, res) => {
  try {
    const menu = await MenuItems.getOne(req.params.id);
    res.send(menu);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getBySearch = async (req, res) => {
  try {
    const menuItems = await MenuItems.getBySearch(req.query.q);
    res.send(menuItems);
  } catch (error) {
    res.status(500).send(error);
  }
};

const create = async (req, res) => {
  try {
    const menu = await MenuItems.create(req.body);
    res.send(menu);
  } catch (error) {
    res.status(500).send(error);
  }
};

const update = async (req, res) => {
  const updateFields = req.body;
  updateFields.updatedAt = Date.now();
  try {
    const menuItem = await MenuItems.update(req.params.id, updateFields);
    res.send(menuItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteItem = async (req, res) => {
  try {
    const menuItemId = await MenuItems.deleteItem(req.params.id);
    res.send(menuItemId);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getAll, getOne, getBySearch, create, update, deleteItem };
