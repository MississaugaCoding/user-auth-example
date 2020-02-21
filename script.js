const modalSignUp = document.querySelector("#divSignUp");
const btnSignUp = document.querySelector("#btnSignUp");
const btnCloseSignUp = document.querySelector("#btnCloseSignUp");

const errSignUp = document.querySelector("#errSignUp");
const errSignIn = document.querySelector("#errSignIn");

const modalSignIn = document.querySelector("#divSignIn");
const btnSignIn = document.querySelector("#btnSignIn");
const btnCloseSignIn = document.querySelector("#btnCloseSignIn");

const btnSignOut = document.querySelector("#btnSignOut");
const divMsg = document.querySelector("#divMsg");

const list = document.getElementById("list");

const modalAddItem = document.querySelector("#divAddItem");
const btnAddItem = document.querySelector("#btnAddItem");
const btnCloseAddItem = document.querySelector("#btnCloseAddItem");



btnSignOut.addEventListener("click", () => {
  signOut();
});

btnSignUp.addEventListener("click", () => {
  toggleModal(modalSignUp);
});

btnCloseSignUp.addEventListener("click", () => {
  toggleModal(modalSignUp);
});

btnSignIn.addEventListener("click", () => {
  toggleModal(modalSignIn);
});

btnCloseSignIn.addEventListener("click", () => {
  toggleModal(modalSignIn);
});

document.getElementById("btnSubmitSignUp").addEventListener("click", () => {
  signUp();
});

document.getElementById("btnSubmitSignIn").addEventListener("click", () => {
  signIn();
});

btnAddItem.addEventListener("click", function(){
  toggleModal(modalAddItem);
});
btnCloseAddItem.addEventListener("click", function(){
  toggleModal(modalAddItem);
});

document.getElementById("btnSubmitAddItem").addEventListener("click", () => {
  saveData();
});



function signUp() {
  let email = document.querySelector("input#signUpEmail").value;
  let pswrd = document.querySelector("input#signUpPwrd").value;
  let pswrdConf = document.querySelector("input#signUpPwrdConf").value;

  if (pswrd === pswrdConf) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pswrd)
      .then(function() {
        toggleModal(modalSignUp);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //alert(errorMessage);
        errSignUp.textContent = error.message;
      });
  } else {
    errSignUp.textContent = "Passwords must match!";
  }
}

function signIn() {
  let email = document.querySelector("input#signInEmail").value;
  let pswrd = document.querySelector("input#signInPwrd").value;
  if (email !== "" && pswrd !== "") {
    firebase.auth().signInWithEmailAndPassword(email, pswrd)
    .then(function() {
      toggleModal(modalSignIn);
    })
    .catch(function(error) {
      errSignIn.textContent = error.message;
    });
  } else {
    errSignIn.textContent = "Must enter email and password!";
  }
}

function toggleModal(modal) {
  modal.classList.toggle("show-modal");
}

firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // User is signed in.
    divMsg.textContent = `You are signed in as ${user.email}`;
    await readData(user.uid);
  } else {
    // User is signed out.
    divMsg.textContent = "You are signed out";
    // clear item list and item count
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    document.getElementById('itemCount').textContent = '';
    document.getElementById('btnAddItem').className = '';

  }

  // clear all inputs
  let inputs = document.querySelectorAll("input");
  [...inputs].forEach(input => {
    input.value = "";
  });
});

function signOut() {
  // straight from docs
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
}

async function readData(uid) {
  let result = await db.collection("dataItems").where("userId", "==", uid).get();
  document.getElementById('itemCount').textContent = `Found ${result.size} item(s)`;
  document.getElementById('btnAddItem').classList.toggle('show-button');
  result.forEach(doc => {        
      //alert(doc.data().itemText);
      list.appendChild( buildListItem(doc.data()) ); 
  }); 
}

function buildListItem(rec) {
  let li = document.createElement("li");
  li.textContent = rec.itemText;
  return li;    
}

async function saveData() {
  let itemText = document.querySelector("input#itemText").value;

  if(itemText) {
    let user = firebase.auth().currentUser;

    if (user) {    
      await db.collection("dataItems").add({
        userId: user.uid,
        itemText
      });    
      toggleModal(modalAddItem);
      
      // clear item list 
      while (list.firstChild) {
          list.removeChild(list.firstChild);
      }

      await readData(user.uid);
      document.getElementById('btnAddItem').classList.toggle('show-button');
      
    } else {
      msg.textContent = `You must first sign up / sign in!`;
    }

  } else {
    errAddItem.textContent = 'Item is blank!';
  }
  
}

