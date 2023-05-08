//took reference from lab6
import {Router} from 'express';
import {ObjectId} from 'mongodb';
import { primaryUsers} from '../config/mongoCollections.js'
import { listings } from '../config/mongoCollections.js';
import { scoutUsers } from '../config/mongoCollections.js';
import helpers from '../helpers.js'

import bcrypt from 'bcryptjs';

const saltRounds = 12;

const router = Router();

export const getListing = async (listingID) => {

    console.log(" Get Listing Data method is called!");
    
    try {

        helpers.isValidObjectID(listingID, "Listing ID");

        const listingIDObj = new ObjectId(listingID)
  
        const listingsCollection = await listings();
        const query =  { _id: listingIDObj };
        const listing = await listingsCollection.findOne(query);

        listing._id = listing._id.toString();

        return listing;
      
  
  
    } catch (error) {
      throw error;
    }
  };

  export default {getListing}