var express = require('express');

var Item = require('../models/Item');
var Location = require('../models/Location');
const router = express.Router();

router.route('/')
  .post(function(req, res){
    console.log("POST: /items");

    var item = new Item();
    item.name = req.body.name;
    item.price = req.body.price;
    item.location = req.body.location;
    item.description = req.body.description;

    item.save(function(err, itemDocument){
      if(err){
        res.send(err);
        return;
      }

      console.log(itemDocument);
      res.send(itemDocument);
    })
  })

  .get(function(req, res) {
    console.log("GET: /items");
    Location.find({ 'name': req.query.location }, function(err, location) {
      if (err) {
        console.log("Error finding location " + location);
        res.send(err);
      }

      Item.find({ 'location': location[0]._id })
        .sort('name')
        .exec(function(err, items) {
          if (err) {
            console.log("Error getting items for location " + location);
            res.send(err);
          }
          console.log(items);
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
