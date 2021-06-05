var currentLevel;

function checkUsername(){
    fetch(API_URL, {
        headers:{
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res =>res.json())
    .then((result)=>{
        if(result.user){
            document.querySelector('#username').value = result.user.username;
            checkForStats();
        }
        else{
            localStorage.removeItem('token');
            window.location.replace('../pages/login.html');
        }
    });
}

function checkForStats(){
    fetch(API_URL+'api/v1/records/stats',{
        headers: {
            'content-type':'application/json',
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res => res.json()).then(stats=>{
        if(stats){
            currentLevel = getLevel(stats.XP);
            if(currentLevel>40){
                document.querySelector('#levelForm').classList.remove('hidden');
            }

        }
    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
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

document.querySelector('#levelForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    clearErrorMessages();
    var otherLevel = parseInt(document.querySelector('#otherLevel').value);
    var autoCalc = document.querySelector('#autocalculate').checked;
    if(autoCalc){
        var user = {
            username: document.querySelector('#username').value.trim()
        };
        fetch(API_URL+'auth/removeLevel',{
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-type':'application/json'
            }
        }).then((response) => {
            if(response.ok){return response.json();}
                throw response;
        }).catch((error)=>{
            error.text().then(msg =>{
                logErrorMessage(JSON.parse(msg).message, true);
                console.error(JSON.parse(msg).message);
            });
        });
    }
    else if(currentLevel){
        if(otherLevel > currentLevel || otherLevel> 50){
            logErrorMessage('Invalid level', true);
        }
        else{
            var user = {
                username: document.querySelector('#username').value.trim(),
                level:otherLevel
            };
            fetch(API_URL+'auth/addLevel',{
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'content-type':'application/json'
                }
            }).then((response) => {
                if(response.ok){return response.json();}
                    throw response;
            }).catch((error)=>{
                error.text().then(msg =>{
                    logErrorMessage(JSON.parse(msg).message, true);
                    console.error(JSON.parse(msg).message);
                });
            });
        }
    }
    window.location.replace('dashboard.html');
})

function logErrorMessage(msg, levelError = false){
    var div = document.createElement('div');
    div.innerHTML = `<div class="alert alert-danger">`+msg+`</div>`;
    if(levelError){document.querySelector('#LevelError').appendChild(div);}
    else{document.querySelector('#error').appendChild(div);}
}
function clearErrorMessages(){
    document.querySelector('#error').innerHTML="";
}
const xpValues = [1000,3000,6000,10000,15000,21000,28000,36000,45000,55000,65000,
    75000,85000,100000,120000,140000,160000,185000,210000,260000,335000,435000,
    560000,710000,900000,1100000,1350000,1650000,2000000,2500000,3000000,3750000,
    4750000,6000000,7500000,9500000,12000000,15000000,20000000,26000000,33500000,
    42500000,53500000,66500000,82000000,100000000,121000000,146000000,176000000];

function getLevel(XP){
    if(XP<xpValues[0]){return "1";}
    for(var i =0; i < xpValues.length-1; i++){
        if(XP>=xpValues[i] && XP < xpValues[i+1]){
            return (i+2).toString();
        }
    }
    if(XP>=xpValues[xpValues.length-1]){return "50";}
}