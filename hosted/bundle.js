"use strict";

var token;

var handlePlant = function handlePlant(e) {
  e.preventDefault();
  $("#plantMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#plantSpecies").val() == '' || $("#plantLocation").val() == '' || $("#plantNeeds").val() == '' || $("#plantLastWatered").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('POST', $("#plantForm").attr("action"), $("#plantForm").serialize(), function () {
    loadPlantsFromServer();
  });
  return false;
};

var PlantForm = function PlantForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "plantForm",
    onSubmit: handlePlant,
    name: "plantForm",
    action: "/maker",
    method: "POST",
    className: "plantForm"
  }, /*#__PURE__*/React.createElement("label", {
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
    value: "indoors"
  }, "Indoors"), /*#__PURE__*/React.createElement("option", {
    value: "outdoors"
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
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makePlantSubmit",
    type: "submit",
    value: "Add Plant"
  }));
};

var PlantList = function PlantList(props) {
  if (props.plants.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "plantList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPlant"
    }, "No Plants yet!"));
  }

  var plantNodes = props.plants.map(function (plant) {
    var lastWatered = plant.lastWatered.split('T')[0];
    var plantNextWatering = calculateNextWateringDate(plant);
    return /*#__PURE__*/React.createElement("div", {
      key: plant._id,
      id: plant._id,
      className: "plant"
    }, /*#__PURE__*/React.createElement("h3", {
      "data-value": plant.species,
      className: "plantSpecies"
    }, "Species: ", plant.species, " "), /*#__PURE__*/React.createElement("h3", {
      "data-value": plant.location,
      className: "plantLocation"
    }, "Location: ", plant.location, " "), /*#__PURE__*/React.createElement("h3", {
      "data-value": plant.needs,
      className: "plantNeeds"
    }, "Watering Needs: ", plant.needs, " "), /*#__PURE__*/React.createElement("h3", {
      "data-value": lastWatered,
      className: "plantLastWatered"
    }, "Last Watered On: ", lastWatered, " "), /*#__PURE__*/React.createElement("h3", {
      className: "plantNextWatering"
    }, "Water On: ", plantNextWatering, " "), /*#__PURE__*/React.createElement("button", {
      className: "deletePlant",
      onClick: deletePlant
    }, "Remove"), /*#__PURE__*/React.createElement("button", {
      className: "editPlant",
      onClick: openEditPlant
    }, "Edit"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "plantList"
  }, plantNodes);
};

var EditPlantNode = function EditPlantNode(props) {
  return /*#__PURE__*/React.createElement("form", {
    key: props.plant.id + "-edit",
    id: props.plant.id + "-edit",
    onSubmit: editPlant,
    className: "editing-plant"
  }, /*#__PURE__*/React.createElement("label", {
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
    value: "indoors"
  }, "Indoors"), /*#__PURE__*/React.createElement("option", {
    value: "outdoors"
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
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "editPlantSubmit",
    type: "submit",
    value: "Save"
  }));
};

var loadPlantsFromServer = function loadPlantsFromServer() {
  sendAjax('GET', '/getPlants', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PlantList, {
      plants: data.plants
    }), document.querySelector("#plants"));
  });
};

var deletePlant = function deletePlant(e) {
  e.preventDefault();
  var data = "id=".concat(e.currentTarget.parentElement.id, "&_csrf=").concat(token);
  sendAjax('DELETE', "/deletePlant", data, function () {
    loadPlantsFromServer();
  });
  return false;
};

var openEditPlant = function openEditPlant(e) {
  var div = e.currentTarget.parentElement;
  var plant = {
    id: div.id,
    species: div.children[0].getAttribute("data-value"),
    location: div.children[1].getAttribute("data-value"),
    needs: div.children[2].getAttribute("data-value"),
    lastWatered: div.children[3].getAttribute("data-value")
  };
  ReactDOM.render( /*#__PURE__*/React.createElement(EditPlantNode, {
    csrf: token,
    plant: plant
  }), document.querySelector("#plants"));
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
    sendAjax('POST', '/maker', $("#" + id + "-edit").serialize(), function () {
      loadPlantsFromServer();
    });
  });
  return false;
};

var setup = function setup(csrf) {
  var today = convertDateToYYYYMMDD(new Date());
  ReactDOM.render( /*#__PURE__*/React.createElement(PlantForm, {
    csrf: csrf,
    today: today
  }), document.querySelector("#makePlant"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PlantForm, {
    plants: []
  }), document.querySelector("#plants"));
  token = csrf;
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
  $("#plantMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#plantMessage").animate({
    width: 'hide'
  }, 350);
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
  var days = location === 'indoors' ? [1, 3, 7, 7, 7] : [2, 4, 7, 10, 14];

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
      return days[0];
  }
};

var calculateNextWateringDate = function calculateNextWateringDate(plant) {
  var date = addDays(plant.lastWatered, convertNeedsToDays(plant.location, plant.needs));
  return convertDateToYYYYMMDD(date);
};
