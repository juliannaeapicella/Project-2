const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PlantModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PlantSchema = new mongoose.Schema({
  species: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  location: {
    type: String,
    required: true,
  },

  needs: {
    type: Number,
    min: 0,
    required: true,
  },

  lastWatered: {
    type: Date,
    max: Date.now,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  image: {
    type: String,
    default: 'https://www.ikea.com/us/en/images/products/fejka-artificial-potted-plant-with-pot-indoor-outdoor-succulent__0614211_pe686835_s5.jpg?f=s',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PlantSchema.statics.toAPI = (doc) => ({
  species: doc.species,
  location: doc.location,
  needs: doc.needs,
  lastWatered: doc.lastWatered,
  image: doc.image,
});

// find plants by owner id
PlantSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PlantModel.find(search).select('species location needs lastWatered image').lean().exec(callback);
};

// delete plant with the given id
PlantSchema.statics.delete = (id, callback) => PlantModel.deleteOne({ _id: id }).exec(callback);

PlantModel = mongoose.model('Plant', PlantSchema);

module.exports.PlantModel = PlantModel;
module.exports.PlantSchema = PlantSchema;
