document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let errorDiv = document.getElementById("error");

    try {
        

        errorDiv.hidden = true;
        errorDiv.innerHTML = '';
    
        let commentInput = document.getElementById('commentInput');
        console.log("Comment", commentInput.value);
        let comment = checkEmptyInputString(commentInput.value, "Comment Section");
        comment = comment.trim();
        isValidComment(comment);

        const listingId = document.getElementById('listingIdInput').value;
        const userId = document.getElementById('userIdInput').value;
        const scoutId = document.getElementById('scoutIdInput').value;
        let messengerTypeInput = document.getElementById('messengerTypeInput');
        let messengerType = messengerTypeInput.value;

        if(!messengerType){
            throw `Error! Your user Session has expired, please try logging!`;
        }else if(!messengerType.trim()){
            throw `Error! Your user Session has expired, please try logging!`;
        }

        messengerTypeInput.value = messengerType

        commentInput.value = comment

        let message = {
            listingId: listingId,
            userId: userId,
            scoutId: scoutId,
            comment: commentInput.value,
            messengerType: messengerTypeInput.value
        }

        console.log("hmm", message);

        if(messengerType.toLowerCase().trim() === "primary"){
            console.log("#############################");
            fetch('/primaryComment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  comment: comment,
                  listingId: listingId,
                  userId: userId,
                  scoutId: scoutId,
                  messengerType: messengerType
                })
              })
                .then((response) => {
                  if (response.ok) {
                    console.log("Response Ok is recieved for primary message!");
                    //I will just reload if the response i got from my route is response.ok
                    window.location.reload();
                  } else {
                    throw `Error posting primary message`;
                  }
                })
                .catch((error) => {
                  errorDiv.hidden = false;
                  errorDiv.innerHTML = error;
                  commentInput.focus();
                  commentInput.className = "inputClass";
                });
              
        }else{
            console.log("#############################");
            fetch('/scoutComment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  comment: comment,
                  listingId: listingId,
                  userId: userId,
                  scoutId: scoutId,
                  messengerType: messengerType
                })
              })
                .then((response) => {
                  if (response.ok) {
                    console.log("Response Ok for scout message!");
                    //I will just reload if the response is ok
                    window.location.reload();
                  } else {
                    throw `Error posting scout message`;
                  }
                })
                .catch((error) => {
                  errorDiv.hidden = false;
                  errorDiv.innerHTML = error;
                  commentInput.focus();
                  commentInput.className = "inputClass";
                });
              

        }
    } catch (error) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = error;
        commentInput.focus();
        commentInput.className = "inputClass";
    }


  });

  function getCharCount() {
    const textarea = document.getElementById('commentInput');
    const charCount = document.getElementById('charCount');
    //I am removing any leading and trailing whitespaces so that sesries of empty spaces won't be counted as charecters!
    const remainingChars = 500 - textarea.value.trim().length;
    charCount.textContent = remainingChars;
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

function isValidComment(comment){
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
  }