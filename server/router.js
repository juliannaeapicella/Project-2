const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPlants', mid.requiresLogin, controllers.Plant.getPlants);
  app.delete('/deletePlant', mid.requiresLogin, controllers.Plant.deletePlant);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.put('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.get('/premium', mid.requiresLogin, controllers.Account.isPremium);
  app.put('/premium', mid.requiresLogin, controllers.Account.enablePremium);
  app.get('/makePlant', mid.requiresLogin, controllers.Plant.makerPage);
  app.post('/makePlant', mid.requiresLogin, controllers.Plant.makePlant);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
