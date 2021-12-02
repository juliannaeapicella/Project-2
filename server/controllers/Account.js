const models = require('../models');
const { AccountModel } = require('../models/Account');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/makePlant' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/makePlant' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

const changePasswordPage = (req, res) => {
  res.render('changePassword', { csrfToken: req.csrfToken() });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  const { username } = req.session.account;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.oldPass || !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required.' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match.' });
  }

  return Account.AccountModel.authenticate(username, req.body.oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      const accountData = {
        salt,
        password: hash,
      };

      Account.AccountModel.updatePassword(username, accountData.salt, accountData.password, () => res.json({redirect: '/logout' }));
    });
  });
};

const enablePremium = (req, res) => {
  const { _id } = req.session.account;
  Account.AccountModel.enablePremium(_id, () => res.json({ redirect: '/makePlant' }));
};

const isPremium = (req, res) => {
  const { username } = req.session.account;
  Account.AccountModel.findByUsername(
    username,
    (_err, doc) => res.json({ isPremium: doc.isPremium }),
  );
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePasswordPage = changePasswordPage;
module.exports.changePassword = changePassword;
module.exports.enablePremium = enablePremium;
module.exports.isPremium = isPremium;
module.exports.getToken = getToken;
