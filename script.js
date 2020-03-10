

const modalSignUp = document.querySelector("#divSignUp");
const btnSignUp = document.querySelector("#btnSignUp");
const btnCloseSignUp = document.querySelector("#btnCloseSignUp");

const modalSignIn = document.querySelector("#divSignIn");
const btnSignIn = document.querySelector("#btnSignIn");
const btnCloseSignIn = document.querySelector("#btnCloseSignIn");

const errSignUp = document.querySelector("#errSignUp");

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


document.getElementById("btnSubmitSignUp")
    .addEventListener("click", () => {
        signUp();
    });



function signUp() {


    let email = document.querySelector("input#signUpEmail").value;
    let pswrd = document.querySelector("input#signUpPwrd").value;
    let pswrdConf = document.querySelector("input#signUpPwrdConf").value;
    if(pswrd===pswrdConf) {
        firebase.auth().createUserWithEmailAndPassword(email, pswrd)
        .then(function() {
            toggleModal(modalSignUp);
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            //alert(errorMessage);
            errSignUp.textContent = error.message;

        });
     } else {
        errSignUp.textContent = "Passwords must match!";
    }

    

}



function toggleModal(modal) {
    modal.classList.toggle("show-modal");
};
