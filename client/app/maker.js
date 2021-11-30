let token;

const handlePlant = (e) => {
  e.preventDefault();

  $("#plantMessage").animate({width:'hide'},350);

  if($("#plantSpecies").val() == '' 
    || $("#plantLocation").val() == '' 
    || $("#plantNeeds").val() == ''
    || $("#plantLastWatered").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('POST', $("#plantForm").attr("action"), $("#plantForm").serialize(), function() {
      loadPlantsFromServer();
  });

  return false;
};

const PlantForm = (props) => {
  return (
    <form id="plantForm"
      onSubmit={handlePlant}
      name="plantForm"
      action="/maker"
      method="POST"
      className="plantForm">
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
    </form>
  );
};

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
      <label htmlFor="ascending">Ascending</label>
      <input type="radio" id="descending" className="sortDirection" name="sortDirection" value={false} onChange={loadPlantsFromServer} />
      <label htmlFor="descending">Descending</label>
    </div>
  );
};

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

    return (
        <div key={plant._id} 
          id={plant._id} 
          className="plant" >
            <img data-value={plant.image} className="plantImage" src={plant.image} alt={plant.species} width="100" height="100" />
            <h3 data-value={plant.species} className="plantSpecies">Species: {plant.species} </h3>
            <h3 data-value={plant.location} className="plantLocation">Location: {plant.location} </h3>
            <h3 data-value={plant.needs} className="plantNeeds">Watering Needs: {convertNeedsToString(plant.needs)} </h3>
            <h3 data-value={lastWatered} className="plantLastWatered">Last Watered On: {lastWatered} </h3>
            <h3 className="plantNextWatering">Water On: {calculateNextWateringDate(plant)} </h3> 
            <button className="deletePlant" onClick={deletePlant}>Remove</button>
            <button className="editPlant" onClick={openEditPlant}>Edit</button>
        </div>
    );
  });

  return (
    <div className="plantList">
      {plantNodes}
    </div>
  );
};

const EditPlantNode = function(props) {
  return (
    <form key={props.plant.id + "-edit"} 
      id={props.plant.id + "-edit"}
      onSubmit={editPlant}
      className="editing-plant" >
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
    </form>
  );
};

const loadPlantsFromServer = () => {
  sendAjax('GET', '/getPlants', null, (data) => {
    ReactDOM.render(
        <PlantList plants={data.plants}/>, document.querySelector("#plants")
    );
  });
};

const deletePlant = (e) => {
  e.preventDefault();

  const data = `id=${e.currentTarget.parentElement.id}&_csrf=${token}`

  sendAjax('DELETE', "/deletePlant", data, () => {
      loadPlantsFromServer();
  });

  return false;
};

const openEditPlant = (e) => {
  const div = e.currentTarget.parentElement;

  const plant = {
    id: div.id,
    species: div.children[1].getAttribute("data-value"),
    location: div.children[2].getAttribute("data-value"),
    needs: div.children[3].getAttribute("data-value"),
    lastWatered: div.children[4].getAttribute("data-value"),
    image: div.children[0].getAttribute("data-value"),
  };

  ReactDOM.render(
    <EditPlantNode csrf={token} plant={plant} />, document.querySelector("#plants")
  );
};

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
    sendAjax('POST', '/maker', $("#" + id + "-edit").serialize(), function() {
        loadPlantsFromServer();
    });
  });

  return false;
};

const setup = function(csrf) {
  const today = convertDateToYYYYMMDD(new Date());

  ReactDOM.render(
      <PlantForm csrf={csrf} today={today} />, document.querySelector("#makePlant")
  );

  ReactDOM.render(
    <PlantForm plants={[]} />, document.querySelector("#plants")
  );

  ReactDOM.render(
    <SortPanel />, document.querySelector("#sortPanel")
  );

  token = csrf;

  loadPlantsFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});