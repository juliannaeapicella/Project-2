const models = require('../models');

const { Plant } = models;

// render main app page
const makerPage = (req, res) => {
  Plant.PlantModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), plants: docs });
  });
};

// create a new plant object
const makePlant = (req, res) => {
  if (!req.body.species
        || !req.body.location
        || !req.body.needs
        || !req.body.lastWatered) {
    return res.status(400).json({ error: 'Species, location, watering needs, and date of last watering are required.' });
  }

  const plantData = {
    species: req.body.species,
    location: req.body.location,
    needs: req.body.needs,
    lastWatered: req.body.lastWatered,
    image: req.body.image ? req.body.image : undefined,
    owner: req.session.account._id,
  };

  const newPlant = new Plant.PlantModel(plantData);

  const plantPromise = newPlant.save();

  plantPromise.then(() => res.json({ redirect: '/makePlant' }));

  plantPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Plant already exists.' });
    }

    return res.status(400).json({ error: 'An error occured!' });
  });

  return plantPromise;
};

// get all plants associated with a username
const getPlants = (request, response) => {
  const req = request;
  const res = response;

  return Plant.PlantModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ plants: docs });
  });
};

// delete a plant object with the given id
const deletePlant = (request, response) => Plant.PlantModel.delete(request.body.id, (err) => {
  if (err) {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  }

  return response.json({ redirect: '/makePlant' });
});

module.exports.makerPage = makerPage;
module.exports.getPlants = getPlants;
module.exports.deletePlant = deletePlant;
module.exports.makePlant = makePlant;
