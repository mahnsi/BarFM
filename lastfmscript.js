//top 10 arrists
//if month is selected, one set a day - past 30 days or can select a specific month
//if year is selected, show data by month (one set per month)
//all time- by month and year (one set a month)
//for custom, just have a year selection or month of the year selection

const APIkey = "976a55f9469d78ad881fc3daa33cf5b3";

document.addEventListener('DOMContentLoaded', function() {
  const formContainer = document.getElementById('form_container');
  const getBackButton = document.getElementById('again_button');
  const toggleButton = document.getElementById('submit_button');
  const myForm = document.getElementById('start_form');

  //if the form is visible, then the back to form button is not visible
  if (formContainer.style.display != 'none') {
    getBackButton.style.display ='none';
  } 

  // Triggered when form is submitted 
  function toggleForm() {
    if (formContainer.style.display === 'none') {
      formContainer.style.display = 'block';
      getBackButton.style.display ='none';
      
    } else {
      //submit has been pressed. the form is visible. make invisible.
      formContainer.style.display = 'none';
      getBackButton.style.display ='block';
      getBackButton.textContent = 'Redo';
    }
  }

  // Event listener for form submission
  myForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const username = document.getElementById('username').value;
    const frame = document.getElementById('time_frame').value;
    console.log("Entered user: ", username);
    console.log("Entered Time Frame: ", frame);
    toggleForm(); 
    myForm.reset(); // Clear form fields
    getEpoch(username);
    getDataSet(username, frame);
  });

  // Event listener for redo click to toggle form visibility
  getBackButton.addEventListener('click', toggleForm);
});

function getEpoch(username){
  const currentDate = new Date();
  const unixTime_s = (currentDate.getTime())/1000;
  const URL = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user="+username+"&api_key="+APIkey+"&format=json";
  fetch(URL)
    .then(response=>{
      if(!response.ok){
        throw new Error('Network error');
      }
      return response.json();
    })
    .then(data=>{
      const user = data.user;
      const epoch = user.registered.unixtime;
      const date = new Date(epoch * 1000); // Convert seconds to milliseconds
      console.log(date);
      return epoch;
    })
    .catch(error=>{
      console.error('Operation error', error);
    });

}

function getDataSet(username, period){
    const URL = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user="
    +username+"&api_key="+
    APIkey+"&format=json";
    const artists_array = [];
    const plays_array = [];
    const from=0; const to =0; const epoch = getEpoch(username);
    //check timeframe
    if(period === "lmonth"){
      to = epoch;
      from = epoch - (30);

    }
    //n amount these 2 lists, n being number of months, n=15 when 1 month is selected (every 2 days)
    fetch(URL)
    .then(response=>{
      if(!response.ok){
        throw new Error('Network error');
      }
      return response.json();
    })
    .then(data=>{
      //get data from retrieved json object
      const chart = data.weeklyartistchart;
      const artists = chart.artist;
      for(artist of artists){
        artists_array.push(artist.name);
        plays_array.push(artist.playcount);  
      }
      console.log(data);
    })
    .catch(error=>{
      console.error('Operation error', error);
    });
}