//Writing this function to trigger the route '/addmoney'
document.addEventListener('DOMContentLoaded', function () {
    console.log("Add money event listener is triggered!");
    const addMoneyButton = document.getElementById('addMoneyButton');
  
    if (addMoneyButton) {
      addMoneyButton.addEventListener('click', function () {
        window.location.href = '/addmoney';
      });
    }
  });

let paymentForm = document.getElementById("paymentForm");
  
  if(paymentForm){
    paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let errorDiv = document.getElementById('error');
      
    try {
        errorDiv.hidden = true;
        errorDiv.innerHTML = '';
        let cardNumberInput = document.getElementById("cardNumberInput");
        let cardNumber = checkEmptyInputString(cardNumberInput.value, "Card Number");
        let cvvInput = document.getElementById("cvvInput");
        let cvv = checkEmptyInputString(cvvInput.value, "CVV");
        let amountInput = document.getElementById("amountInput");
        let amount = checkEmptyInputString(amountInput.value, "Amount")

        isValidCardNumber(cardNumber);
        isValidCVV(cvv);
        isValidAmount(amount);
        } catch (error) {
            console.log("Error -> ", error);
            errorDiv.hidden = false;
            errorDiv.innerHTML = error;
            cardNumberInput.focus();
            cardNumberInput.className = "inputClass";
        }


        event.target.submit();
    
      });
  }

  function checkEmptyInputString(str, type){
    
    if(!str){
        throw `${type} can't be empty!`
    }else if(typeof str !== 'string'){
        throw `${type} should be a string`
    }else if(str.trim() === ""){
        throw `${type} can't be empty spaces, must be a valid string input`
    }
    return str.trim()
}

function isValidCardNumber(cardNumber){
    // reffered -> https://www.regextester.com/104911 
    let cardNumberRegex = /(^\d{15}$)|(^\d{16}$)/;

    if(!cardNumberRegex.test(cardNumber)){
        throw `The Card Number ${cardNumber} you entered is invalid! Please Enter a 15 or 16 digit number only!`
    }

}

function isValidCVV(cvv){
    // reffered -> https://www.regextester.com/104911 
    let cvvRegex = /(^\d{3}$)|(^\d{4}$)/;

    if(!cvvRegex.test(cvv)){
        throw `The CVV ${cvv} you entered is invalid! Please Enter a valid 3 or 4 digit number only!`
    }

}

function isValidAmount(amount){
    let amountRegex = /^([1-9]\d{0,3}|10000)$/;

    if(!amountRegex.test(amount)){
        throw `The amount ${amount} you entered is invalid! Please enter a valid amount from 1 to 10000 USD`
    }
}

  
  
  