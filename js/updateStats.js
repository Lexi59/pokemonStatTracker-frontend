const API_URL = "https://pokemon-stat-tracker.herokuapp.com/";
var user;

function checkUsername(){
    fetch(API_URL, {
        headers:{
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res =>res.json())
    .then((result)=>{
        if(result.user){
            user = result.user
        }
        else{
            localStorage.removeItem('token');
            window.location.replace('../pages/login.html');
        }
    });
}

document.querySelector('#statForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    clearErrorMessages();
    const XP = parseInt(document.querySelector('#XP').value.trim());
    const catches = parseInt(document.querySelector('#catches').value.trim());
    const kms = parseInt(document.querySelector('#kms').value.trim());
    var error = false;

    if(Number.isNaN(XP) || XP < 0 || Number.isNaN(catches) || catches < 0  || Number.isNaN(kms) || kms < 0 ){
        logErrorMessage("Make sure XP, Catches, Stardust, and KMs are numeric");
        error = true;
    }
    if(!error){
        var stats = {
            userId: user._id,
            totalXP: XP,
            totalCatches: catches, 
            totalKMs: kms,
        };
        fetch(API_URL+'auth/stats',{
            method: 'POST',
            body: JSON.stringify(stats),
            headers: {
                'content-type':'application/json',
                authorization: 'Bearer ' + localStorage.token
            }
        }).then(res => res.json())
            .then((updatedUser)=>{
        });
        document.querySelector('#XP').value = '';
        document.querySelector('#catches').value = '';
        document.querySelector('#kms').value = '';
        window.location.replace('dashboard.html');
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