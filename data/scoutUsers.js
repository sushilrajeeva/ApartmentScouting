//import mongo collections, bcrypt and implement the following data functions
//took reference from lab6'
//use users.js to complete this
import {Router} from 'express';
import {ObjectId} from 'mongodb';
import {scoutUsers} from '../config/mongoCollections.js'
import helpers from '../helpers.js'

import bcrypt from 'bcryptjs';

const saltRounds = 12;

const router = Router();

export const createUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => {

  //console.log("ScoutUSers: Create User function is called!!");
  //check if inputs are empty or not
  

};

export const checkUser = async (emailAddress, password) => {

    console.log("ScouUsers check user method is called!");
  

};

//confirm with TAs if this additional code is required since we are already exporting functions individually
export default {createUser,checkUser}