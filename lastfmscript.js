//top 10 arrists
//if month is selected, one set a day - past 30 days or can select a specific month
//if year is selected, show data by month (one set per month)
//all time- by month and year (one set a month)
//for custom, just have a year selection or month of the year selection

const APIkey = "976a55f9469d78ad881fc3daa33cf5b3";
let chartTitle = '';

document.addEventListener('DOMContentLoaded', function() {
  const formContainer = document.getElementById('form_container');
  const getBackButton = document.getElementById('again_button');
  const outputContainer = document.getElementById('output_container');
  chartTitle = document.getElementById('heading');
  const myForm = document.getElementById('start_form');

  //if the form is visible, then the back to form button is not visible
  if (formContainer.style.display != 'none') {
    outputContainer.style.display ='none';
  } 

  // Triggered when form is submitted 
  function toggleForm() {
    if (formContainer.style.display === 'none') {
      formContainer.style.display = 'block';
      outputContainer.style.display ='none';
      
    } else {
      //submit has been pressed and the form is visible. make form invisible.
      formContainer.style.display = 'none';
      outputContainer.style.display ='block';
    }
  }

  // Event listener for form submission
  myForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const username = document.getElementById('username').value;
    const frame = document.getElementById('time_frame').value;
    console.log("1. Entered user: ", username);
    console.log("2. Entered Time Frame: ", frame);
    toggleForm(); 
    myForm.reset(); // Clear form fields

    getDataSet(username, frame);//get data set from form submission
  });

  // Event listener for redo click to toggle form visibility
  getBackButton.addEventListener('click', toggleForm);
});

function getEpoch(username) {
  return new Promise((resolve, reject) => {
      const currentDate = new Date();
      const unixTime_s = (currentDate.getTime()) / 1000;
      const URL = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + username + "&api_key=" + APIkey + "&format=json";

      fetch(URL)
          .then(response => {
              if (!response.ok) {
                if (response.status === 404){
                  chartTitle.textContent = 'User not found.';
                  throw new Error('User does not exist or is not publicly available.');
                }
                else{
                  throw new Error('Network error');
                }
            }
            else{
              chartTitle.textContent = 'Chart for user ' + username;
            }
              return response.json();
          })
          .then(data => {
              const user = data.user;
              const epoch = user.registered.unixtime;
              const date = new Date(epoch * 1000); // Convert seconds to milliseconds
              console.log("4: Account created: " + date + epoch);
              resolve(epoch); // Resolve the promise with the epoch value
          })
          .catch(error => {
              console.error('Operation error', error);
              reject(error); // Reject the promise if there's an error
          });
  });
}


async function getDataSet(username, period) {
  console.log("3: getting data set for user " + username);
  try {
      const epoch = await getEpoch(username); // Wait for getEpoch to finish- returns epoch in seconds
      const URL = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=" +
          username + "&api_key=" +
          APIkey + "&format=json";
      const artists_array = []; const plays_array = [];
      let from = 0; let to = 0; let interval = 0;
      to = Math.floor(Date.now() / 1000);//current time
      //check timeframe
      if (period === "lmonth") {
        from = to - (2592000); //one month seconds
        interval = 172800;  //seconds in 2 days: 172800
      }
      else if (period === "lyear"){
        from = to - 2592000 * 12 //check this
      }
     
      const response = await fetch(URL);
      if (!response.ok) {
          throw new Error('Network error');
      }
      const data = await response.json();
      //get data from retrieved json object
      const chart = data.weeklyartistchart;
      const artists = chart.artist;
      let i=0;
      for (artist of artists) {
        if(i<10){
          artists_array.push(artist.name);
          plays_array.push(artist.playcount);
          i++;
        }         
      }
      console.log(data);
  } catch (error) {
      console.error('Operation herror', error);
  }
}