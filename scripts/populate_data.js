var request = require("request");

var development = true;

var devURL = "http://localhost:8080/";
var prodURL = "https://otg-delivery.herokuapp.com/";
var apiURL = development ? devURL : prodURL;

var meetingPoints = [
  "Tech Lobby",
  "Bridge between Tech and Mudd",
  "SPAC Entrance",
  "Ford Lobby"
]

var studyItems = [
  "Chocolate Chip Granola Bar",
  "Snickers Chocolate Bar",
  "Apple",
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
  ["Latte", "Size: Tall", 2.95],
  ["Mocha", "Size: Tall", 3.45],
  ["Freshly Brewed Coffee", "Size: Tall", 1.85],
  ["Vanilla Latte", "Size: Tall", 3.45],
  ["Caramel Macchiato", "Size: Tall", 3.75],
  ["Chai Latte", "Size: Tall", 3.65],
  ["Peppermint Mocha", "Size: Tall", 3.95],
  ["Iced Coffee", "Size: Tall", 2.25],
  ["Caramel Frappuccino", "Size: Tall", 3.95],
  ["Mocha Frappuccino", "Size: Tall", 3.95],
  ["Strawberries and Creme Frappuccino", "Size: Tall", 3.95],
  ["Coffee Frappuccino", "Size: Tall", 3.95],
  ["Vanilla Bean Frappuccino", "Size: Tall", 3.95],
  ["Iced Caramel Macchiato", "Size: Tall", 3.75],
  ["Cool Lime Refresher", "Size: Tall", 2.95],
  ["Peach Green Tea Lemonade", "Size: Tall", 2.75],
  ["Chocolate Croissant", "", 2.75],
  ["Butter Croissant", "", 2.45],
]

var paneraItems = [
  ["Cuban Sandwich", "", 9.99],
  ["Bacon Tomato Grilled Cheese", "", 9.29],
  ["Roasted Turkey, Apple, Cheddar Sandwich", "", 9.99],
  ["Steak and White Cheddar Panini", "", 10.49],
  ["Roasted Tomate and Avocado BLT", "", 10.49],
  ["Caprese Sandwich", "", 9.99],
  ["Four Cheese Grilled Cheese", "", 7.39],
  ["Ham and Swiss Sandwich", "", 7.39],
  ["Turkey Sandwich", "", 7.39],
  ["Mediterranean Veggie Sandiwch", "", 7.39],
  ["Mac and Cheese", "", 8.49],
  ["Chicken Noodle Soup", "", 5.99],
  ["Broccoli Cheddar Soup", "", 5.99],
  ["Clam Chowder", "", 5.99],
  ["French Onion Soup", "", 5.99],
  ["Bagel", "Specify type in Special Requests section on next page.", 1.39],
  ["Chocolate Chip Cookie", "", 2.49],
  ["M&M Cookie", "", 2.49],
  ["Brownie", "", 2.99],
  ["Chocolate Croissant", "", 2.99],
  ["Blueberry Muffin", "", 2.79],
  ["Pumpkin Muffie", "", 1.89],
  ["Chocolate Chip Muffie", "", 1.89],
  ["Cinammon Scone", "", 2.99],
]
var coffeeLabItems = [
  ["Espresso", "", 2.95],
  ["Americano", "", 2.95],
  ["Macchiato", "", 2.95],
  ["Cortado", "", 2.95],
  ["Cappuccino", "", 2.95],
  ["Latte", "", 2.95],
  ["Mocha", "", 3.45],
  ["Freshly Brewed Coffee", "", 1.85],
  ["Dirty Chai Latte", "", 3.65],
  ["Hot Cocoa", "", 3.95],
  ["Iced Coffee", "", 2.25],
  ["Iced Latte", "", 3.95],
  ["Iced Mocha", "", 3.95],
  ["Iced White Mocha", "", 3.95],
  ["Iced Chai", "", 3.95],
  ["Fresh Scone", "Flavors based on day.", 2.75],
  ["Chocolate Chip Cookie", "", 2.45],
]

var omgItems = [
  ["Falafel Plate", "Specify sides and sauces in Special Requests section on next page.", 9.99],
  ["Mediterranean Chicken Plate", "Specify sides and sauces in Special Requests section on next page.", 9.99],
  ["Chicken Kabob Plate", "Specify sides and sauces in Special Requests section on next page.", 9.99],
  ["Chicken Shawarma Plate", "Specify sides and sauces in Special Requests section on next page.", 9.99],
  ["Steak Shawarma Plate", "Specify sides and sauces in Special Requests section on next page.", 10.99],
  ["Falafel Sandwich", "With hummus, mediterranean salad, and potatoes.", 7.99],
  ["Mediterranean Chicken Sandwich", "With garlic spread and red onions.", 7.99],
  ["Chicken Kabob Sandwich", "With garlic spread and red onions.", 7.99],
  ["Chicken Shawarma Sandwich", "With garlic spread, pickles, and roma tomatoes.", 7.99],
  ["Steak Shawarma Sandwich", "With garlic spread, red onions, and roma tomatoes.", 8.98],
  ["Baklava", "", 1.49],
]

var andysItems = [
  ["Custom Concrete", "Vanilla frozen custard blended with the topping of your choice. Specify toppings in Special Requests section on next page.", 3.99],
  ["James Brownie Funky Jackhammer", "Vanilla frozen custard blended with creamy peanut butter and brownies then filled with hot fudge.", 5.54],
  ["Triple Chocolate Concrete", "Chocolate frozen custard blended with chocolate chip cookie dough and melted chocolate chip.", 4.74],
  ["Snowmonster Concrete", "Vanilla frozen custard blended with strawberries and melted chocolate chip.", 4.74],
  ["Shake", "Vanilla frozen custard blended with your favorite topping. Specify toppings in Special Requests section on next page.", 4.09],
  ["Custom Sundae", "Vanilla frozen custard topped with your favorite topping. Specify toppings in Special Requests section on next page.", 4.09],
  ["Butter Pecan Concrete", "Vanilla frozen custard blended with butterscotch and roasted pecans.", 4.99],
]

var blazeItems = [
  ["Build Your Own Pizza", "Specify toppings in Special Requests section on next page.", 8.45],
  ["1 Topping Pizza", "Specify toppings in Special Requests section on next page.", 6.75],
  ["Simple Pie Pizza", "Specify toppings in Special Requests section on next page.", 5.55],
]

var techExpressItems = [
  ["Quaker Oatmeal", "", 0],
  ["Kind Bar", "", 0],
  ["Sea Salt and Vinegar Chips", "", 0],
  ["Jalapeno Chips", "", 0],
  ["Barbeque Chips", "", 0],
  ["Chedar Ruffles", "", 0],
  ["Cheez It", "", 0],
  ["M&Ms", "", 0],
  ["Snickers Bar", "", 0],
  ["Hershey Bar", "", 0],
  ["Twix Bar", "", 0],
  ["Fresh Fruit", "", 0],
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
  ["Minute Maid Lemonade", "", 0],
  ["Monster", "", 0],
  ["Dunkin Donuts Iced Coffee", "", 0],
  ["Muffin", "", 0],
  ["Donut", "", 0],
  ["Croissant", "", 0],
  ["Hot Coffee", "", 0],
  // "Sushi - Veggie",
  // "Sushi - California Roll",
  // "Sushi - Tempura",
  // "Sandwich - Ham/Turkey and Cheese",
  // "Chicken Caesar Salad",
  ["Hummus and Pita", "", 0],
  // "Caprese Salad",
  // "Garden Salad",
  // "Pulled Pork Arepas",
  // "Brisket Arepas",
  // "Braised Chicken Arepas",
  // "Black Beans and Queso Arepas",
  // "Roasted Corn, Carrot, and Cauliflower Arepas",
  // "Chips and Salsa",
  // "Rice and Beans",
  // "Sweet Plantains",
  // "Cheese Empanada (1)",
  // "Veggie Empanada (1)",
]

var lisasItems = [
  ["Quaker Oatmeal", "", 0],
  ["Kind Bar", "", 0],
  ["Sea Salt and Vinegar Chips", "", 0]
]

var locations = [
  //["Study", 0, 0],
  //["Tomate", 42.058345, -87.683724],
  //["TechExpress", 42.057816, -87.677123], // On Sheridan
  //["CoffeeLab", 42.058455, -87.683737],
  //["Starbucks",42.049677, -87.681824],
  //["BlazePizza", 42.049614, -87.681795],
  //["Panera", 42.048555, -87.681854],
  //["OliveMediterraneanGrill", 42.049461, -87.681816],
  //["AndysFrozenCustard", 42.048445, -87.681425],
  //["Tech Express", 42.057958, -87.674735], // By Mudd
  ["Lisa's", 42.060271, -87.675804]
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

function postMeetingPoints(MeetingPoints) {
  for (i=0; i<MeetingPoints.length; i++) {
    var meeting = MeetingPoints[i];
    var api = apiURL + "meeting";
    request.post(
      api,
      { json: {
        name: meeting,
        latitude: 0,
        longitude: 0,
        }
      },
      function(error, response, body) {
        if (error) {
          console.log("Failed to populate location data");
          console.log(error);
        }
      }
    );
  }
}

// ********** CALLS ************************

/* To populate all, first post locations/meeting points. Then, use postman to find the 
_id of each location and set is as the id of the items, then run again with postItems uncommented*/

//postLocations(locations);
//postMeetingPoints(meetingPoints);

postItems("Lisa's", lisasItems, "5cf4a4cb88e4b5582663e3be", "5cf5b7e0764bc4414aee7449")
//postItems("Tomate", tomateItems, "5cda48786151300016ad8826", "5ccb7e1d857f2e0f94244994");
//postItems("TechExpress", techExpressItems, "", "5ccb7e1d857f2e0f94244993");
//postItems("CoffeeLab", coffeeLabItems, "5cda48786151300016ad8824", "5ccb7e1d857f2e0f94244995");
//postItems("Starbucks", starbucksItems, "5cda48786151300016ad8828", "5ccb7e1d857f2e0f94244997");
//postItems("Panera", paneraItems, "5cda48786151300016ad8823", "5ccb7e1d857f2e0f94244996");