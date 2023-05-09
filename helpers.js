//Used professor's lecture code 5 and my lab6 helper functions i created previously for my reference

import {ObjectId} from 'mongodb';

const exportedMethods = {
    description: 'This is my helper function for lab-10',
    checkId(id) {
        if (!id){
            throw 'Error: You must provide an id to search for';
        }
        if (typeof id !== 'string') {
            throw 'Error: id must be a string';
        }
        id = id.trim();
        if (id.length === 0) {
            throw 'Error: id cannot be an empty string or just spaces';
        }    
        if (!ObjectId.isValid(id)) {
            throw 'Error: invalid object ID';
        }
        return id;
  },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0) throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal)) throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
  },

    isString(input){
        if(typeof input === string){
            return true;
        }else{
            return false;
        }
    },

    checkCreateUserInputs(firstName, lastName, emailAddress, password, role){
    
        let errorMsg = `All fields need to have valid values`;
        if(!firstName){
            throw errorMsg;
        }
        if(!lastName){
            throw errorMsg;
        }
        if(!emailAddress){
            throw errorMsg;
        }
        if(!password){
            throw errorMsg;
        }
        if(!role){
            throw errorMsg;
        }

    },

    checkEmptyInputString(str, type){
    
        if(!str){
            throw `${type} can't be empty!`
        }else if(typeof str !== 'string'){
            throw `${type} should be a string`
        }else if(str.trim() === ""){
            throw `${type} can't be empty spaces, must be a valid string input`
        }
        return str.trim()
    },

    checkValidEmail(email){
    
        //took reference from https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
        //const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        //took reference from https://www.w3resource.com/javascript/form/email-validation.php#:~:text=To%20get%20a%20valid%20email,%5D%2B)*%24%2F. 
        const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isValid = emailRegEx.test(email);
    
        if(!isValid){
            throw `${email} is not of a valid email format! please make sure you have provided a valid email address format like -> example@example.com`
        }
    
        console.log(`Valid Email -  ${email}`);
    
        return isValid
    },

    checkValidPassword(password){
        if(password.length < 8){
            throw `Error: Password too short! Length of password must be a minimum of 8 Charecters long and can't be empty spaces..`;
        }
    
        let containsSpace = /\s/.test(password);
        if (containsSpace) {
            throw `Error: Your Password should not contain spaces!!`;
        }
    
        let containsUpper = /[A-Z]/.test(password);
        if(!containsUpper){
            throw `Error: Password must contain atleast one Upper Case Charecter!!`;
        }
        let containsNumber = /[0-9]/.test(password);
        if(!containsNumber){
            throw `Error: Password must contain atleast one Number!!`;
        }
        //took reference from this -> https://codingbeautydev.com/blog/javascript-check-if-string-contains-special-characters/#:~:text=So%2C%20some()%20returns%20true,at%20least%20one%20special%20character.
        let containsSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
        if(!containsSpecial){
            throw `Error: Password must contain atleast one Special Charecter!!`;
        }
    
        console.log(`Valid password - ${password} exist`);
    },


    checkPropertyNameInput(name, type){
        let nameRegex = /^[A-Za-z0-9 - , -]{2,50}$/.test(name);
    
        if(!nameRegex){
            throw `Error: ${name} should be a valid ${type}!, should be 2 to 25 charecters long, can contain alphabets, numbers, spaces, commas and hyphens..`
        }
    
        console.log(`Valid ${name} of type ${type} exist`);
    
    },

    checkMidNameInput(name, type){
        //console.log("Check name input function is called!!");
        let nameRegex = /^[A-Za-z]{0,25}$/.test(name);

        if(!nameRegex){
            throw `Error: ${name} should be a valid ${type}!, should be 0 to 25 charecters long, non empty spaces containing only alphabets and no numbers..`
        }

        console.log(`Valid ${name} of type ${type} exist`);
    
    },  
    checkNameInput(name, type){
        //console.log("Check name input function is called!!");
        let nameRegex = /^[A-Za-z]{2,25}$/.test(name);

        if(!nameRegex){
            throw `Error: ${name} should be a valid ${type}!, should be 2 to 25 charecters long, non empty spaces containing only alphabets and no numbers..`
        }

        console.log(`Valid ${name} of type ${type} exist`);
    
    },

    checkPasswordsMatch(password, confirmPassword){
        if(password!==confirmPassword){
            throw `Error: Password and Confirm Password don't match!!`
        }
        console.log(`Passwords match!!`);
    },

    checkValiduserType(userType){
        let validUserTypes = ["primary user", "scout user"];
        let isValid = validUserTypes.includes(userType);
        if(!isValid){
            throw `The User Type - ${userType} you entered is invalid. Please make sure you select either "Primary User" or "Scout User" User Type only!!`
        }
        console.log(`${userType} is a valid user type`);
      },
      countryCodeExists(dial_code) {
        for (let i = 0; i < this.countryCodes.length; i++) {
          // If the current object's code key matches the provided code, return true
          if (this.countryCodes[i].dial_code === dial_code) {
            console.log(`Valid country code ${dial_code} exist`);
            return true;
          }
        }
        // If no match is found, return false
        throw `Error: ${dial_code} is an Invalid Country Code!`;
      },
      validPhoneNumber(phoneNumber){
        let phoneNumberRegex = /[0-9]{10}/.test(phoneNumber);
        if(!phoneNumberRegex){
            throw `Error: Phone Number ${phoneNumber} Entered by you is not a valid! Phone number should be a 10 digit number`;
        }
    },
    validCountrySelected(country){
        console.log(country);
        let countryFound = false;
        for (let i = 0; i < this.countryCodes.length; i++) {
            // If the current object's code key matches the provided code, return true
            if (this.countryCodes[i].name === country) {
                console.log(`Valid Country name ${country} selected`);
                countryFound =  true;
            }
            
          }

          // If no match is found, return false
          if(countryFound!==true){
            throw `Error: ${country} is an Invalid Country Name!`;
          }
          
    },

    findCountry(countryCode){
        let country = "";
        for(let i=0; i<this.countryCodes.length; i++){
            if(countryCode === this.countryCodes[i].dial_code){
                country = this.countryCodes[i].name;
                return country;
            }
        }
        if(country.trim() === ""){
            throw `Invalid Country Code!!`
        }
        return country;
    },

    countryCalculator(countryCode){
        let countryList = [];
        for(let i=0; i<countryCode.length; i++){
            countryList.push(countryCode[i].name)
        }
        //console.log("CountryList, ", countryList);
        return countryList;
    },
    checkValidAge(dob){
        const dobInput = new Date(dob);
        const currentDate = new Date();
        //subtracting 18 years from current year so that i can directly see if the age difference is 18 or more
        currentDate.setFullYear(currentDate.getFullYear() - 18);
    
        const age = new Date().getFullYear() - dobInput.getFullYear();
        if (dobInput > currentDate) {
            throw `Your current age is ${age}! You must be at least 18 years old to register in our application.`;
        }
        console.log(`Your age ${age} is valid`);
    },

    checkStateNameInput(name, type){
    let nameRegex = /^[A-Za-z ]{2,}$/.test(name);

    if(!nameRegex){
        throw `Error: ${name} should be a valid ${type}!, should be more than 2  charecters long, can contain alphabets, spaces.`
    }

    console.log(`Valid ${name} of type ${type} exist`);
    },


    checkValidDate(date){

        // referred this for dateRegex https://www.regextester.com/96683 to match yyyy-mm-dd format
        dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    
        if(!dateRegex.text(date)){
            throw `The date ${date} you entered is not of valid date format yyyy-mm-dd!`
        }
    },
    isValidWebsiteLink(url) {
        const regex = /^https:\/\/www\.[a-zA-Z-_]{5,}\.com(?:\/.*)?$/;
        if(regex.test(url)){
            return true
        }else{
            return "The URL entered is invalid. The URL must begin with 'https://www.' followed by at least 5 alphabetic characters, then '.com', and an optional URI."
        };
    },
    isValidCountry(country){

        if(!country){
            throw `Country can't be empty string`
        }
    
        for(let i=0; i<this.countryCodes.length; i++){
            if(country.toLowerCase().trim() === this.countryCodes[i].name.toLowerCase().trim()){
                return country;
            }
        }
    
        throw `The Country Name ${country} you selected is not a valid country`
    },
    isValidPincode(pincode) {
        const pincodeRegex = /^\d{5}$/;
        return pincodeRegex.test(pincode);
      },
      validRewards(reward){
        const rewardRegex = /^([1-9]\d?|100)$/
    
        if(!rewardRegex.test(reward)){
            throw `The reward amount ${reward} USD you entered is Invalid! Reward should be an Integer between 1 and 100 USD only!`
        }
      },

      isValidObjectID(idString, type){

        

        if (!ObjectId.isValid(idString)) {
            throw `The ${type} is not a valid ObjectID type`;
          }
      },
      isValidRent(rent){
        const rentRegex = /^\d*$/;
        if(!rentRegex.test(rent)){
            throw `The rent ${rent} you entered is invalid!!`
        }
      },

      isValidAdditionalInfo(additionalInfo){
        const minLength = 2;
        const maxLength = 250;
        if (additionalInfo === '') {
            throw 'Additional Information input cannot be empty.';
        }
    
        if (additionalInfo.length < minLength) {
            throw `Additional Information must be at least ${minLength} characters long`;
        }
    
        if (additionalInfo.length > maxLength) {
            throw `Additional Information must be no more than ${maxLength} characters long`;
        }
      },
      checkStreetName(street){
        const streetRegex = /^\s*\S(?:.*\S)?\s*$/;
    
        if (!streetRegex.test(street)) {
            throw new Error(`Street name ${street} you Entered is invalid! Street must be at least 3 non-whitespace characters long.`);
        }
    
    },
    isValidCardNumber(cardNumber){
        // reffered -> https://www.regextester.com/104911 
        let cardNumberRegex = /(^\d{15}$)|(^\d{16}$)/;
    
        if(!cardNumberRegex.test(cardNumber)){
            throw `The Card Number ${cardNumber} you entered is invalid! Please Enter a 15 or 16 digit number only!`
        }
    
    },
    isValidCVV(cvv){
        // reffered -> https://www.regextester.com/104911 
        let cvvRegex = /(^\d{3}$)|(^\d{4}$)/;
    
        if(!cvvRegex.test(cvv)){
            throw `The CVV ${cvv} you entered is invalid! Please Enter a valid 3 or 4 digit number only!`
        }
    
    },
    isValidAmount(amount){
        let amountRegex = /^([1-9]\d{0,3}|10000)$/;
    
        if(!amountRegex.test(amount)){
            throw `The amount ${amount} you entered is invalid! Please enter a valid amount from 1 to 10000 USD`
        }
    },
    validCardCredentials(cardNumber, cvv){
        let isValidCred = false;
        if(cardNumber === '1234123412341234'){
            if(cvv === '1234'){
                isValidCred = true;
            }else {
                throw `Error: Invalid Card Number or CVV please Try Again!`
            }
        }else if(cardNumber === '123412341234123'){
            if(cvv === '123'){
                isValidCred = true;
            }else{
                throw `Error: Invalid Card Number or CVV please Try Again!`;
            }
        }else {
            throw `Error: Invalid Card Number or CVV please Try Again!`
        }

        console.log("VALID CRED");

        return isValidCred;



    },
    isValidComment(comment){
        const minLength = 1;
        const maxLength = 500;
        if (comment === '') {
            throw 'Comment Section input cannot be empty.';
        }
    
        if (comment.length < minLength) {
            throw `Comment text must be at least ${minLength} characters long`;
        }
    
        if (comment.length > maxLength) {
            throw `Comment text must be no more than ${maxLength} characters long`;
        }
      },
      formatDate(timestamp) {
        
        const date = new Date(timestamp);
        return date.toDateString() + ' ' + date.toTimeString().split(' ')[0];
      },
      
//USED THIS REPO FOR COUNTRY CODE https://gist.githubusercontent.com/DmytroLisitsyn/1c31186e5b66f1d6c52da6b5c70b12ad/raw/2bc71083a77106afec2ec37cf49d05ee54be1a22/country_dial_info.json


defaultCountry: {
        name: "United States",
        flag: "🇺🇸",
        code: "US",
        dial_code: "+1"
    },
    countryCodes:  [
        {
        name: "Afghanistan",
        flag: "🇦🇫",
        code: "AF",
        dial_code: "+93"
        },
        {
        name: "Åland Islands",
        flag: "🇦🇽",
        code: "AX",
        dial_code: "+358"
        },
        {
        name: "Albania",
        flag: "🇦🇱",
        code: "AL",
        dial_code: "+355"
        },
        {
        name: "Algeria",
        flag: "🇩🇿",
        code: "DZ",
        dial_code: "+213"
        },
        {
        name: "American Samoa",
        flag: "🇦🇸",
        code: "AS",
        dial_code: "+1684"
        },
        {
        name: "Andorra",
        flag: "🇦🇩",
        code: "AD",
        dial_code: "+376"
        },
        {
        name: "Angola",
        flag: "🇦🇴",
        code: "AO",
        dial_code: "+244"
        },
        {
        name: "Anguilla",
        flag: "🇦🇮",
        code: "AI",
        dial_code: "+1264"
        },
        {
        name: "Antarctica",
        flag: "🇦🇶",
        code: "AQ",
        dial_code: "+672"
        },
        {
        name: "Antigua and Barbuda",
        flag: "🇦🇬",
        code: "AG",
        dial_code: "+1268"
        },
        {
        name: "Argentina",
        flag: "🇦🇷",
        code: "AR",
        dial_code: "+54"
        },
        {
        name: "Armenia",
        flag: "🇦🇲",
        code: "AM",
        dial_code: "+374"
        },
        {
        name: "Aruba",
        flag: "🇦🇼",
        code: "AW",
        dial_code: "+297"
        },
        {
        name: "Australia",
        flag: "🇦🇺",
        code: "AU",
        dial_code: "+61"
        },
        {
        name: "Austria",
        flag: "🇦🇹",
        code: "AT",
        dial_code: "+43"
        },
        {
        name: "Azerbaijan",
        flag: "🇦🇿",
        code: "AZ",
        dial_code: "+994"
        },
        {
        name: "Bahamas",
        flag: "🇧🇸",
        code: "BS",
        dial_code: "+1242"
        },
        {
        name: "Bahrain",
        flag: "🇧🇭",
        code: "BH",
        dial_code: "+973"
        },
        {
        name: "Bangladesh",
        flag: "🇧🇩",
        code: "BD",
        dial_code: "+880"
        },
        {
        name: "Barbados",
        flag: "🇧🇧",
        code: "BB",
        dial_code: "+1246"
        },
        {
        name: "Belarus",
        flag: "🇧🇾",
        code: "BY",
        dial_code: "+375"
        },
        {
        name: "Belgium",
        flag: "🇧🇪",
        code: "BE",
        dial_code: "+32"
        },
        {
        name: "Belize",
        flag: "🇧🇿",
        code: "BZ",
        dial_code: "+501"
        },
        {
        name: "Benin",
        flag: "🇧🇯",
        code: "BJ",
        dial_code: "+229"
        },
        {
        name: "Bermuda",
        flag: "🇧🇲",
        code: "BM",
        dial_code: "+1441"
        },
        {
        name: "Bhutan",
        flag: "🇧🇹",
        code: "BT",
        dial_code: "+975"
        },
        {
        name: "Bolivia, Plurinational State of bolivia",
        flag: "🇧🇴",
        code: "BO",
        dial_code: "+591"
        },
        {
        name: "Bosnia and Herzegovina",
        flag: "🇧🇦",
        code: "BA",
        dial_code: "+387"
        },
        {
        name: "Botswana",
        flag: "🇧🇼",
        code: "BW",
        dial_code: "+267"
        },
        {
        name: "Bouvet Island",
        flag: "🇧🇻",
        code: "BV",
        dial_code: "+47"
        },
        {
        name: "Brazil",
        flag: "🇧🇷",
        code: "BR",
        dial_code: "+55"
        },
        {
        name: "British Indian Ocean Territory",
        flag: "🇮🇴",
        code: "IO",
        dial_code: "+246"
        },
        {
        name: "Brunei Darussalam",
        flag: "🇧🇳",
        code: "BN",
        dial_code: "+673"
        },
        {
        name: "Bulgaria",
        flag: "🇧🇬",
        code: "BG",
        dial_code: "+359"
        },
        {
        name: "Burkina Faso",
        flag: "🇧🇫",
        code: "BF",
        dial_code: "+226"
        },
        {
        name: "Burundi",
        flag: "🇧🇮",
        code: "BI",
        dial_code: "+257"
        },
        {
        name: "Cambodia",
        flag: "🇰🇭",
        code: "KH",
        dial_code: "+855"
        },
        {
        name: "Cameroon",
        flag: "🇨🇲",
        code: "CM",
        dial_code: "+237"
        },
        {
        name: "Canada",
        flag: "🇨🇦",
        code: "CA",
        dial_code: "+1"
        },
        {
        name: "Cape Verde",
        flag: "🇨🇻",
        code: "CV",
        dial_code: "+238"
        },
        {
        name: "Cayman Islands",
        flag: "🇰🇾",
        code: "KY",
        dial_code: "+345"
        },
        {
        name: "Central African Republic",
        flag: "🇨🇫",
        code: "CF",
        dial_code: "+236"
        },
        {
        name: "Chad",
        flag: "🇹🇩",
        code: "TD",
        dial_code: "+235"
        },
        {
        name: "Chile",
        flag: "🇨🇱",
        code: "CL",
        dial_code: "+56"
        },
        {
        name: "China",
        flag: "🇨🇳",
        code: "CN",
        dial_code: "+86"
        },
        {
        name: "Christmas Island",
        flag: "🇨🇽",
        code: "CX",
        dial_code: "+61"
        },
        {
        name: "Cocos (Keeling) Islands",
        flag: "🇨🇨",
        code: "CC",
        dial_code: "+61"
        },
        {
        name: "Colombia",
        flag: "🇨🇴",
        code: "CO",
        dial_code: "+57"
        },
        {
        name: "Comoros",
        flag: "🇰🇲",
        code: "KM",
        dial_code: "+269"
        },
        {
        name: "Congo",
        flag: "🇨🇬",
        code: "CG",
        dial_code: "+242"
        },
        {
        name: "Congo, The Democratic Republic of the Congo",
        flag: "🇨🇩",
        code: "CD",
        dial_code: "+243"
        },
        {
        name: "Cook Islands",
        flag: "🇨🇰",
        code: "CK",
        dial_code: "+682"
        },
        {
        name: "Costa Rica",
        flag: "🇨🇷",
        code: "CR",
        dial_code: "+506"
        },
        {
        name: "Cote d'Ivoire",
        flag: "🇨🇮",
        code: "CI",
        dial_code: "+225"
        },
        {
        name: "Croatia",
        flag: "🇭🇷",
        code: "HR",
        dial_code: "+385"
        },
        {
        name: "Cuba",
        flag: "🇨🇺",
        code: "CU",
        dial_code: "+53"
        },
        {
        name: "Cyprus",
        flag: "🇨🇾",
        code: "CY",
        dial_code: "+357"
        },
        {
        name: "Czech Republic",
        flag: "🇨🇿",
        code: "CZ",
        dial_code: "+420"
        },
        {
        name: "Denmark",
        flag: "🇩🇰",
        code: "DK",
        dial_code: "+45"
        },
        {
        name: "Djibouti",
        flag: "🇩🇯",
        code: "DJ",
        dial_code: "+253"
        },
        {
        name: "Dominica",
        flag: "🇩🇲",
        code: "DM",
        dial_code: "+1767"
        },
        {
        name: "Dominican Republic",
        flag: "🇩🇴",
        code: "DO",
        dial_code: "+1849"
        },
        {
        name: "Ecuador",
        flag: "🇪🇨",
        code: "EC",
        dial_code: "+593"
        },
        {
        name: "Egypt",
        flag: "🇪🇬",
        code: "EG",
        dial_code: "+20"
        },
        {
        name: "El Salvador",
        flag: "🇸🇻",
        code: "SV",
        dial_code: "+503"
        },
        {
        name: "Equatorial Guinea",
        flag: "🇬🇶",
        code: "GQ",
        dial_code: "+240"
        },
        {
        name: "Eritrea",
        flag: "🇪🇷",
        code: "ER",
        dial_code: "+291"
        },
        {
        name: "Estonia",
        flag: "🇪🇪",
        code: "EE",
        dial_code: "+372"
        },
        {
        name: "Ethiopia",
        flag: "🇪🇹",
        code: "ET",
        dial_code: "+251"
        },
        {
        name: "Falkland Islands (Malvinas)",
        flag: "🇫🇰",
        code: "FK",
        dial_code: "+500"
        },
        {
        name: "Faroe Islands",
        flag: "🇫🇴",
        code: "FO",
        dial_code: "+298"
        },
        {
        name: "Fiji",
        flag: "🇫🇯",
        code: "FJ",
        dial_code: "+679"
        },
        {
        name: "Finland",
        flag: "🇫🇮",
        code: "FI",
        dial_code: "+358"
        },
        {
        name: "France",
        flag: "🇫🇷",
        code: "FR",
        dial_code: "+33"
        },
        {
        name: "French Guiana",
        flag: "🇬🇫",
        code: "GF",
        dial_code: "+594"
        },
        {
        name: "French Polynesia",
        flag: "🇵🇫",
        code: "PF",
        dial_code: "+689"
        },
        {
        name: "French Southern Territories",
        flag: "🇹🇫",
        code: "TF",
        dial_code: "+262"
        },
        {
        name: "Gabon",
        flag: "🇬🇦",
        code: "GA",
        dial_code: "+241"
        },
        {
        name: "Gambia",
        flag: "🇬🇲",
        code: "GM",
        dial_code: "+220"
        },
        {
        name: "Georgia",
        flag: "🇬🇪",
        code: "GE",
        dial_code: "+995"
        },
        {
        name: "Germany",
        flag: "🇩🇪",
        code: "DE",
        dial_code: "+49"
        },
        {
        name: "Ghana",
        flag: "🇬🇭",
        code: "GH",
        dial_code: "+233"
        },
        {
        name: "Gibraltar",
        flag: "🇬🇮",
        code: "GI",
        dial_code: "+350"
        },
        {
        name: "Greece",
        flag: "🇬🇷",
        code: "GR",
        dial_code: "+30"
        },
        {
        name: "Greenland",
        flag: "🇬🇱",
        code: "GL",
        dial_code: "+299"
        },
        {
        name: "Grenada",
        flag: "🇬🇩",
        code: "GD",
        dial_code: "+1473"
        },
        {
        name: "Guadeloupe",
        flag: "🇬🇵",
        code: "GP",
        dial_code: "+590"
        },
        {
        name: "Guam",
        flag: "🇬🇺",
        code: "GU",
        dial_code: "+1671"
        },
        {
        name: "Guatemala",
        flag: "🇬🇹",
        code: "GT",
        dial_code: "+502"
        },
        {
        name: "Guernsey",
        flag: "🇬🇬",
        code: "GG",
        dial_code: "+44"
        },
        {
        name: "Guinea",
        flag: "🇬🇳",
        code: "GN",
        dial_code: "+224"
        },
        {
        name: "Guinea-Bissau",
        flag: "🇬🇼",
        code: "GW",
        dial_code: "+245"
        },
        {
        name: "Guyana",
        flag: "🇬🇾",
        code: "GY",
        dial_code: "+592"
        },
        {
        name: "Haiti",
        flag: "🇭🇹",
        code: "HT",
        dial_code: "+509"
        },
        {
        name: "Heard Island and Mcdonald Islands",
        flag: "🇭🇲",
        code: "HM",
        dial_code: "+672"
        },
        {
        name: "Holy See (Vatican City State)",
        flag: "🇻🇦",
        code: "VA",
        dial_code: "+379"
        },
        {
        name: "Honduras",
        flag: "🇭🇳",
        code: "HN",
        dial_code: "+504"
        },
        {
        name: "Hong Kong",
        flag: "🇭🇰",
        code: "HK",
        dial_code: "+852"
        },
        {
        name: "Hungary",
        flag: "🇭🇺",
        code: "HU",
        dial_code: "+36"
        },
        {
        name: "Iceland",
        flag: "🇮🇸",
        code: "IS",
        dial_code: "+354"
        },
        {
        name: "India",
        flag: "🇮🇳",
        code: "IN",
        dial_code: "+91"
        },
        {
        name: "Indonesia",
        flag: "🇮🇩",
        code: "ID",
        dial_code: "+62"
        },
        {
        name: "Iran, Islamic Republic of Persian Gulf",
        flag: "🇮🇷",
        code: "IR",
        dial_code: "+98"
        },
        {
        name: "Iraq",
        flag: "🇮🇶",
        code: "IQ",
        dial_code: "+964"
        },
        {
        name: "Ireland",
        flag: "🇮🇪",
        code: "IE",
        dial_code: "+353"
        },
        {
        name: "Isle of Man",
        flag: "🇮🇲",
        code: "IM",
        dial_code: "+44"
        },
        {
        name: "Israel",
        flag: "🇮🇱",
        code: "IL",
        dial_code: "+972"
        },
        {
        name: "Italy",
        flag: "🇮🇹",
        code: "IT",
        dial_code: "+39"
        },
        {
        name: "Jamaica",
        flag: "🇯🇲",
        code: "JM",
        dial_code: "+1876"
        },
        {
        name: "Japan",
        flag: "🇯🇵",
        code: "JP",
        dial_code: "+81"
        },
        {
        name: "Jersey",
        flag: "🇯🇪",
        code: "JE",
        dial_code: "+44"
        },
        {
        name: "Jordan",
        flag: "🇯🇴",
        code: "JO",
        dial_code: "+962"
        },
        {
        name: "Kazakhstan",
        flag: "🇰🇿",
        code: "KZ",
        dial_code: "+7"
        },
        {
        name: "Kenya",
        flag: "🇰🇪",
        code: "KE",
        dial_code: "+254"
        },
        {
        name: "Kiribati",
        flag: "🇰🇮",
        code: "KI",
        dial_code: "+686"
        },
        {
        name: "Korea, Democratic People's Republic of Korea",
        flag: "🇰🇵",
        code: "KP",
        dial_code: "+850"
        },
        {
        name: "Korea, Republic of South Korea",
        flag: "🇰🇷",
        code: "KR",
        dial_code: "+82"
        },
        {
        name: "Kosovo",
        flag: "🇽🇰",
        code: "XK",
        dial_code: "+383"
        },
        {
        name: "Kuwait",
        flag: "🇰🇼",
        code: "KW",
        dial_code: "+965"
        },
        {
        name: "Kyrgyzstan",
        flag: "🇰🇬",
        code: "KG",
        dial_code: "+996"
        },
        {
        name: "Laos",
        flag: "🇱🇦",
        code: "LA",
        dial_code: "+856"
        },
        {
        name: "Latvia",
        flag: "🇱🇻",
        code: "LV",
        dial_code: "+371"
        },
        {
        name: "Lebanon",
        flag: "🇱🇧",
        code: "LB",
        dial_code: "+961"
        },
        {
        name: "Lesotho",
        flag: "🇱🇸",
        code: "LS",
        dial_code: "+266"
        },
        {
        name: "Liberia",
        flag: "🇱🇷",
        code: "LR",
        dial_code: "+231"
        },
        {
        name: "Libyan Arab Jamahiriya",
        flag: "🇱🇾",
        code: "LY",
        dial_code: "+218"
        },
        {
        name: "Liechtenstein",
        flag: "🇱🇮",
        code: "LI",
        dial_code: "+423"
        },
        {
        name: "Lithuania",
        flag: "🇱🇹",
        code: "LT",
        dial_code: "+370"
        },
        {
        name: "Luxembourg",
        flag: "🇱🇺",
        code: "LU",
        dial_code: "+352"
        },
        {
        name: "Macao",
        flag: "🇲🇴",
        code: "MO",
        dial_code: "+853"
        },
        {
        name: "Macedonia",
        flag: "🇲🇰",
        code: "MK",
        dial_code: "+389"
        },
        {
        name: "Madagascar",
        flag: "🇲🇬",
        code: "MG",
        dial_code: "+261"
        },
        {
        name: "Malawi",
        flag: "🇲🇼",
        code: "MW",
        dial_code: "+265"
        },
        {
        name: "Malaysia",
        flag: "🇲🇾",
        code: "MY",
        dial_code: "+60"
        },
        {
        name: "Maldives",
        flag: "🇲🇻",
        code: "MV",
        dial_code: "+960"
        },
        {
        name: "Mali",
        flag: "🇲🇱",
        code: "ML",
        dial_code: "+223"
        },
        {
        name: "Malta",
        flag: "🇲🇹",
        code: "MT",
        dial_code: "+356"
        },
        {
        name: "Marshall Islands",
        flag: "🇲🇭",
        code: "MH",
        dial_code: "+692"
        },
        {
        name: "Martinique",
        flag: "🇲🇶",
        code: "MQ",
        dial_code: "+596"
        },
        {
        name: "Mauritania",
        flag: "🇲🇷",
        code: "MR",
        dial_code: "+222"
        },
        {
        name: "Mauritius",
        flag: "🇲🇺",
        code: "MU",
        dial_code: "+230"
        },
        {
        name: "Mayotte",
        flag: "🇾🇹",
        code: "YT",
        dial_code: "+262"
        },
        {
        name: "Mexico",
        flag: "🇲🇽",
        code: "MX",
        dial_code: "+52"
        },
        {
        name: "Micronesia, Federated States of Micronesia",
        flag: "🇫🇲",
        code: "FM",
        dial_code: "+691"
        },
        {
        name: "Moldova",
        flag: "🇲🇩",
        code: "MD",
        dial_code: "+373"
        },
        {
        name: "Monaco",
        flag: "🇲🇨",
        code: "MC",
        dial_code: "+377"
        },
        {
        name: "Mongolia",
        flag: "🇲🇳",
        code: "MN",
        dial_code: "+976"
        },
        {
        name: "Montenegro",
        flag: "🇲🇪",
        code: "ME",
        dial_code: "+382"
        },
        {
        name: "Montserrat",
        flag: "🇲🇸",
        code: "MS",
        dial_code: "+1664"
        },
        {
        name: "Morocco",
        flag: "🇲🇦",
        code: "MA",
        dial_code: "+212"
        },
        {
        name: "Mozambique",
        flag: "🇲🇿",
        code: "MZ",
        dial_code: "+258"
        },
        {
        name: "Myanmar",
        flag: "🇲🇲",
        code: "MM",
        dial_code: "+95"
        },
        {
        name: "Namibia",
        flag: "🇳🇦",
        code: "NA",
        dial_code: "+264"
        },
        {
        name: "Nauru",
        flag: "🇳🇷",
        code: "NR",
        dial_code: "+674"
        },
        {
        name: "Nepal",
        flag: "🇳🇵",
        code: "NP",
        dial_code: "+977"
        },
        {
        name: "Netherlands",
        flag: "🇳🇱",
        code: "NL",
        dial_code: "+31"
        },
        {
        name: "Netherlands Antilles",
        flag: "",
        code: "AN",
        dial_code: "+599"
        },
        {
        name: "New Caledonia",
        flag: "🇳🇨",
        code: "NC",
        dial_code: "+687"
        },
        {
        name: "New Zealand",
        flag: "🇳🇿",
        code: "NZ",
        dial_code: "+64"
        },
        {
        name: "Nicaragua",
        flag: "🇳🇮",
        code: "NI",
        dial_code: "+505"
        },
        {
        name: "Niger",
        flag: "🇳🇪",
        code: "NE",
        dial_code: "+227"
        },
        {
        name: "Nigeria",
        flag: "🇳🇬",
        code: "NG",
        dial_code: "+234"
        },
        {
        name: "Niue",
        flag: "🇳🇺",
        code: "NU",
        dial_code: "+683"
        },
        {
        name: "Norfolk Island",
        flag: "🇳🇫",
        code: "NF",
        dial_code: "+672"
        },
        {
        name: "Northern Mariana Islands",
        flag: "🇲🇵",
        code: "MP",
        dial_code: "+1670"
        },
        {
        name: "Norway",
        flag: "🇳🇴",
        code: "NO",
        dial_code: "+47"
        },
        {
        name: "Oman",
        flag: "🇴🇲",
        code: "OM",
        dial_code: "+968"
        },
        {
        name: "Pakistan",
        flag: "🇵🇰",
        code: "PK",
        dial_code: "+92"
        },
        {
        name: "Palau",
        flag: "🇵🇼",
        code: "PW",
        dial_code: "+680"
        },
        {
        name: "Palestinian Territory, Occupied",
        flag: "🇵🇸",
        code: "PS",
        dial_code: "+970"
        },
        {
        name: "Panama",
        flag: "🇵🇦",
        code: "PA",
        dial_code: "+507"
        },
        {
        name: "Papua New Guinea",
        flag: "🇵🇬",
        code: "PG",
        dial_code: "+675"
        },
        {
        name: "Paraguay",
        flag: "🇵🇾",
        code: "PY",
        dial_code: "+595"
        },
        {
        name: "Peru",
        flag: "🇵🇪",
        code: "PE",
        dial_code: "+51"
        },
        {
        name: "Philippines",
        flag: "🇵🇭",
        code: "PH",
        dial_code: "+63"
        },
        {
        name: "Pitcairn",
        flag: "🇵🇳",
        code: "PN",
        dial_code: "+64"
        },
        {
        name: "Poland",
        flag: "🇵🇱",
        code: "PL",
        dial_code: "+48"
        },
        {
        name: "Portugal",
        flag: "🇵🇹",
        code: "PT",
        dial_code: "+351"
        },
        {
        name: "Puerto Rico",
        flag: "🇵🇷",
        code: "PR",
        dial_code: "+1939"
        },
        {
        name: "Qatar",
        flag: "🇶🇦",
        code: "QA",
        dial_code: "+974"
        },
        {
        name: "Romania",
        flag: "🇷🇴",
        code: "RO",
        dial_code: "+40"
        },
        {
        name: "Russia",
        flag: "🇷🇺",
        code: "RU",
        dial_code: "+7"
        },
        {
        name: "Rwanda",
        flag: "🇷🇼",
        code: "RW",
        dial_code: "+250"
        },
        {
        name: "Reunion",
        flag: "🇷🇪",
        code: "RE",
        dial_code: "+262"
        },
        {
        name: "Saint Barthelemy",
        flag: "🇧🇱",
        code: "BL",
        dial_code: "+590"
        },
        {
        name: "Saint Helena, Ascension and Tristan Da Cunha",
        flag: "🇸🇭",
        code: "SH",
        dial_code: "+290"
        },
        {
        name: "Saint Kitts and Nevis",
        flag: "🇰🇳",
        code: "KN",
        dial_code: "+1869"
        },
        {
        name: "Saint Lucia",
        flag: "🇱🇨",
        code: "LC",
        dial_code: "+1758"
        },
        {
        name: "Saint Martin",
        flag: "🇲🇫",
        code: "MF",
        dial_code: "+590"
        },
        {
        name: "Saint Pierre and Miquelon",
        flag: "🇵🇲",
        code: "PM",
        dial_code: "+508"
        },
        {
        name: "Saint Vincent and the Grenadines",
        flag: "🇻🇨",
        code: "VC",
        dial_code: "+1784"
        },
        {
        name: "Samoa",
        flag: "🇼🇸",
        code: "WS",
        dial_code: "+685"
        },
        {
        name: "San Marino",
        flag: "🇸🇲",
        code: "SM",
        dial_code: "+378"
        },
        {
        name: "Sao Tome and Principe",
        flag: "🇸🇹",
        code: "ST",
        dial_code: "+239"
        },
        {
        name: "Saudi Arabia",
        flag: "🇸🇦",
        code: "SA",
        dial_code: "+966"
        },
        {
        name: "Senegal",
        flag: "🇸🇳",
        code: "SN",
        dial_code: "+221"
        },
        {
        name: "Serbia",
        flag: "🇷🇸",
        code: "RS",
        dial_code: "+381"
        },
        {
        name: "Seychelles",
        flag: "🇸🇨",
        code: "SC",
        dial_code: "+248"
        },
        {
        name: "Sierra Leone",
        flag: "🇸🇱",
        code: "SL",
        dial_code: "+232"
        },
        {
        name: "Singapore",
        flag: "🇸🇬",
        code: "SG",
        dial_code: "+65"
        },
        {
        name: "Slovakia",
        flag: "🇸🇰",
        code: "SK",
        dial_code: "+421"
        },
        {
        name: "Slovenia",
        flag: "🇸🇮",
        code: "SI",
        dial_code: "+386"
        },
        {
        name: "Solomon Islands",
        flag: "🇸🇧",
        code: "SB",
        dial_code: "+677"
        },
        {
        name: "Somalia",
        flag: "🇸🇴",
        code: "SO",
        dial_code: "+252"
        },
        {
        name: "South Africa",
        flag: "🇿🇦",
        code: "ZA",
        dial_code: "+27"
        },
        {
        name: "South Sudan",
        flag: "🇸🇸",
        code: "SS",
        dial_code: "+211"
        },
        {
        name: "South Georgia and the South Sandwich Islands",
        flag: "🇬🇸",
        code: "GS",
        dial_code: "+500"
        },
        {
        name: "Spain",
        flag: "🇪🇸",
        code: "ES",
        dial_code: "+34"
        },
        {
        name: "Sri Lanka",
        flag: "🇱🇰",
        code: "LK",
        dial_code: "+94"
        },
        {
        name: "Sudan",
        flag: "🇸🇩",
        code: "SD",
        dial_code: "+249"
        },
        {
        name: "Suriname",
        flag: "🇸🇷",
        code: "SR",
        dial_code: "+597"
        },
        {
        name: "Svalbard and Jan Mayen",
        flag: "🇸🇯",
        code: "SJ",
        dial_code: "+47"
        },
        {
        name: "Eswatini",
        flag: "🇸🇿",
        code: "SZ",
        dial_code: "+268"
        },
        {
        name: "Sweden",
        flag: "🇸🇪",
        code: "SE",
        dial_code: "+46"
        },
        {
        name: "Switzerland",
        flag: "🇨🇭",
        code: "CH",
        dial_code: "+41"
        },
        {
        name: "Syrian Arab Republic",
        flag: "🇸🇾",
        code: "SY",
        dial_code: "+963"
        },
        {
        name: "Taiwan",
        flag: "🇹🇼",
        code: "TW",
        dial_code: "+886"
        },
        {
        name: "Tajikistan",
        flag: "🇹🇯",
        code: "TJ",
        dial_code: "+992"
        },
        {
        name: "Tanzania, United Republic of Tanzania",
        flag: "🇹🇿",
        code: "TZ",
        dial_code: "+255"
        },
        {
        name: "Thailand",
        flag: "🇹🇭",
        code: "TH",
        dial_code: "+66"
        },
        {
        name: "Timor-Leste",
        flag: "🇹🇱",
        code: "TL",
        dial_code: "+670"
        },
        {
        name: "Togo",
        flag: "🇹🇬",
        code: "TG",
        dial_code: "+228"
        },
        {
        name: "Tokelau",
        flag: "🇹🇰",
        code: "TK",
        dial_code: "+690"
        },
        {
        name: "Tonga",
        flag: "🇹🇴",
        code: "TO",
        dial_code: "+676"
        },
        {
        name: "Trinidad and Tobago",
        flag: "🇹🇹",
        code: "TT",
        dial_code: "+1868"
        },
        {
        name: "Tunisia",
        flag: "🇹🇳",
        code: "TN",
        dial_code: "+216"
        },
        {
        name: "Turkey",
        flag: "🇹🇷",
        code: "TR",
        dial_code: "+90"
        },
        {
        name: "Turkmenistan",
        flag: "🇹🇲",
        code: "TM",
        dial_code: "+993"
        },
        {
        name: "Turks and Caicos Islands",
        flag: "🇹🇨",
        code: "TC",
        dial_code: "+1649"
        },
        {
        name: "Tuvalu",
        flag: "🇹🇻",
        code: "TV",
        dial_code: "+688"
        },
        {
        name: "Uganda",
        flag: "🇺🇬",
        code: "UG",
        dial_code: "+256"
        },
        {
        name: "Ukraine",
        flag: "🇺🇦",
        code: "UA",
        dial_code: "+380"
        },
        {
        name: "United Arab Emirates",
        flag: "🇦🇪",
        code: "AE",
        dial_code: "+971"
        },
        {
        name: "United Kingdom",
        flag: "🇬🇧",
        code: "GB",
        dial_code: "+44"
        },
        {
        name: "United States",
        flag: "🇺🇸",
        code: "US",
        dial_code: "+1"
        },
        {
        name: "Uruguay",
        flag: "🇺🇾",
        code: "UY",
        dial_code: "+598"
        },
        {
        name: "Uzbekistan",
        flag: "🇺🇿",
        code: "UZ",
        dial_code: "+998"
        },
        {
        name: "Vanuatu",
        flag: "🇻🇺",
        code: "VU",
        dial_code: "+678"
        },
        {
        name: "Venezuela, Bolivarian Republic of Venezuela",
        flag: "🇻🇪",
        code: "VE",
        dial_code: "+58"
        },
        {
        name: "Vietnam",
        flag: "🇻🇳",
        code: "VN",
        dial_code: "+84"
        },
        {
        name: "Virgin Islands, British",
        flag: "🇻🇬",
        code: "VG",
        dial_code: "+1284"
        },
        {
        name: "Virgin Islands, U.S.",
        flag: "🇻🇮",
        code: "VI",
        dial_code: "+1340"
        },
        {
        name: "Wallis and Futuna",
        flag: "🇼🇫",
        code: "WF",
        dial_code: "+681"
        },
        {
        name: "Yemen",
        flag: "🇾🇪",
        code: "YE",
        dial_code: "+967"
        },
        {
        name: "Zambia",
        flag: "🇿🇲",
        code: "ZM",
        dial_code: "+260"
        },
        {
        name: "Zimbabwe",
        flag: "🇿🇼",
        code: "ZW",
        dial_code: "+263"
        }
        ]

   
  
    

    

};

export default exportedMethods;