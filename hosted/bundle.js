"use strict";

var token;
var isPremium;

var handlePlant = function handlePlant(e) {
  e.preventDefault();

  if ($("#plantSpecies").val() == '' || $("#plantLocation").val() == '' || $("#plantNeeds").val() == '' || $("#plantLastWatered").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('POST', $("#plantForm").attr("action"), $("#plantForm").serialize(), function () {
    toggleModal();
    loadPlantsFromServer();
  });
  return false;
};

var deletePlant = function deletePlant(e) {
  e.preventDefault();
  var data = "id=".concat(e.currentTarget.parentElement.parentElement.id, "&_csrf=").concat(token);
  sendAjax('DELETE', "/deletePlant", data, function () {
    loadPlantsFromServer();
  });
  return false;
};

var editPlant = function editPlant(e) {
  e.preventDefault();
  var id = e.currentTarget.id.split('-')[0];
  var data = "id=".concat(id, "&_csrf=").concat(token);

  if ($("#plantSpeciesEdit").val() == '' || $("#plantLocationEdit").val() == '' || $("#plantNeedsEdit").val() == '' || $("#plantLastWateredEdit").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('DELETE', "/deletePlant", data, function () {
    sendAjax('POST', '/makePlant', $("#" + id + "-edit").serialize(), function () {
      toggleModal();
      loadPlantsFromServer();
    });
  });
  return false;
};

var handlePasswordChange = function handlePasswordChange(e) {
  e.preventDefault();

  if ($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords do not match.");
    return false;
  }

  sendAjax('PUT', $("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize(), redirect);
  return false;
};

var subscribeToPremium = function subscribeToPremium(e) {
  e.preventDefault();
  sendAjax('PUT', $("#premiumForm").attr("action"), $("#premiumForm").serialize(), redirect);
  hideAds();
  return false;
};

var PlantForm = function PlantForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "plantForm",
    onSubmit: handlePlant,
    name: "plantForm",
    action: "/makePlant",
    method: "POST",
    className: "plantForm"
  }, /*#__PURE__*/React.createElement("span", {
    id: "closeButton",
    onClick: toggleModal
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times-circle"
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: "species"
  }, "Species: "), /*#__PURE__*/React.createElement("input", {
    id: "plantSpecies",
    type: "text",
    name: "species",
    placeholder: "Mint, Rose, etc."
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "location"
  }, "Location: "), /*#__PURE__*/React.createElement("select", {
    id: "plantLocation",
    name: "location"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Indoors"
  }, "Indoors"), /*#__PURE__*/React.createElement("option", {
    value: "Outdoors"
  }, "Outdoors")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "needs"
  }, "Watering Needs: "), /*#__PURE__*/React.createElement("select", {
    id: "plantNeeds",
    name: "needs"
  }, /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "Very High"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "High"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "Average"), /*#__PURE__*/React.createElement("option", {
    value: "4"
  }, "Low"), /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "Very Low")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "lastWatered"
  }, "Last Watered On: "), /*#__PURE__*/React.createElement("input", {
    id: "plantLastWatered",
    type: "date",
    name: "lastWatered",
    max: props.today
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "image"
  }, "Image URL (optional): "), /*#__PURE__*/React.createElement("input", {
    id: "plantImage",
    type: "text",
    name: "image"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makePlantSubmit",
    type: "submit",
    value: "Add Plant"
  }), /*#__PURE__*/React.createElement("p", {
    className: "error"
  }, /*#__PURE__*/React.createElement("span", {
    id: "errorMessage"
  })));
};

var SortPanel = function SortPanel() {
  return /*#__PURE__*/React.createElement("div", {
    id: "sortPanel"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "sort"
  }, "Sort Plants By: "), /*#__PURE__*/React.createElement("select", {
    id: "sort",
    name: "sort",
    defaultValue: "1",
    onChange: loadPlantsFromServer
  }, /*#__PURE__*/React.createElement("option", {
    value: 1
  }, "Last Watered"), /*#__PURE__*/React.createElement("option", {
    value: 2
  }, "To Water Next"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "Species")), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    id: "ascending",
    className: "sortDirection",
    name: "sortDirection",
    value: true,
    onChange: loadPlantsFromServer,
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "ascending"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-up"
  })), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    id: "descending",
    className: "sortDirection",
    name: "sortDirection",
    value: false,
    onChange: loadPlantsFromServer
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "descending"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-down"
  })));
};

var PlantList = function PlantList(props) {
  if (props.plants.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "plantList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPlant"
    }, "No Plants yet!"));
  }

  sortPlants(props.plants);
  var plantNodes = props.plants.map(function (plant) {
    var lastWatered = plant.lastWatered.split('T')[0];
    return /*#__PURE__*/React.createElement("div", {
      key: plant._id,
      id: plant._id,
      className: "plant"
    }, /*#__PURE__*/React.createElement("img", {
      "data-value": plant.image,
      className: "plantImage",
      src: plant.image,
      alt: plant.species,
      width: "100",
      height: "100"
    }), /*#__PURE__*/React.createElement("h3", {
      "data-value": plant.species,
      className: "plantSpecies"
    }, "Species: ", /*#__PURE__*/React.createElement("b", null, plant.species), " "), /*#__PURE__*/React.createElement("h3", {
      "data-value": plant.location,
      className: "plantLocation"
    }, "Location: ", /*#__PURE__*/React.createElement("b", null, plant.location), " "), /*#__PURE__*/React.createElement("h3", {
      "data-value": plant.needs,
      className: "plantNeeds"
    }, "Watering Needs: ", /*#__PURE__*/React.createElement("b", null, convertNeedsToString(plant.needs)), " "), /*#__PURE__*/React.createElement("h3", {
      "data-value": lastWatered,
      className: "plantLastWatered"
    }, "Last Watered On: ", /*#__PURE__*/React.createElement("b", null, lastWatered), " "), /*#__PURE__*/React.createElement("h3", {
      className: "plantNextWatering"
    }, "Water On: ", /*#__PURE__*/React.createElement("b", null, calculateNextWateringDate(plant)), " "), /*#__PURE__*/React.createElement("div", {
      className: "buttons"
    }, /*#__PURE__*/React.createElement("button", {
      className: "deletePlant",
      onClick: deletePlant
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash-alt"
    }), " Remove"), /*#__PURE__*/React.createElement("button", {
      className: "editPlant",
      onClick: openEditPlant
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-edit"
    }), " Edit")));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "plantList"
  }, !isPremium && /*#__PURE__*/React.createElement(AdPlacement, null), plantNodes, !isPremium && /*#__PURE__*/React.createElement(AdPlacement, null));
};

var EditPlantNode = function EditPlantNode(props) {
  return /*#__PURE__*/React.createElement("form", {
    key: props.plant.id + "-edit",
    id: props.plant.id + "-edit",
    onSubmit: editPlant,
    className: "editing-plant"
  }, /*#__PURE__*/React.createElement("span", {
    id: "closeButton",
    onClick: toggleModal
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times-circle"
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: "species"
  }, "Species: "), /*#__PURE__*/React.createElement("input", {
    id: "plantSpeciesEdit",
    type: "text",
    name: "species",
    placeholder: "Mint, Rose, etc.",
    defaultValue: props.plant.species
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "location"
  }, "Location: "), /*#__PURE__*/React.createElement("select", {
    id: "plantLocationEdit",
    name: "location",
    defaultValue: props.plant.location
  }, /*#__PURE__*/React.createElement("option", {
    value: "Indoors"
  }, "Indoors"), /*#__PURE__*/React.createElement("option", {
    value: "Outdoors"
  }, "Outdoors")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "needs"
  }, "Watering Needs: "), /*#__PURE__*/React.createElement("select", {
    id: "plantNeedsEdit",
    name: "needs",
    defaultValue: props.plant.needs
  }, /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "Very High"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "High"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "Average"), /*#__PURE__*/React.createElement("option", {
    value: "4"
  }, "Low"), /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "Very Low")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "lastWatered"
  }, "Last Watered On: "), /*#__PURE__*/React.createElement("input", {
    id: "plantLastWateredEdit",
    type: "date",
    name: "lastWatered",
    max: props.today,
    defaultValue: props.plant.lastWatered
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "image"
  }, "Image URL (optional): "), /*#__PURE__*/React.createElement("input", {
    id: "plantImageEdit",
    type: "text",
    name: "image",
    defaultValue: props.plant.image
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "editPlantSubmit",
    type: "submit",
    value: "Save"
  }), /*#__PURE__*/React.createElement("p", {
    className: "error"
  }, /*#__PURE__*/React.createElement("span", {
    id: "errorMessage"
  })));
};

var PasswordChangeWindow = function PasswordChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "passwordChangeForm",
    name: "passwordChangeForm",
    onSubmit: handlePasswordChange,
    action: "/changePassword",
    method: "PUT",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("span", {
    id: "closeButton",
    onClick: toggleModal
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times-circle"
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Verify Password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    name: "oldPass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass2"
  }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "retype new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }), /*#__PURE__*/React.createElement("p", {
    className: "error"
  }, /*#__PURE__*/React.createElement("span", {
    id: "errorMessage"
  })));
};

var PremiumWindow = function PremiumWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "premiumForm",
    name: "premiumForm",
    onSubmit: subscribeToPremium,
    action: "/premium",
    method: "PUT",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("span", {
    id: "closeButton",
    onClick: toggleModal
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times-circle"
  })), /*#__PURE__*/React.createElement("p", null, "Subscribe to premium today to remove ads!"), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Subscribe"
  }), /*#__PURE__*/React.createElement("p", {
    className: "error"
  }, /*#__PURE__*/React.createElement("span", {
    id: "errorMessage"
  })));
};

var UserStatus = function UserStatus(props) {
  return /*#__PURE__*/React.createElement("p", null, "Account Type: ", props.isPremium ? /*#__PURE__*/React.createElement("span", {
    className: "premium"
  }, "Premium ", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-star"
  })) : /*#__PURE__*/React.createElement("span", null, "Free"));
};

var AdPlacement = function AdPlacement(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ad"
  }, /*#__PURE__*/React.createElement("img", {
    className: "inlineAd",
    src: "assets/img/ad.png",
    alt: "Ad"
  }));
};

var loadPlantsFromServer = function loadPlantsFromServer() {
  sendAjax('GET', '/getPlants', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PlantList, {
      plants: data.plants
    }), document.querySelector("#plants"));
  });
};

var createPlantModal = function createPlantModal(csrf) {
  var today = convertDateToYYYYMMDD(new Date());
  ReactDOM.render( /*#__PURE__*/React.createElement(PlantForm, {
    csrf: csrf,
    today: today
  }), document.querySelector("#modal"));
};

var openEditPlant = function openEditPlant(e) {
  var div = e.currentTarget.parentElement.parentElement;
  var plant = {
    id: div.id,
    species: div.children[1].getAttribute("data-value"),
    location: div.children[2].getAttribute("data-value"),
    needs: div.children[3].getAttribute("data-value"),
    lastWatered: div.children[4].getAttribute("data-value"),
    image: div.children[0].getAttribute("data-value")
  };
  toggleModal();
  ReactDOM.render( /*#__PURE__*/React.createElement(EditPlantNode, {
    csrf: token,
    plant: plant
  }), document.querySelector("#modal"));
};

var createPasswordModal = function createPasswordModal(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PasswordChangeWindow, {
    csrf: token
  }), document.querySelector("#modal"));
};

var createPremiumModal = function createPremiumModal(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PremiumWindow, {
    csrf: token
  }), document.querySelector("#modal"));
};

var setup = function setup(csrf) {
  var addButton = document.querySelector("#addButton");
  var passwordButton = document.querySelector("#passwordButton");
  var premiumButton = document.querySelector("#premiumButton");
  token = csrf;
  sendAjax('GET', '/premium', null, function (result) {
    isPremium = result.isPremium;
    ReactDOM.render( /*#__PURE__*/React.createElement(UserStatus, {
      isPremium: isPremium
    }), document.querySelector("#userStatus"));

    if (isPremium) {
      premiumButton.style.display = "none";
      hideAds();
    }
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(UserStatus, {
    username: "test",
    isPremium: isPremium
  }), document.querySelector("#userStatus"));
  addButton.addEventListener("click", function (e) {
    e.preventDefault();
    toggleModal();
    createPlantModal(csrf);
    return false;
  });
  passwordButton.addEventListener("click", function (e) {
    e.preventDefault();
    toggleModal();
    createPasswordModal(csrf);
    return false;
  });
  premiumButton.addEventListener("click", function (e) {
    e.preventDefault();
    toggleModal();
    createPremiumModal(csrf);
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(PlantForm, {
    plants: []
  }), document.querySelector("#plants"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SortPanel, null), document.querySelector("#sortPanel"));
  loadPlantsFromServer();
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
