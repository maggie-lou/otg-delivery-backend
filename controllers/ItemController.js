let express = require('express');

let Item = require('../models/Item');
let Location = require('../models/Location');
const router = express.Router();

router.route('/')
  .post(function(req, res){
    console.log("POST: /items");

    let item = new Item();
    item.name = req.body.name;
    item.price = req.body.price;
    item.location = req.body.location;
    item.description = req.body.description;

    item.save(function(err, itemDocument){
      if(err){
        console.log(err);
        res.send(err);
        return;
      }

      console.log(itemDocument);
      res.send(itemDocument);
    })
  })

router.route('/all')
  .get((req, res) => {
    console.log("GET: items/all")
    Item.find()
      .exec((err, items) => {
        if (err) {
          res.send(err)
        } else {
          res.send(items)
        }
      })
  })
  .delete((req, res) => {
    console.log("DELETE: items/all")
    Item.deleteMany()
      .exec((err) => {
        if (err) {
          res.send(err)
        } else {
          res.send("All Items Deleted.")
        }
      })
  })

router.route('/:id/:name')
  .get(function(req, res) {
    console.log("GET: /items/:id/:name");
    Location.findOne({ 'name': req.params.name }, function(err, location) {
      if (err) {
        console.log("Error finding location " + location);
        res.send(err);
      }
      Item.find({ 'location': req.params.id })
        .sort('name')
        .exec(function(err, items) {
          console.log(location)
          console.log(req.params.id)
          console.log(items)
          if (err) {
            console.log("Error getting items for location " + location);
            res.send(err);
            return;
          }
          res.send(items);
        })
    });
  })

router.route('/:id')
    .get(function(req, res) {
      console.log("GET: get item with id " + req.params.id);
      Item.findById(req.params.id, function(err, item) {
        if (err) {
          console.log("Error getting item " + req.params.id);
          res.send(err);
        }
        console.log(item);
        res.send(item)
      });
    })

module.exports = router;
