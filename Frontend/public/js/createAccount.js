import { isValidEmail,isValidPassword,
    validateUsernameAndPassword} from '../../userAccount.js';



//retrieve all the values of the fields in the signup form
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const confirmPassword = document.getElementById('confirm-password').value;
const firstname = document.getElementById('first-name').value;
const lastname = document.getElementById('last-name').value;
const submitButton = document.getElementById('submit');


submitButton.addEventListener('click',()=>{
    //validateEmail
    if(isValidEmail(email) && validateUsernameAndPassword(firstname,lastname,password,confirmPassword) ){
        alert("Sign up successful")
    }
    else{
        alert("Check for some problems")
    }
})



