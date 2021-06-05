// add clear form button

document.querySelector('#date').value = new Date().toISOString().split('T')[0];

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
            window.location.replace('../pages/login.html');
        }
    });
}
function editEntry(date){
    fetch(API_URL+'api/v1/records',{
        headers: {
            'content-type':'application/json',
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res => res.json()).then(records=>{
        for(var i = 0; i < records.length; i++){
            if(records[i].date == date){
                document.querySelector('#date').value = new Date(date).toISOString().split('T')[0];
                document.querySelector('#totalOrNew').value = 'Yes';
                document.querySelector('#XP').value = records[i].XP;
                document.querySelector('#catches').value = records[i].catches;
                document.querySelector('#stardust').value = records[i].stardust;
                document.querySelector('#kms').value = records[i].kms;
                document.querySelector('#luckyEggs').value = records[i].luckyEggs;
                document.querySelector('#comment').value = records[i].comment;
            }
        }
    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
    });
}
function deleteEntry(date){
    if(confirm("You are deleting the record from " + new Date(date).toLocaleDateString() + ". Are you sure? This action cannot be undone.")){
        var remove = true;
        fetch(API_URL+'api/v1/records/remove',{
            method: 'POST',
            body: JSON.stringify({date}),
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
}

document.querySelector('#recordForm').addEventListener('reset',(e)=>{
    e.preventDefault();
    document.querySelector('#date').value = new Date().toISOString().split('T')[0];
    document.querySelector('#totalOrNew').value = 'Yes';
    document.querySelector('#XP').value = "";
    document.querySelector('#catches').value = "";
    document.querySelector('#stardust').value = "";
    document.querySelector('#kms').value = "";
    document.querySelector('#luckyEggs').value = 0;
    document.querySelector('#comment').value = "";
});

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
    if(totals){
        document.getElementById('totals').classList.add('btn-primary');
        document.getElementById('daily').classList.remove('btn-primary');
    }
    else{
        document.getElementById('totals').classList.remove('btn-primary');
        document.getElementById('daily').classList.add('btn-primary');
    }
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
            if(totals){
                row.innerHTML = `<td>`+new Date(records[i].date).toLocaleDateString()+`</td>`+
                `<td>`+records[i].XP+`</td>`+
                `<td>`+records[i].catches+`</td>`+
                `<td>`+records[i].stardust+`</td>`+
                `<td>`+parseFloat(records[i].kms).toFixed(1)+`</td>`+
                `<td>`+records[i].luckyEggs+`</td>`;
            }
            else{
                if(i<records.length-1){
                    row.innerHTML = `<td>`+new Date(records[i].date).toLocaleDateString()+`</td>`+
                    `<td>`+(records[i].XP-records[i+1].XP)+`</td>`+
                    `<td>`+(records[i].catches-records[i+1].catches)+`</td>`+
                    `<td>`+(records[i].stardust-records[i+1].stardust)+`</td>`+
                    `<td>`+(parseFloat(records[i].kms).toFixed(1)-parseFloat(records[i+1].kms).toFixed(1)).toFixed(1)+`</td>`+
                    `<td>`+records[i].luckyEggs+`</td>`;
                }
            }
            if(totals || (!totals && i < records.length-1)){
                if(records[i].comment){
                    row.innerHTML+=`<td>`+records[i].comment+`</td>`;
                }
                else{row.innerHTML += `<td></td>`;}
                document.querySelector('#recordCards tbody').appendChild(row);
                row.innerHTML += `<td><button class="btn btn-success my-2 my-sm-0 ml-auto table-buttons" onclick='editEntry("`+records[i].date+`")'>✏️</button><button class="btn btn-danger my-2 my-sm-0 ml-auto table-buttons" onclick='deleteEntry("`+records[i].date+`")'>🗑️</button></td>`;
            }
        }
    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
    });
}

