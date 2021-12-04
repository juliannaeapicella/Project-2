"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty.");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match.");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign In"
  }));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  }));
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.currentTarget.classList.add("current");
    loginButton.classList.remove("current");
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.currentTarget.classList.add("current");
    signupButton.classList.remove("current");
    createLoginWindow(csrf);
    return false;
  });
  loginButton.classList.add("current");
  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var toggleModal = function toggleModal(e) {
  var modal = document.querySelector("#modal");
  var isClosed = modal.style.display === 'none' || modal.style.display === '';

  if (isClosed) {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
};

var convertDateToYYYYMMDD = function convertDateToYYYYMMDD(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (day < 10) {
    day = '0' + day;
  }

  if (month < 10) {
    month = '0' + month;
  }

  return year + '-' + month + '-' + day;
};

var addDays = function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + (days + 1));
  return result;
};

var convertNeedsToDays = function convertNeedsToDays(location, needs) {
  var days = location === 'Indoors' ? [1, 3, 7, 7, 7] : [2, 4, 7, 10, 14];

  switch (needs) {
    case 1:
      return days[0];

    case 2:
      return days[1];

    case 3:
      return days[2];

    case 4:
      return days[3];

    case 5:
      return days[4];

    default:
      return days[2];
  }
};

var convertNeedsToString = function convertNeedsToString(needs) {
  switch (needs) {
    case 1:
      return "Very High";

    case 2:
      return "High";

    case 3:
      return "Average";

    case 4:
      return "Low";

    case 5:
      return "Very Low";

    default:
      return "Average";
  }
};

var calculateNextWateringDate = function calculateNextWateringDate(plant) {
  var date = addDays(plant.lastWatered, convertNeedsToDays(plant.location, plant.needs));
  return convertDateToYYYYMMDD(date);
};

var compareStrings = function compareStrings(str1, str2) {
  if (str1 < str2) {
    return -1;
  }

  if (str1 > str2) {
    return 1;
  }

  return 0;
};

var sortBySpecies = function sortBySpecies(arr, isAscending) {
  if (isAscending) {
    arr.sort(function (a, b) {
      return compareStrings(a.species, b.species);
    });
  } else {
    arr.sort(function (a, b) {
      return compareStrings(b.species, a.species);
    });
  }
};

var sortByLastWatered = function sortByLastWatered(arr, isAscending) {
  if (isAscending) {
    arr.sort(function (a, b) {
      return new Date(a.lastWatered) - new Date(b.lastWatered);
    });
  } else {
    arr.sort(function (a, b) {
      return new Date(b.lastWatered) - new Date(a.lastWatered);
    });
  }
};

var sortByToWaterNext = function sortByToWaterNext(arr, isAscending) {
  if (isAscending) {
    arr.sort(function (a, b) {
      return new Date(calculateNextWateringDate(a)) - new Date(calculateNextWateringDate(b));
    });
  } else {
    arr.sort(function (a, b) {
      return new Date(calculateNextWateringDate(b)) - new Date(calculateNextWateringDate(a));
    });
  }
};

var sortPlants = function sortPlants(plants) {
  var currentSort = document.querySelector('#sort').value;
  var buttons = document.querySelectorAll('.sortDirection');
  var isAscending;

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].checked) {
      isAscending = buttons[i].value === 'true';
    }
  }

  switch (currentSort) {
    case '1':
      sortByLastWatered(plants, isAscending);
      break;

    case '2':
      sortByToWaterNext(plants, isAscending);
      break;

    case '3':
      sortBySpecies(plants, isAscending);
      break;

    default:
      sortBySpecies(plants, isAscending);
      break;
  }
};

var hideAds = function hideAds() {
  var ads = document.querySelectorAll(".ad");

  for (var i = 0; i < ads.length; i++) {
    ads[i].style.display = "none";
  }
};
