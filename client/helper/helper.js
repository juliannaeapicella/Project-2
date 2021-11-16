const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#plantMessage").animate({width:'toggle'},350);
};

const redirect = (response) => {
  $("#plantMessage").animate({width:'hide'},350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

const convertDateToYYYYMMDD = (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (day < 10) {
    day = '0' + day;
  }

  if (month < 10) {
    month = '0' + month;
  } 
      
  return year + '-' + month + '-' + day;
}

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + (days + 1));
  return result;
};

const convertNeedsToDays = (location, needs) => {
  const days = location === 'Indoors' ? [1, 3, 7, 7, 7] : [2, 4, 7, 10, 14];

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

const convertNeedsToString = (needs) => {
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

const calculateNextWateringDate = (plant) => {
  const date = addDays(plant.lastWatered, convertNeedsToDays(plant.location, plant.needs));
  return convertDateToYYYYMMDD(date);
}