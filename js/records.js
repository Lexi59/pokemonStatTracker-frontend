const API_URL = "https://pokemon-stat-tracker.herokuapp.com/";

document.querySelector('#date').value = new Date().toLocaleDateString("en-US");

function checkUsername(){
    fetch(API_URL, {
        headers:{
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res =>res.json())
    .then((result)=>{
        if(result.user){
            getRecords();
            document.querySelector('#welcome').textContent = "Welcome " + result.user.username + "!";
        }
        else{
            localStorage.removeItem('token');
            window.location.href('../pages/login.html');
        }
    });
}

document.querySelector('#recordForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    clearErrorMessages();
    const date = new Date(document.querySelector('#date').value.trim());
    const totals = document.querySelector('#totalOrNew').value=='Yes';
    const XP = parseInt(document.querySelector('#XP').value.trim());
    const catches = parseInt(document.querySelector('#catches').value.trim());
    const stardust = parseInt(document.querySelector('#stardust').value.trim());
    const kms = document.querySelector('#kms').value.trim();
    const luckyEggs = parseInt(document.querySelector('#luckyEggs').value.trim());
    const comment = document.querySelector('#comment').value.trim();
    var error = false;
    
    if(!date.getTime() || date.getTime() > new Date().getTime()){
        logErrorMessage("Invalid Date");
        error = true;
    }
    if(Number.isNaN(XP) || XP < 0 || Number.isNaN(catches) || catches < 0 || Number.isNaN(stardust) || stardust < 0 || Number.isNaN(kms) || kms < 0 || Number.isNaN(luckyEggs) || luckyEggs < 0){
        logErrorMessage("Make sure XP, Catches, Stardust, KMs, and lucky eggs are numeric");
        error = true;
    }
    if(!error){
        var record = {
            date,
            totals,
            XP,
            catches, 
            stardust,
            kms,
            luckyEggs,
            comment
        };
        fetch(API_URL+'api/v1/records',{
            method: 'POST',
            body: JSON.stringify(record),
            headers: {
                'content-type':'application/json',
                authorization: 'Bearer ' + localStorage.token
            }
        }).then((response) => {
            if(response.ok){ 
                getRecords(); 
                document.querySelector('#XP').value = '';
                document.querySelector('#catches').value = '';
                document.querySelector('#stardust').value = '';
                document.querySelector('#kms').value = '';
                document.querySelector('#luckyEggs').value = '0';
                document.querySelector('#comment').value = '';
                return response.json();
            }
            throw response;
            })
            .then(res => {res.json();})
            .catch((error)=>{
                error.text().then(msg =>{
                    logErrorMessage(JSON.parse(msg).message);
                    console.error(JSON.parse(msg).message);
                });
        });
        
    }
    
})

function logErrorMessage(msg){
    var div = document.createElement('div');
    div.innerHTML = `<div class="alert alert-danger">`+msg+`</div>`;
    document.querySelector('#error').appendChild(div);
}
function clearErrorMessages(){
    document.querySelector('#error').innerHTML="";
}

function getRecords(){
    clearErrorMessages();
    fetch(API_URL+'api/v1/records',{
        headers: {
            'content-type':'application/json',
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res => res.json()).then(records=>{
        document.querySelector("#recordCards tbody").innerHTML = ""; 

        for(var i = 0; i < records.length; i++){
            var row = document.createElement('tr');
            row.innerHTML = `<td>`+new Date(records[i].date).toDateString()+`</td>`+
                        `<td>`+records[i].XP+`</td>`+
                        `<td>`+records[i].catches+`</td>`+
                        `<td>`+records[i].stardust+`</td>`+
                        `<td>`+records[i].kms+`</td>`+
                        `<td>`+records[i].luckyEggs+`</td>`;
                        
            if(records[i].comment){
                row.innerHTML+=`<td>`+records[i].comment+`</td>`;
            }
            document.querySelector('#recordCards tbody').appendChild(row);
        }
    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
    });
}