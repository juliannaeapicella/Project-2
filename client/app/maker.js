let token;
let isPremium;

// creates a plant object
const handlePlant = (e) => {
  e.preventDefault();

  if($("#plantSpecies").val() == '' 
    || $("#plantLocation").val() == '' 
    || $("#plantNeeds").val() == ''
    || $("#plantLastWatered").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('POST', $("#plantForm").attr("action"), $("#plantForm").serialize(), function() {
      toggleModal();
      loadPlantsFromServer();
  });

  return false;
};

// deletes a plant
const deletePlant = (e) => {
  e.preventDefault();

  const data = `id=${e.currentTarget.parentElement.parentElement.id}&_csrf=${token}`

  sendAjax('DELETE', "/deletePlant", data, () => {
      loadPlantsFromServer();
  });

  return false;
};

// delete and remake plant object with new data
const editPlant = (e) => {
  e.preventDefault();

  const id = e.currentTarget.id.split('-')[0];

  const data = `id=${id}&_csrf=${token}`;

  if($("#plantSpeciesEdit").val() == '' 
  || $("#plantLocationEdit").val() == '' 
  || $("#plantNeedsEdit").val() == ''
  || $("#plantLastWateredEdit").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('DELETE', "/deletePlant", data, () => {
    sendAjax('POST', '/makePlant', $("#" + id + "-edit").serialize(), function() {
        toggleModal();
        loadPlantsFromServer();
    });
  });

  return false;
};

// update password
const handlePasswordChange = (e) => {
  e.preventDefault();

  if($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
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

// upgrade account to premium subscription
const subscribeToPremium = (e) => {
  e.preventDefault();
  sendAjax('PUT', $("#premiumForm").attr("action"), $("#premiumForm").serialize(), redirect);
  hideAds();
  return false;
};

// react component for plant creation form
const PlantForm = (props) => {
  return (
    <form id="plantForm"
      onSubmit={handlePlant}
      name="plantForm"
      action="/makePlant"
      method="POST"
      className="plantForm">
        <span id="closeButton" onClick={toggleModal}><i className="fas fa-times-circle"></i></span>

        <label htmlFor="species">Species: </label>
        <input id="plantSpecies" type="text" name="species" placeholder="Mint, Rose, etc." />

        <label htmlFor="location">Location: </label>
        <select id="plantLocation" name="location">
          <option value="Indoors">Indoors</option>
          <option value="Outdoors">Outdoors</option>
        </select>

        <label htmlFor="needs">Watering Needs: </label>
        <select id="plantNeeds" name="needs">
          <option value="1">Very High</option>
          <option value="2">High</option>
          <option value="3">Average</option>
          <option value="4">Low</option>
          <option value="5">Very Low</option>
        </select>

        <label htmlFor="lastWatered">Last Watered On: </label>
        <input id="plantLastWatered" type="date" name="lastWatered" max={props.today} />

        <label htmlFor="image">Image URL (optional): </label>
        <input id="plantImage" type="text" name="image" />

        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makePlantSubmit" type="submit" value="Add Plant" />
        <p className="error"><span id="errorMessage"></span></p>
    </form>
  );
};

// react component for the sorting inputs
const SortPanel = function() {
  return (
    <div id="sortPanel">
      <label htmlFor="sort">Sort Plants By: </label>
      <select id="sort" name="sort" defaultValue="1" onChange={loadPlantsFromServer} >
        <option value={1}>Last Watered</option>
        <option value={2}>To Water Next</option>
        <option value={3}>Species</option>
      </select>
      <input type="radio" id="ascending" className="sortDirection" name="sortDirection" value={true} onChange={loadPlantsFromServer} defaultChecked/>
      <label htmlFor="ascending"><i className="fas fa-arrow-up"></i></label>
      <input type="radio" id="descending" className="sortDirection" name="sortDirection" value={false} onChange={loadPlantsFromServer} />
      <label htmlFor="descending"><i className="fas fa-arrow-down"></i></label>
    </div>
  );
};

// react component that renders all plant objects
const PlantList = function(props) {
  if (props.plants.length === 0) {
      return (
        <div className="plantList">
            <h3 className="emptyPlant">No Plants yet!</h3>
        </div>
      );
  }

  sortPlants(props.plants);

  const plantNodes = props.plants.map(function(plant) {
    const lastWatered = plant.lastWatered.split('T')[0];

    // create a react component for each plant
    return (
        <div key={plant._id} 
          id={plant._id} 
          className="plant" >
            <img data-value={plant.image} className="plantImage" src={plant.image} alt={plant.species} width="100" height="100" />
            <h3 data-value={plant.species} className="plantSpecies">Species: <b>{plant.species}</b> </h3>
            <h3 data-value={plant.location} className="plantLocation">Location: <b>{plant.location}</b> </h3>
            <h3 data-value={plant.needs} className="plantNeeds">Watering Needs: <b>{convertNeedsToString(plant.needs)}</b> </h3>
            <h3 data-value={lastWatered} className="plantLastWatered">Last Watered On: <b>{lastWatered}</b> </h3>
            <h3 className="plantNextWatering">Water On: <b>{calculateNextWateringDate(plant)}</b> </h3> 
            <div className="buttons">
              <button className="deletePlant" onClick={deletePlant}><i className="fas fa-trash-alt"></i> Remove</button>
              <button className="editPlant" onClick={openEditPlant}><i className="fas fa-edit"></i> Edit</button>
            </div>
        </div>
    );
  });

  return (
    <div className="plantList">
      {!isPremium && <AdPlacement />}
      {plantNodes}
      {!isPremium && <AdPlacement />}
    </div>
  );
};

// react component for plant editing form
const EditPlantNode = function(props) {
  return (
    <form key={props.plant.id + "-edit"} 
      id={props.plant.id + "-edit"}
      onSubmit={editPlant}
      className="editing-plant" >
        <span id="closeButton" onClick={toggleModal}><i className="fas fa-times-circle"></i></span>

        <label htmlFor="species">Species: </label>
        <input id="plantSpeciesEdit" type="text" name="species" placeholder="Mint, Rose, etc." defaultValue={props.plant.species} />

        <label htmlFor="location">Location: </label>
        <select id="plantLocationEdit" name="location" defaultValue={props.plant.location}>
          <option value="Indoors">Indoors</option>
          <option value="Outdoors">Outdoors</option>
        </select>

        <label htmlFor="needs">Watering Needs: </label>
        <select id="plantNeedsEdit" name="needs" defaultValue={props.plant.needs}>
          <option value="1">Very High</option>
          <option value="2">High</option>
          <option value="3">Average</option>
          <option value="4">Low</option>
          <option value="5">Very Low</option>
        </select>

        <label htmlFor="lastWatered">Last Watered On: </label>
        <input id="plantLastWateredEdit" type="date" name="lastWatered" max={props.today} defaultValue={props.plant.lastWatered} />

        <label htmlFor="image">Image URL (optional): </label>
        <input id="plantImageEdit" type="text" name="image" defaultValue={props.plant.image} />

        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="editPlantSubmit" type="submit" value="Save" />
        <p className="error"><span id="errorMessage"></span></p>
    </form>
  );
};

// react component for password change form
const PasswordChangeWindow = (props) => {
  return (
    <form id="passwordChangeForm"
      name="passwordChangeForm"
      onSubmit={handlePasswordChange}
      action="/changePassword"
      method="PUT"
      className="mainForm"
    >
      <span id="closeButton" onClick={toggleModal}><i className="fas fa-times-circle"></i></span>

      <label htmlFor="oldPass">Verify Password: </label>
      <input id="oldPass" type="password" name="oldPass" placeholder="password" />
      <label htmlFor="newPass">New Password: </label>
      <input id="newPass" type="password" name="newPass" placeholder="new password" />
      <label htmlFor="newPass2">Retype New Password: </label>
      <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Change Password" />
      <p className="error"><span id="errorMessage"></span></p>
    </form>
  );
};

// react component for premium subscription window
const PremiumWindow = (props) => {
  return (
    <form id="premiumForm"
      name="premiumForm"
      onSubmit={subscribeToPremium}
      action="/premium"
      method="PUT"
      className="mainForm"
    >
      <span id="closeButton" onClick={toggleModal}><i className="fas fa-times-circle"></i></span>

      <p>Subscribe to premium today to remove ads!</p>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Subscribe" />
      <p className="error"><span id="errorMessage"></span></p>
    </form>
  );
};

// react component displaying user subscription status
const UserStatus = (props) => {
  return (
    <p>Account Type: {
      props.isPremium ? 
      <span className="premium">Premium <i className="fas fa-star"></i></span> : 
      <span>Free</span>
    }</p>
  );
};

// inline ad placement
const AdPlacement = (props) => {
  return (
    <div className="ad">
      <img className="inlineAd" src="assets/img/ad.png" alt="Ad"></img>
    </div>
  );
};

// load plant objects from server
const loadPlantsFromServer = () => {
  sendAjax('GET', '/getPlants', null, (data) => {
    ReactDOM.render(
        <PlantList plants={data.plants}/>, document.querySelector("#plants")
    );
  });
};

// open the plant creation form in a modal
const createPlantModal = (csrf) => {
  const today = convertDateToYYYYMMDD(new Date());

  ReactDOM.render(
    <PlantForm csrf={csrf} today={today} />, 
    document.querySelector("#modal")
  );
};

// open the plant editing form in a modal
const openEditPlant = (e) => {
  const today = convertDateToYYYYMMDD(new Date());

  const div = e.currentTarget.parentElement.parentElement;

  const plant = {
    id: div.id,
    species: div.children[1].getAttribute("data-value"),
    location: div.children[2].getAttribute("data-value"),
    needs: div.children[3].getAttribute("data-value"),
    lastWatered: div.children[4].getAttribute("data-value"),
    image: div.children[0].getAttribute("data-value"),
  };

  toggleModal();

  ReactDOM.render(
    <EditPlantNode csrf={token} today={today} plant={plant} />, document.querySelector("#modal")
  );
};

// open the password change form in a modal
const createPasswordModal = (csrf) => {
  ReactDOM.render(
    <PasswordChangeWindow csrf={token} />,
    document.querySelector("#modal")
  );
};

// open the premium subscription button in a modal
const createPremiumModal = (csrf) => {
  ReactDOM.render(
    <PremiumWindow csrf={token} />,
    document.querySelector("#modal")
  );
};

// set up starting components on page
const setup = function(csrf) {
  const addButton = document.querySelector("#addButton");
  const passwordButton = document.querySelector("#passwordButton");
  const premiumButton = document.querySelector("#premiumButton");
  
  token = csrf;

  sendAjax('GET', '/premium', null, (result) => {
    isPremium = result.isPremium;

    ReactDOM.render(
      <UserStatus isPremium={isPremium} />, document.querySelector("#userStatus")
    );

    if (isPremium) {
      premiumButton.style.display = "none";
      hideAds();
    }
  });

  ReactDOM.render(
    <UserStatus username={"test"} isPremium={isPremium} />, document.querySelector("#userStatus")
  );

  addButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleModal();
    createPlantModal(csrf);
    return false;
  });

  passwordButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleModal();
    createPasswordModal(csrf);
    return false;
  });

  premiumButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleModal();
    createPremiumModal(csrf);
    return false;
  });

  ReactDOM.render(
    <PlantForm plants={[]} />, document.querySelector("#plants")
  );

  ReactDOM.render(
    <SortPanel />, document.querySelector("#sortPanel")
  );

  loadPlantsFromServer();
};

// get CSRF token
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});