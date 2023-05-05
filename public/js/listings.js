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