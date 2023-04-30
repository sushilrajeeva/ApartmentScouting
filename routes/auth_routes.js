//import express, express router as shown in lecture code

import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import middlewareMethods from '../middleware.js';
import helpers from '../helpers.js';
import users from '../data/users.js';
import primaryUsers from '../data/primaryUsers.js';
import scoutUsers from '../data/scoutUsers.js';

//refered https://www.youtube.com/watch?v=TDe7DRYK8vU this youtube video for passing the middlewear [timestamp - 26:30 ish ]
router.route('/').get(middlewareMethods.checkAuthentication, async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/registeruser')
  .get(middlewareMethods.registerMiddleware, async (req, res) => {
    //code here for GET

    //using this logic to calculate max date so user with less than 18 doesn't register
    const today = new Date();
    const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    let countryList = helpers.countryCalculator(helpers.countryCodes)
    console.log("Primary User Regester GET Route is called!!");
    res.render('registeruser', {title: 'Primary User Register', countryCodes: helpers.countryCodes, countryList: countryList, defaultCountry: helpers.defaultCountry, maxDate: maxDate})
  })
  .post(async (req, res) => {
    //code here for POST
    console.log("Regester POST route is called!!");

    

    let firstName = req.body.firstNameInput;
    let middleName = req.body.middleNameInput;
    let lastName = req.body.lastNameInput;
    let emailAddress = req.body.emailAddressInput;
    let countryCode = req.body.countryCodeInput;
    let phoneNumber = req.body.phoneNumberInput;
    let city = req.body.cityInput;
    let state = req.body.stateInput;
    let country = req.body.countryInput;
    let dob = req.body.dobInput;
    let password = req.body.passwordInput;
    let confirmPassword = req.body.confirmPasswordInput;
    let userType = req.body.userTypeInput;
    console.log(req.body);

    console.log("ola");

    console.log({firstName: firstName, middleName: middleName, lastName: lastName, emailAddress: emailAddress, countryCode: countryCode, phoneNumber: phoneNumber, city: city, state: state, country: country, dob: dob, password: password, confirmPassword: confirmPassword, userType: userType});
            
    let codeCountry = "";
    

    try {

      //checking input strings are empty or not
      firstName = helpers.checkEmptyInputString(firstName,"First Name");
      middleName = helpers.checkEmptyInputString(middleName,"First Name");
      lastName = helpers.checkEmptyInputString(lastName,"First Name");
      emailAddress = helpers.checkEmptyInputString(emailAddress,"Email Address");
      emailAddress = emailAddress.toLowerCase();
      countryCode = helpers.checkEmptyInputString(countryCode, "Country Code");
      countryCode = countryCode.trim();
      phoneNumber = helpers.checkEmptyInputString(phoneNumber, "Phone Number");
      city = helpers.checkEmptyInputString(city, "City");
      state = helpers.checkEmptyInputString(state, "State");
      country = helpers.checkEmptyInputString(country, "Country");
      country = helpers.checkEmptyInputString(country, "Country Code");
      country = country.trim();
      userType = helpers.checkEmptyInputString(userType, "User Type");
      userType = userType.trim();
      dob = helpers.checkEmptyInputString(dob);
      helpers.checkEmptyInputString(password, "Password")
      //confirmPassword = checkEmptyInputString(confirmPassword,"Confirm Password");
      helpers.checkEmptyInputString(confirmPassword,"Confirm Password");
      helpers.countryCodeExists(countryCode);
      codeCountry = helpers.findCountry(countryCode);
      helpers.validPhoneNumber(phoneNumber)
      helpers.validCountrySelected(country, codeCountry, countryCode);

      helpers.checkNameInput(firstName, "Name");

      helpers.checkValidEmail(emailAddress);

      helpers.checkValidAge(dob)

      helpers.checkValidPassword(password);

      helpers.checkPasswordsMatch(password, confirmPassword);

      helpers.checkValiduserType(userType);

      console.log("Everything work's fine!!");
      
      //Now running it by the DB

      if(userType.toLowerCase() === "primary user"){
        console.log("Creating primary user DB!!");
        const createdUser = await primaryUsers.createUser(firstName, middleName, lastName, emailAddress, countryCode, phoneNumber, city, state, country, dob, password, confirmPassword, userType);
        if(createdUser.insertedUser === true){
          //if this condition is valid i will load my login page
          //console.log("Created user validation hit");
          
          return res.redirect('/login');
          
        }else {
          //console.log("Didn't blow up !!");
          return res.status(500).json({error: 'Internal Server Error'});
        }
      
      }else{
        console.log("Creating scout user DB!!");
        //do same as above for scout user!!
      }

      // const createdUser = await users.createUser(firstName, lastName, emailAddress, password, role);

      

      
    } catch (error) {
      console.log("Error caugth");
      console.log(error);
      res.status(400).render('registeruser',{title: 'register', error: `<div id="error" class="error" > ${error}</div>`});
    }

    //console.log({firstName: firstName, lastName: lastName, emailAddress, emailAddress, password: password, confirmPassword: confirmPassword, role: role});




    });

router
  .route('/login')
  .get(middlewareMethods.loginMiddleware, async (req, res) => {
    //code here for GET
    //console.log("GET Login Route is called");
    res.render('login', {title: 'login'})
  })
  .post(async (req, res) => {
    //code here for POST
    console.log("Post login is called");

    console.log(req.body);

    let userType = req.body.userTypeInput;
    let emailAddress = req.body.emailAddressInput;
    let password = req.body.passwordInput;

    try {
      userType = helpers.checkEmptyInputString(userType, "User Type");
      userType = userType.toLowerCase();
      emailAddress = helpers.checkEmptyInputString(emailAddress, "Email Address");
      emailAddress.toLowerCase();
      helpers.checkEmptyInputString(password, "Password");

      helpers.checkValiduserType(userType)
      helpers.checkValidEmail(emailAddress);
      helpers.checkValidPassword(password);

      //sending to the db validation

      //triggering login based on user type

      if(userType==="primary user"){
        console.log("primary user checkUser method will be triggered");
        const loginUser = await primaryUsers.checkUser(emailAddress, password);
        req.session.user = {
          firstName: loginUser.firstName,
          middleName: loginUser.middleName,
          lastName: loginUser.lastName,
          emailAddress: loginUser.emailAddress,
          countryCode: loginUser.countryCode, 
          phoneNumber: loginUser.phoneNumber, 
          city: loginUser.city, 
          state: loginUser.state, 
          country: loginUser.country, 
          dob: loginUser.dob,
          listings: loginUser.listings,
          wallet: loginUser.wallet,
          role: loginUser.role,
        };
  
        //redirecting based on the loginUser.role
  
        if(loginUser.role.toLowerCase() === "primary user"){
          return res.redirect('/primaryuser')
        }else{
          return res.redirect('/scoutuser')
        }
        
      }else{
        console.log("scout user checkUser method will be triggered");
        const loginUser = await scoutUsers.checkUser(emailAddress, password);
      }

      //const loginUser = await users.checkUser(emailAddress, password);

      


      

    } catch (error) {
      //console.log("Login Error Caught: ", error);
      return res.status(400).render('login', {title: 'login', error: `<div id="error" class="error" > ${error}</div>`})
      //res.status(400).json({error: error})
    }


    //console.log({email: emailAddress, password: password});

  });

router.route('/scoutuser').get(middlewareMethods.protectedMiddleware, async (req, res) => {
  //code here for GET
  //console.log("Protected route is hit");
  if(req.session.user.role.toLowerCase()==='primary user'){
    let htmlCode = `<p><a href="/primaryuser">Click here to Access primary user Route</a></p>`
    res.render('scoutuser', {title: 'scout user', firstName: req.session.user.firstName, currentTime: new Date().toUTCString(), role: req.session.user.role, primaryuser: htmlCode})
  }else{
    res.render('scoutuser', {title: 'scout user', firstName: req.session.user.firstName, currentTime: new Date().toUTCString(), role: req.session.user.role})
  }
});

router.route('/primaryuser').get(middlewareMethods.adminMiddleware, async (req, res) => {
  //code here for GET
  console.log("Primary user route is hit");
  
  res.render('primaryuser', {title: 'primary user', firstName: req.session.user.firstName, currentTime: new Date().toUTCString()})
});

router.route('/error').get(async (req, res) => {
  //code here for GET
  res.render('error', {title: 'error'})
});

router.route('/logout').get(middlewareMethods.logoutMiddleware, async (req, res) => {
  //code here for 
  let firstName = req.session.user.firstName;
  req.session.destroy();
  res.render('logout', {title: 'logout', firstName: firstName});
});

export default router;
