const CategoryModel = require('../models/categories.model');

const { saveModel } = require('./saveModel');

const mongoose = require('mongoose');

const addCats = (name, voiceBool) => {
    let position = CategoryModel.findAll().length+1;

    const newCat = new CategoryModel({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      position: position,
      voice: voiceBool,
    });
  
    saveModel(newCat);
}

const loadCats = async () => {
    // addCats(`room 1`, 1);
    // addCats(`room 2`, 2);
    // addCats(`room 3`, 3);
    // addCats(`room 4`, 4);
    // addCats(`room 5`, 5);
    // addCats(`room 6`, 6);
    // addCats(`room 7`, 7);
    // addCats(`voice 1`, 8);
    // addCats(`voice 2`, 9);
    // addCats(`voice 3`, 10);

    return await CategoryModel.find().sort({"position": 1}).exec();
}

const getVoiceRooms = async () => {
    let voices = {};

    await CategoryModel.find({ voice: true })
    .exec()
    .then(roomName => {
        voices[roomName] = []; // roomName: [socket.id, ice-candidate]
    });

    return voices;
}

module.exports = {
    loadCats,
    getVoiceRooms,
}