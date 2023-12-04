// Setup the Controls
var breedSelect = document.querySelector('select.breed_select');
breedSelect.addEventListener('change', function () {
  var id = breedSelect.options[breedSelect.selectedIndex].id;
  getDogByBreed(id);
});

// Load all the Breeds
function getBreeds() {
  fetch('https://api.thedogapi.com/v1/breeds')
    .then(response => response.json())
    .then(data => populateBreedsSelect(data))
    .catch(error => console.error('Error:', error));
}

// Put the breeds in the Select control
function populateBreedsSelect(breeds) {
  breedSelect.innerHTML = breeds.map(function (value) {
    return '<option id="' + value.id + '">' + value.name + '</option>';
  }).join('');
}

// triggered when the breed select control changes
function getDogByBreed(breedId) {
  // search for images that contain the breed (breedId=) and attach the breed object (include_breed=1)
  fetch('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breedId)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        // if there are no images returned
        clearBreed();
        var breedDataTable = document.getElementById('breed_data_table');
        breedDataTable.innerHTML = "<tr><td>Sorry, no Image for that breed yet</td></tr>";
      } else {
        // else display the breed image and data
        displayBreed(data[0]);
      }
    })
    .catch(error => console.error('Error:', error));
}

// clear the image and table
function clearBreed() {
  document.getElementById('breed_image').src = '';
  var breedDataTable = document.getElementById('breed_data_table');
  breedDataTable.innerHTML = '';
}

// display the breed image and data
function displayBreed(image) {
  document.getElementById('breed_image').src = image.url;
  var breedDataTable = document.getElementById('breed_data_table');
  breedDataTable.innerHTML = '';

  var breedData = image.breeds[0];
  Object.entries(breedData).forEach(function ([key, value]) {
    // as 'weight' and 'height' are objects that contain 'metric' and 'imperial' properties, just use the metric string
    if (key === 'weight' || key === 'height') {
      value = value.metric;
    }
    // add a row to the table
    breedDataTable.innerHTML += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
  });
}

// call the getBreeds function which will load all the Dog breeds into the select control
getBreeds();
