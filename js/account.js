function checkUsername(){
    fetch(API_URL, {
        headers:{
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res =>res.json())
    .then((result)=>{
        if(result.user){
            document.querySelector('#username').value = result.user.username;
        }
        else{
            localStorage.removeItem('token');
            window.location.replace('../pages/login.html');
        }
    });
}

document.querySelector('#accountForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(e.submitter.id == 'changePassBtn'){
        var elems = document.querySelectorAll(".hidden");

        [].forEach.call(elems, function(el) {
            el.classList.remove("hidden");
        });
    
        document.querySelector('#changePassBtn').classList.add('hidden');
    }
    else{
        clearErrorMessages();
        //submit new password
        const username = document.querySelector('#username').value.trim();
        const newPassword = document.querySelector('#newPassword').value.trim();
        const password = document.querySelector('#password').value.trim();
        const confirmPassword = document.querySelector('#confirmNewPassword').value.trim();
        var error = false;
        
        if(newPassword != confirmPassword){
            logErrorMessage("Passwords must match");
            document.querySelector('#newPassword').classList.add('is-invalid');
            document.querySelector('#confirmNewPassword').classList.add('is-invalid');
            error = true;
        }
        if(newPassword.length < 6){
            logErrorMessage("Invalid Password");
            document.querySelector('#newPassword').classList.add('is-invalid');
            error = true;
        }
        if(!error){
            //valid user account
            var user = {
                username,
                password,
                newPassword
            };
            fetch(API_URL+'auth/updateUser',{
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'content-type':'application/json'
                }
            }).then((response) => {
                if(response.ok){return response.json();}
                    throw response;
            }).then((result)=>{
                localStorage.token = result.token;
                window.location.replace("../pages/dashboard.html");
            }).catch((error)=>{
                error.text().then(msg =>{
                    logErrorMessage(JSON.parse(msg).message);
                    console.error(JSON.parse(msg).message);
                });
            });
        }
    }

});

function logErrorMessage(msg){
    var div = document.createElement('div');
    div.innerHTML = `<div class="alert alert-danger">`+msg+`</div>`;
    document.querySelector('#error').appendChild(div);
}
function clearErrorMessages(){
    document.querySelector('#error').innerHTML="";
}