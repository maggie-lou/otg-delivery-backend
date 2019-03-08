var request = require("request");

var production = false;
var local = false;

var devURL = "http://localhost:8080/";
var prodURL = "https://otg-delivery.herokuapp.com/";
var apiURL = local ? devURL: prodURL;

var studyItems = [
  ["Chocolate Chip Granola Bar", "", 0],
  ["Snickers Chocolate Bar", "", 0],
  ["Apple", "", 0],
]

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

var starbucksItems = [
  "Latte",
  "Coffee",
  "Iced Coffee",
  "Cold Brew",
  "Frappucino",
  "Cappucino",
  "Mocha",
]
var paneraItems = [
  "Modern Caprese Sandwich",
  "Roasted Turkey, Apple, Cheddar Sandwich",
]
var coffeeLabItems = [
  "Scone",
  "Cappucino",
  "Mocha",
]
var techExpressItems = [
  "Quaker Oatmeal",
  "Kind Bar",
  "Sea Salt and Vinegar Chips",
  "Jalapeno Chips",
  "Barbeque Chips",
  "Chedar Ruffles",
  "Cheez It",
  "M&Ms",
  "Snickers Bar",
  "Hershey Bar",
  "Twix Bar",
  "Fresh Fruit",
  "Orbit Gum",
  "Coke",
  "Cherry Coke",
  "Diet Coke",
  "Sprite",
  "Orange Fanta",
  "Bottled Water",
  "Coconut Water",
  "Vitamin Water",
  "Powerade",
  "Minute Maid Lemonade",
  "Monster",
  "Dunkin Donuts Iced Coffee",
  "Muffin",
  "Donut",
  "Croissant",
  "Hot Coffee",
  // "Sushi - Veggie",
  // "Sushi - California Roll",
  // "Sushi - Tempura",
  // "Sandwich - Ham/Turkey and Cheese",
  // "Chicken Caesar Salad",
  "Hummus and Pita",
  // "Caprese Salad",
  // "Garden Salad",
  // "Pulled Pork Arepas",
  // "Brisket Arepas",
  // "Braised Chicken Arepas",
  // "Black Beans and Queso Arepas",
  // "Roasted Corn, Carrot, and Cauliflower Arepas",
  "Chips and Salsa",
  "Rice and Beans",
  "Sweet Plantains",
  // "Cheese Empanada (1)",
  // "Veggie Empanada (1)",
]

var locations = [
  ["Study", 0, 0],
  // ["Tomate", 42.058345, -87.683724],
  // ["TechExpress", 42.057816, -87.677123], // On Sheridan
  // ["CoffeeLab", 42.058455, -87.683737],
  // ["Starbucks",42.049677, -87.681824],
  // ["BlazePizza", 42.049614, -87.681795],
  // ["Panera", 42.048555, -87.681854],
  // ["OliveMeditarraneanGrill", 42.049461, -87.681816],
  // ["AndysFrozenCustard", 42.048445, -87.681425],
  //["Tech Express", 42.057958, -87.674735], // By Mudd
]

function postTomateItems(items) {
  var developmentLocationId = "5bb9594d290593692fc1472f";
  var productionLocationId = "5bd8e5c9379744001512b107";
  var locationId = "";
  if(production) {
    locationId = productionLocationId;
  } else {
    locationId = developmentLocationId;
  }

  for (i=0; i<items.length; i++) {
    var item = items[i];
    var api = apiURL + "items";
    request.post(
      api,
      { json: {
        name: item[0],
        price: item[2],
        location: locationId,
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

function postItems(location, items, prodLocationId, devLocationId) {
  var locationId = "";
  if(production) {
    locationId = prodLocationId;
  } else {
    locationId = devLocationId;
  }

  for (i=0; i<items.length; i++) {
    var item = items[i];
    var api = apiURL + "items";
    request.post(
      api,
      { json: {
        name: item,
        price: 0,
        location: locationId,
        description: "",
        }
      },
      function(error, response, body) {
        if (error) {
          console.log("Failed to populate " + location + " item data");
        }
      }
    );
  }
}
function postTechExpressItems() {
  var productionLocationId = "5bee0ab702d1dd0015c27ab3";
  var developmentLocationId = "5bee0a7bd563f60cfa8c3bdb";

  for (i=0; i<techExpressItems.length; i++) {
    var item = techExpressItems[i];
    var api = apiURL + "items";
    request.post(
      api,
      { json: {
        name: item,
        price: 0,
        location: productionLocationId,
        description: "",
        }
      },
      function(error, response, body) {
        if (error) {
          console.log("Failed to populate Tech Express item data");
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

// function postItems(location, items, prodLocationId, devLocationId) {
// postItems("Tomate", tomateItems, 0, "5c3ceffdc5f3184d02fec0bc");
//postItems("TechExpress", techExpressItems, "5c54a1f33332080016095014", "5c3ceffdc5f3184d02fec0bd");
// postItems("CoffeeLab", coffeeLabItems, 0, "5c3ceffdc5f3184d02fec0c0");
//postItems("Starbucks", starbucksItems, 0, "5c3ceffdc5f3184d02fec0be");
//postItems("Panera", paneraItems, "5c54a1f3333208001609501b", "5c3ceffdc5f3184d02fec0bf");
//postItems("Study", studyItems, "", "5c82b653764eef7a920fc0d8");
postLocations(locations);
