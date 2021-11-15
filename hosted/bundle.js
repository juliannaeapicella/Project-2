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
    return /*#__PURE__*/React.createElement("div", {
      key: plant._id,
      id: plant._id,
      className: "plant"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "plantSpecies"
    }, "Species: ", plant.species, " "), /*#__PURE__*/React.createElement("h3", {
      className: "plantLocation"
    }, "Location: ", plant.location, " "), /*#__PURE__*/React.createElement("h3", {
      className: "plantNeeds"
    }, "Watering Needs: ", plant.needs, " "), /*#__PURE__*/React.createElement("h3", {
      className: "plantLastWatered"
    }, "Last Watered On: ", plant.lastWatered, " "), /*#__PURE__*/React.createElement("h3", {
      className: "plantNextWatering"
    }, "Water On: TBD "), /*#__PURE__*/React.createElement("button", {
      className: "deletePlantSubmit",
      value: "Delete",
      onClick: deletePlant
    }, "Remove"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "plantList"
  }, plantNodes);
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

var setup = function setup(csrf) {
  //add today calculation
  ReactDOM.render( /*#__PURE__*/React.createElement(PlantForm, {
    csrf: csrf
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
