const username = document.getElementById('username'); 
const password = document.getElementById('password'); 
const letInBtn = document.getElementById('authBtn'); 
const switchBtn = document.getElementById('switch'); 
const confirmField  = document.getElementById('confirm');
const confirmPassword = document.getElementById('confirm-password');


class Auth{
    constructor(username, password){
        this.username = username; 
        this.password = password; 
        this.state = 'Login'; 
    }
    changeState(){
        if(this.state === 'Login'){
            this.state = 'Sign Up'
            switchBtn.innerHTML = 'Login'
            confirmField.style = 'display: block'
            letInBtn.innerText = 'Sign Up'
        } else {
            this.state = 'Login'
            switchBtn.innerHTML = 'Sign Up'
            confirmField.style = 'display: none'
            letInBtn.innerText = 'Login'
        }
    }
    
    register(){
        const passwordValue = password.value;
        const usernameValue = username.value; 
        const confirmPasswordValue = confirmPassword.value; 
        if (usernameValue.length && passwordValue.length && confirmPasswordValue === passwordValue){
          fetch(`${window.location.origin}/auth/register`, {
             method: 'POST',
             headers: {
                    'Content-Type': 'application/json',
                    },
            body: JSON.stringify({
                username : usernameValue,
                password: passwordValue
            })
            })
             .then((response) => response.json())
             //Then with the data from the response in JSON...
             .then((data) => {
             this.setLocalStorage({token : data.token, user: data.user.username, favorites : data.user.favorites }); 
             window.location.replace(`${window.location.origin}`);
            })
             //Then with the error genereted...
            .catch((error) => {
            console.error('Error:', error);
          });
        }
    }

    login(){
        const passwordValue = password.value;
        const usernameValue = username.value; 
        if (usernameValue.length && passwordValue.length){
             fetch(`${window.location.origin}/auth/login`, {
             method: 'POST',
             headers: {
                    'Content-Type': 'application/json',
                    },
            body: JSON.stringify({
                username : usernameValue,
                password: passwordValue
            })
            })
             .then((response) => response.json())
             //Then with the data from the response in JSON...
             .then((data) => {
                 console.log(data)
             this.setLocalStorage({token : data.token, user: data.username, favorites : data.favorites }); 
             window.location.replace(`${window.location.origin}`)
             
            })
             //Then with the error genereted...
            .catch((error) => {
            console.error('Error:', error);
          });
        }
    }

    postData(){
        if (this.state === 'Sign Up'){
            this.register(); 
        }else if (this.state === 'Login') {
           this.login();
        }
   }

   onSwitch(){
    switchBtn.addEventListener('click', ()=>{
        this.changeState(); 
    });
   }

   onEntryAttempt(){
    letInBtn.addEventListener('click', ()=>{
        this.postData(); 
    }) 
   }

   setLocalStorage(data){
       window.localStorage.setItem('user', JSON.stringify(data)); 
   }
}


const authorize = new Auth(username, password, switchBtn);
authorize.onSwitch();
authorize.onEntryAttempt(); 
