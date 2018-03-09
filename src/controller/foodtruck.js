import { Router } from 'express';
import mongoose from 'mongoose';
import Foodtruck from '../model/foodtruck';
import Review from '../model/review';

import { authenticate } from '../middleware/authmiddleware';

export default ({ config, db }) => {

  let api = Router();

  // CRUD - Create Read Update Delete

  // '/v1/foodtruck/add'  - Create
  api.post('/add', (req, res) => {
    let newFoodTruck = new Foodtruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'foodtruck saved Successfully' });
    });
  });

  // '/v1/foodtruck' - Read => Read all the items
  api.get('/', authenticate, (req, res) => {
    Foodtruck.find({}, (err, foodtrucks) => {
      if(err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/{id}' - Read => Read specific the item
  api.get('/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });


  // '/v1/foodtruck/id' - Update
  api.put('/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.save(err => {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'foodtruck info is updated successfully' });
      });
    });
  });

  // '/v1/foodtruck/:id' - DELETE - remove a foodtruck
  api.delete('/:id', (req, res) => {
    Foodtruck.remove({ _id: req.params.id }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({message: "foodtruck Successfully Removed"});
    });
  });


  // '/v1/foodtruck/reviews/add/:id'  -   Add review for specific foodtruck id
  api.post('/reviews/add/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }

      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;

      newReview.save((err, review) => {
        if(err) {
          res.send(err);
        }

        foodtruck.reviews.push(newReview);
        foodtruck.save((err) => {
          if (err) {
            res.send(err);
          }
          res.json({ "message": "Review is saved" });
        });
      });
    });
  }); 

  // '/v1/foodtruck/reviews/:id'   - Get the reviews of specific foodtruck
  api.get('/reviews/:id', (req, res) => {
    Review.find({ foodtruck: req.params.id }, (err, reviews) => {
      if(err) {
        res.send(err);
      }

      res.json(reviews);
    });
  });

  return api;
} 