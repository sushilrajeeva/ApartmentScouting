document.addEventListener('DOMContentLoaded', function () {
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    
    subscribeBtns.forEach(btn => {
      btn.addEventListener('click', async function () {
        const cardContent = btn.closest('.card-content');
        const listingID = cardContent.getAttribute('data-listing-id');
        const response = await fetch(`/subscribelisting/${listingID}`, { method: 'POST' });

        if (response.ok) {
          
          const successMsg = cardContent.querySelector('.success-msg');
          successMsg.style.display = 'block';
          btn.style.display = 'none';
        } else {
          alert('Failed to subscribe');
        }
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const unsubscribeBtns = document.querySelectorAll('.unsubscribe-btn');

    //  Subscribe button logic
    subscribeBtns.forEach(btn => {
      btn.addEventListener('click', async function () {
        const cardContent = btn.closest('.card-content');
        const listingId = cardContent.getAttribute('data-listing-id');
        const response = await fetch(`/subscribelisting/${listingId}`, { method: 'POST' });

        if (response.ok) {
        // writing this logic to display the success message and hide the Subscribe button and display the subscribed message and also unsubscribe button
          const successMsg = cardContent.querySelector('.success-msg');
          const unsubscribeBtn = cardContent.querySelector('.unsubscribe-btn');
          successMsg.style.display = 'block';
          btn.style.display = 'none';
          unsubscribeBtn.style.display = 'inline-block';
        } else {
          console.error('Failed to subscribe');
        }
      });
    });

    // unsubscribe button logic
    unsubscribeBtns.forEach(btn => {
      btn.addEventListener('click', async function () {
        const cardContent = btn.closest('.card-content');
        const listingId = cardContent.getAttribute('data-listing-id');
        const response = await fetch(`/unsubscribelisting/${listingId}`, { method: 'POST' });

        if (response.ok) {
            //writing this logic to display subscribe button and hide unsubscribe butotn and subscribed message
          const successMsg = cardContent.querySelector('.success-msg');
          const subscribeBtn = cardContent.querySelector('.subscribe-btn');
          successMsg.style.display = 'none';
          btn.style.display = 'none';
          subscribeBtn.style.display = 'inline-block';
        } else {
          console.error('Failed to unsubscribe');
        }
      });
    });
  });