var request = require("request");

var development = false;

var devURL = "http://localhost:8080/";
var prodURL = "https://otg-delivery.herokuapp.com/";
var apiURL = development ? devURL : prodURL;

var norbucksItems = [
  ["Latte", "Size: Tall", 2.95],
  ["Mocha", "Size: Tall", 3.45],
  ["Freshly Brewed Coffee", "Size: Tall", 1.85],
  ["Vanilla Latte", "Size: Tall", 3.45],
  ["Caramel Macchiato", "Size: Tall", 3.75],
  ["Chai Latte", "Size: Tall", 3.65],
  ["Iced Coffee", "Size: Tall", 2.25],
  ["Caramel Frappuccino", "Size: Tall", 3.95],
  ["Mocha Frappuccino", "Size: Tall", 3.95],
  ["Coffee Frappuccino", "Size: Tall", 3.95],
  ["Vanilla Bean Frappuccino", "Size: Tall", 3.95],
  ["Iced Caramel Macchiato", "Size: Tall", 3.75],
  ["Chocolate Croissant", "", 2.75],
  ["Butter Croissant", "", 2.45],
  ["Iced Caramel Cloud Macchiato", "", 0.0],
  ["Iced White Chocolate Mocha", "", 0.0],
  ["Cafe Mocha", "", 0.0],
  ["Cafe Latte", "", 0.0],
  ["Starbucks Cold Brew", "", 0.0],
  ["Other", "", 0.0]
]

var techExpressItems = [
  ["Chedar Ruffles", "", 0],
  ["Cheez It", "", 0],
  ["M&Ms", "", 0],
  ["Snickers Bar", "", 0],
  ["Hershey Bar", "", 0],
  ["Twix Bar", "", 0],
  ["Orbit Gum", "", 0],
  ["Coke", "", 0],
  ["Cherry Coke", "", 0],
  ["Diet Coke", "", 0],
  ["Sprite", "", 0],
  ["Orange Fanta", "", 0],
  ["Bottled Water", "", 0],
  ["Coconut Water", "", 0],
  ["Vitamin Water", "", 0],
  ["Powerade", "", 0],
  ["Monster", "", 0],
  ["Dunkin Donuts Iced Coffee", "", 0],
  ["Muffin", "", 0],
  ["Donut", "", 0],
  ["Croissant", "", 0],
  ["Coffee", "", 0],
  ["Other", "", 0.0]
]

var lisasItems = [
  ["Hot Coffee", "", 0.0],
  ["Cold Brew", "", 0.0], 
  ["Latte", "", 0.0], 
  ["Hot Chocolate", "", 0.0], 
  ["La Colombe", "", 0.0], 
  ["Coca-Cola", "", 0.0], 
  ["Cherry Coke", "", 0.0], 
  ["Sprite", "", 0.0], 
  ["Steaz Green Tea", "", 0.0], 
  ["Honest Tea", "", 0.0], 
  ["Hubert's Lemonade", "", 0.0], 
  ["Mexican Sprite", "", 0.0], 
  ["Mexican Fanta", "", 0.0], 
  ["Mexican Coca-Cola", "", 0.0], 
  ["Croissant", "", 0.0], 
  ["Chocolate Croissant", "", 0.0], 
  ["Other", "", 0.0]
]

var garrettItems = [
  ["Coffee", "", 0],
  ["Coca-Cola", "", 0],
  ["Barq's Root Beer", "", 0],
  ["Cherry Coke", "", 0],
  ["Diet Coke", "", 0],
  ["Fanta", "", 0],
  ["Seagram's Ginger Ale", "", 0],
  ["Other", "", 0.0]
]

var bergsonItems = [
  ["Original Cold Brew", "", 0],
  ["Iced Lemongrass Green Tea", "", 0],
  ["Hot Coffee", "", 0],
  ["Espresso", "", 0],
  ["Cortado", "", 0],
  ["Macchiato", "", 0],
  ["Latte", "", 0],
  ["Cappuccino", "", 0],
  ["Mocha", "", 0],
  ["Americano", "", 0],
  ["Red Eye", "", 0],
  ["Matcha Latte", "", 0],
  ["Chai Tea Latte", "", 0],
  ["Hot Tea", "", 0],
  ["Hot Chocolate", "", 0],
  ["Other", "", 0.0]
]

var locations = [
  ["Norbucks", 42.053343, -87.672956],
  ["TechExpress", 42.057958, -87.675335],
  ["Lisa's", 42.060271, -87.675804],
  ["Garrett", 42.055958, -87.675135],
  ["Bergson", 42.0532, -87.674635],
]


function postItems(location, items, prodLocationId, devLocationId) {
  var locationId = "";
  if(development) {
    locationId = devLocationId;
  } else {
    locationId = prodLocationId;
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
          console.log("Failed to populate " + location + " item data");
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

/* To populate all, first post locations/meeting points. Then, use postman to find the 
_id of each location and set is as the id of the items, then run again with postItems uncommented*/

//postLocations(locations);

postItems("Norbucks", norbucksItems, "5cf6e37c0beac500161d5a13", "");
postItems("TechExpress", techExpressItems, "5cf6e37c0beac500161d5a12", "");
postItems("Lisa's", lisasItems, "5cf6e37c0beac500161d5a14", "");
postItems("Garrett", garrettItems, "5cf6e37c0beac500161d5a15", "");
postItems("Bergson", bergsonItems, "5cf6e37c0beac500161d5a16", "");
