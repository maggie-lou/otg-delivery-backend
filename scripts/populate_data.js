var request = require("request");

//var apiURL = "http://localhost:8080/items";
var apiURL = "https://otg-delivery.herokuapp.com/";

var tomateItems = [
  ["Chicken Tinga Burrito", "Chicken sauteed with cabbage, onion, and chipotle sauce.", 6.50],
  ["Yucca with Chimichuri Burrito", "Served with mashed Cuban beans and rice.", 6.50],
  [ "Grilled Chicken Burrito", "Served with spicy rub and two-chili relish.", 6.50],
  ["Chochinita Pibil Burrito", "Pork cooked in fresh-squeezed orange and lime juice and achiote wrapped in plantain leaves.", 6.50],
  ["Sweet Potatoes Burrito", "Carrots, caulifower, and charred corn with guajillo sauce.", 6.50],
  ["Ground Beef Burrito", "Served with chili chipotle.", 6.50],
  ["Black Beans with Grilled Queso Burrito", "Pico de gallo and salso verde.", 6.50],
  ["Tofu Burrito", "Made from Tofu and served to steaming perfection.", 6.50],
  ["Caramelized Onions and Charred Poblano Burrito", "Red peppers with chihuahua cheese.", 6.50],
  [ "Panko-Habanero Crusted Tilapia Burrito", "Served with pineapple mojo.", 6.50],
  ["Spicy Pork with Salsa Verde Burrito", "With salsa verde.", 6.50],
  ["Al Pastor Burrito", "Marinated pork.", 6.50],
  ["Carne Asada Burrito", "Spiced-rubbed skirt steak.", 6.50],

  // Tacos
  ["Tofu Taco", "Taco with some tofu.", 3.00],
  ["Yucca with Chimichurri Taco", "Topped with onions and cilantro.", 3.00],
  ["Sweet Potatoes Taco", "With carrots, cauliflower and charred corn, guajillo sauce and cojita cheese. Topped with onions and cilantro.", 3.00],
  ["Grilled Chicken Taco", "Served with spicy rub and two-chili relish and charred corn. Topped with onions and cilantro.", 3.00],
  ["Cochinita Pibil Taco", "Pork cooked in orange and lime juice and achiote wrapped in plantain leaves. Topped with onions and cilantro.", 3.00],
  ["Chicken Tinga Taco", "Chicken sauteed with cabbage, onion, and chipotle sauce.", 3.00],
  ["Ground Beef Taco", "Served with chili chipotle. Topped with onions and cilantro.", 3.00],
  ["Black Beans with Queso Blanco Taco", "Black beans w/ grilled queso blanco, pico de gallo, and salsa verde. Topped with onions and cilantro.", 3.00],
  ["Caramelized Onions and Charred Poblano Taco", "Red peppers with chihuahua cheese.", 3.00],
  ["Planko Habanero Crusted Tilapia Taco", "Pineapple mojo. Topped with onions and cilantro.", 3.00],
  ["Spicy Pork with Salsa Verde Taco", "With salsa verde. Topped with onions and cilantro.", 3.00],
  ["Al Pastor Taco", "Marinated pork. Topped with onions and cilantro.", 3.00],
  ["Carne Asada Taco", "Spiced-rubbed skirt steak. Topped with onions and cilantro.", 3.00],

]

var locations = [
  ["Tomate", 42.058345, -87.683724],
]

function postTomateItems(items) {
  var developmentLocationId = "5bb9594d290593692fc1472f";
  var productionLocationId = "5bd8e5c9379744001512b107";

  for (i=0; i<items.length; i++) {
    var item = items[i];
    var api = apiURL + "items";
    request.post(
      api,
      { json: {
        name: item[0],
        price: item[2],
        location: productionLocationId,
        description: item[1],
        }
      },
      function(error, response, body) {
        if (error) {
          console.log("Failed to populate Tomate item data");
        }
      }
    );
  }
}

function postLocations(locations) {
  for (i=0; i<locations.length; i++) {
    var location = locations[i];
    var api = apiURL + "locations";
    request.post(
      api,
      { json: {
        name: location[0],
        latitude: location[1],
        longitude: location[2],
        }
      },
      function(error, response, body) {
        if (error) {
          console.log("Failed to populate location data");
        }
      }
    );
  }
}


// ********** CALLS ************************

postTomateItems(tomateItems);
//postLocations(locations);
