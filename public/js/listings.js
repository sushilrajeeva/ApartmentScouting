document.querySelectorAll('.edit-btn').forEach(editBtn => {
  editBtn.addEventListener('click', () => {
    const cardContent = editBtn.closest('.listing-card').querySelector('.card-content');
    cardContent.contentEditable = 'true';
    editBtn.style.display = 'none';
    editBtn.nextElementSibling.style.display = 'block';
  });
});

document.querySelectorAll('.save-btn').forEach(saveBtn => {
  saveBtn.addEventListener('click', async () => {
    const cardContent = saveBtn.closest('.listing-card').querySelector('.card-content');
    cardContent.contentEditable = 'false';
    saveBtn.style.display = 'none';
    saveBtn.previousElementSibling.style.display = 'block';

    const listingId = cardContent.dataset.listingId;
    // Gather the updated information from the card
    const updatedData = {
      listingNameInput: cardContent.querySelector('.listing-name').textContent,
      listingLinkInput: cardContent.querySelector('.listing-link a').href,
      streetInput: cardContent.querySelector('.listing-address').textContent.replace('Street: ', ''),
      cityInput: cardContent.querySelector('.listing-city').textContent.replace('City: ', ''),
      stateInput: cardContent.querySelector('.listing-state').textContent.replace('State: ', ''),
      countryInput: cardContent.querySelector('.listing-country').textContent.replace('Country: ', ''),
      pincodeInput: cardContent.querySelector('.listing-pincode').textContent.replace('Pincode: ', ''),
      rentInput: cardContent.querySelector('.listing-rent').textContent.replace('Rent: ', ''),
      additionalInfoInput: cardContent.querySelector('.listing-additionalInfo').textContent.replace('Additional Info: ', ''),
      agentNumberInput: cardContent.querySelector('.listing-agent').textContent.replace('Agent Number: ', ''),
      ownerNumberInput: cardContent.querySelector('.listing-owner').textContent.replace('Owner Number: ', ''),
      rewardInput: cardContent.querySelector('.listing-reward').textContent.replace('Reward: ', ''),
    };

    try {
      // Send the updated information to the server using AJAX
      const response = await fetch(`/updateListing/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        console.log('Listing updated successfully');
        alert("Listing Updated Successfully");
      } else {
        console.error('Error updating listing');
        alert("Error updating listing")
      }
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  });
});


// document.addEventListener('DOMContentLoaded', () => {

//   // referred https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll 
//   const openListingButtons = document.querySelectorAll('.OpenListingButton');

//   openListingButtons.forEach((button) => {
//     button.addEventListener('click', (event) => {
//       // to find the closest parent with class = 'listing-card' from the button click event.
//       const listingCard = event.target.closest('.listing-card');
//       //to get the value of data from attribute 'data-listings'
//       const listingsJSON = listingCard.getAttribute('data-listings');
//       // reference ->  https://www.freecodecamp.org/news/javascript-url-encode-example-how-to-use-encodeuricomponent-and-encodeuri/
//       // reference -> https://stackoverflow.com/questions/30654556/encodeuricomponent-not-working-with-array

//       console.log("Checking if listingjson is loaded", listingsJSON);

//       const listingsJSONString = encodeURIComponent(listingsJSON);

//       console.log("****************");
//       console.log("CHECKING IF ENCODER URI COMPOENENT IS PROPER ", listingsJSONString);
//       // the data will be passed to the below route
//       window.location.href = `/trackListing?listings=${listingsJSONString}`;
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
  // Add an event listener for all buttons with the 'OpenListingButton' class
  document.querySelectorAll('.OpenListingButton').forEach(function(button) {
    button.addEventListener('click', function(event) {
      // Prevent the default action for the button click
      event.preventDefault();
      
      // Get the parent element with the 'card-content' class and extract the '_id' attribute
      let listingId = event.target.closest('.card-content').getAttribute('data-listing-id');
      
      // Navigate to the '/trackListing' route with the '_id' as a query parameter
      window.location.href = `/trackListing?id=${listingId}`;
    });
  });
});


