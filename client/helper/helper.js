// print error message into dedicated error spot
const handleError = (message) => {
  $("#errorMessage").text(message);
};

// redirect to a new page
const redirect = (response) => {
  window.location = response.redirect;
};

// send ajax call to server
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

// open or close the modal
const toggleModal = (e) => {
  const modal = document.querySelector("#modal");
  const isClosed = modal.style.display === 'none' || modal.style.display === '';
  if (isClosed) {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
};

// date formatter
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
};

// add days to date object
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + (days + 1));
  return result;
};

// number of days to add to lastWatered
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

// convert needs int to readable string
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

// calculate when to water next
const calculateNextWateringDate = (plant) => {
  const date = addDays(plant.lastWatered, convertNeedsToDays(plant.location, plant.needs));
  return convertDateToYYYYMMDD(date);
};

// compare string values
const compareStrings = (str1, str2) => {
  if (str1 < str2) {
    return -1;
  }
  if (str1 > str2) {
    return 1;
  }
  return 0;
};

// sort plants by species
const sortBySpecies = (arr, isAscending) => {
  if (isAscending) {
    arr.sort((a, b) => compareStrings(a.species, b.species));
  } else {
    arr.sort((a, b) => compareStrings(b.species, a.species));
  }
};

// sort plants by last watered date
const sortByLastWatered = (arr, isAscending) => {
  if (isAscending) {
    arr.sort((a, b) => new Date(a.lastWatered) - new Date(b.lastWatered));
  } else {
    arr.sort((a, b) => new Date(b.lastWatered) - new Date(a.lastWatered));
  }
};

// sort plant by to water next date
const sortByToWaterNext = (arr, isAscending) => {
  if (isAscending) {
    arr.sort((a, b) => 
      new Date(calculateNextWateringDate(a)) - new Date(calculateNextWateringDate(b)));
  } else {
    arr.sort((a, b) => 
      new Date(calculateNextWateringDate(b)) - new Date(calculateNextWateringDate(a)));
  }
};

// handles how to sort plants
const sortPlants = (plants) => {
  const currentSort = document.querySelector('#sort').value;

  const buttons = document.querySelectorAll('.sortDirection');
  let isAscending;
  for(let i = 0; i < buttons.length; i++) {
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

// hide the sidebar ads
const hideAds = () => {
  const ads = document.querySelectorAll(".ad");

  for (let i = 0; i < ads.length; i++) {
    ads[i].style.display = "none";
  }
};