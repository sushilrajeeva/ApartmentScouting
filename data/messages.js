//took reference from lab6
import {Router} from 'express';
import {ObjectId} from 'mongodb';
import { primaryUsers} from '../config/mongoCollections.js'
import { listings } from '../config/mongoCollections.js';
import { scoutUsers } from '../config/mongoCollections.js';
import { messages } from '../config/mongoCollections.js';
import helpers from '../helpers.js'

import bcrypt from 'bcryptjs';

const saltRounds = 12;

const router = Router();

export const getMessageById = async (messageID) => {

    console.log(" Get message Data method is called!");
    
    try {

        helpers.checkEmptyInputString(messageID)
        helpers.isValidObjectID(messageID, "Message ID");

        console.log("My message ID ->", messageID);

        const messageIDObj = new ObjectId(messageID)

        console.log("My message ID ->", messageIDObj);
  
        const messagesCollection = await messages();
        const query =  { _id: messageIDObj };
        const message = await messagesCollection.findOne(query);

        

        message._id = message._id.toString();

        console.log("I got this message -> ", message);

        return message;
      
  
  
    } catch (error) {
      throw error;
    }
  };

  export default {getMessageById}