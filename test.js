const APIkey = "OQQj0zwUnKOIFvqThFgC2X9i5btVKcZWJjrwbkRb";

document.addEventListener('DOMContentLoaded', function() {
  const formContainer = document.getElementById('form_container');
  const getBackButton = document.getElementById('again_button');
  const toggleButton = document.getElementById('submit_button');
  const myForm = document.getElementById('start_form');

  // Event listener for form submission
  myForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const prompt = document.getElementById('prompt').value;
    console.log("Entered prompt: ", prompt);
    myForm.reset(); // Clear form fields

    getDataSet(prompt);//get data from form submission
  });
});

async function getDataSet(prompt) {
  console.log("getting data set for prompt \"" + prompt +"\"");
  try {
        const { CohereClient } = require("cohere-ai");

        const cohere = new CohereClient({
            token: APIkey,
        });
        
        (async () => {
        const generate = await cohere.generate({
            prompt: "Please explain to me how LLMs work",
        });
        
        console.log(generate);
        })();

  } catch (error) {
      console.error('Operation error', error);
  }
}