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
      className="plantForm"
    >
        <label htmlFor="species">Species: </label>
        <input id="plantSpecies" type="text" name="species" placeholder="Mint, Rose, etc." />

        <label htmlFor="location">Location: </label>
        <select id="plantLocation" name="location">
          <option value="indoors">Indoors</option>
          <option value="outdoors">Outdoors</option>
        </select>

        <label htmlFor="needs">Watering Needs: </label>
        <select id="plantNeeds" name="needs">
          <option value="1">Very High</option>
          <option value="2">High</option>
          <option value="3" selected>Average</option>
          <option value="4">Low</option>
          <option value="5">Very Low</option>
        </select>

        <label htmlFor="lastWatered">Last Watered On: </label>
        <input id="plantLastWatered" type="date" name="lastWatered" max={props.today} />

        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makePlantSubmit" type="submit" value="Add Plant" />
    </form>
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

  const plantNodes = props.plants.map(function(plant) {
    return (
        <div key={plant._id} 
          id={plant._id} 
          className="plant" >
            <h3 className="plantSpecies">Species: {plant.species} </h3>
            <h3 className="plantLocation">Location: {plant.location} </h3>
            <h3 className="plantNeeds">Watering Needs: {plant.needs} </h3>
            <h3 className="plantLastWatered">Last Watered On: {plant.lastWatered} </h3>
            <h3 className="plantNextWatering">Water On: TBD </h3> 
            <button className="deletePlantSubmit" value="Delete" onClick={deletePlant}>Remove</button>
        </div>
    );
  });

  return (
      <div className="plantList">
          {plantNodes}
      </div>
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

const setup = function(csrf) {
  //add today calculation

  ReactDOM.render(
      <PlantForm csrf={csrf} />, document.querySelector("#makePlant")
  );

  ReactDOM.render(
    <PlantForm plants={[]} />, document.querySelector("#plants")
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