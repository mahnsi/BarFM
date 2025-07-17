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
              const date = new Date(epoch * 1000); // convert seconds to milliseconds
              console.log("4: Account created: " + date + epoch);
              resolve(epoch); 
          })
          .catch(error => {
              console.error('Operation error', error);
              reject(error);
          });
  });
}


async function getDataSet(username, period) {
  console.log("3: getting data set for user " + username);
      const epoch = await getEpoch(username); // Wait for getEpoch to finish- returns epoch in seconds
      const artists_array = []; const plays_array = []; const all_artists = new Map();
      let from = 0; let to = 0; let interval = 0;
      to = Math.floor(Date.now() / 1000);//current unix time in seconds
      //check timeframe
      if (period === "lmonth") {
        from = to - (2592000); //from is one month before "now (to)". 1 month = 2592000 seconds
        interval = 172800;  //for 1 month we want the interval to be every 2 days.. seconds in 2 days: 172800
      }
      else if (period === "lyear"){
        from = to - 31536000;
        interval = 2592000; //for 1 year we want the interval to be every month.. seconds in 30 days: 2592000
      }

      else if (period === "alltime"){
        from = epoch;
        interval = 2592000; //for all time we want the interval to be every month.. seconds in 30 days: 2592000
      }

      if(from<epoch){
        console.log("account created after timeframe start");
        from = epoch;
      }
      console.log("data from: " + from + " to: " + to);

  try{
   let j=0;
   let k = 0;
   let timestamp_array = [];
      for (i = from; i<=to; i+=interval){
        //changes 'to' and from=i values based on iteration
        URL = "http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=" +
          username 
          +"&from="+ from
          +"&to="+ i
          + "&api_key=" + APIkey
          + "&format=json";

        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error('Network error');
        }
        const data = await response.json();
        
        //get data from retrieved json object
        const chart = data.weeklyartistchart;
        const artists = chart.artist;

        for (artist of artists) {
          if(j<10){//read top 10 (for each date) only
            artists_array.push(artist.name); //for logging purposes
            plays_array.push(artist.playcount); //for logging purposes

            if (!all_artists.has(artist.name)) {
              all_artists.set(artist.name, new Array(45).fill(0)); //lists of all unique artists that show up in the top 10 in the whole time period
            }
            
            arr = all_artists.get(artist.name)
            arr.splice(k, 0, artist.playcount); // add the playcount for that artist at index k (time period k)

            j++;
          }
        }

        //have all the unique artists in one column (all_artists)
        //for each iteration, append a new column with the plays of each artist for that period
        //column headers will be: first column = "artists", next colums are the date range
        //for an artist thats not in the top 10 for that period, put a 0 in the plays column

        console.log("data for period: " + new Date(from * 1000) + " to: " + new Date(i * 1000));
        console.log(artists_array);
        console.log(plays_array);

        //clear arrays for next iteration
        artists_array.length = 0;
        plays_array.length = 0;
        j=0;

        timestamp_array.push(new Date(i * 1000).toLocaleDateString()); //push the date of the period to the timestamp array

        k++;
      
      }
      console.log("all unique artists with plays: ", all_artists);
      console.log("timestamp array: ", timestamp_array);

      const obj = Object.fromEntries(all_artists);
      const hi = JSON.stringify(obj);
      fetch("http://localhost:5000/save_data", { //fetch (send http request) to the flask python server
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: hi
    })
    .then(res => res.json())
    .then(data => console.log("✅ Data sent to Python:", data))
    .catch(err => console.error("❌ Error sending to Python:", err));

      
  } catch (error) {
      console.error('Operation herror..', error);
  }
}