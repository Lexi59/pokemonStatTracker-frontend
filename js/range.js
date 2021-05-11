const API_URL = "https://pokemon-stat-tracker.herokuapp.com/";

document.querySelector('#eventForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    clearErrorMessages();
    const startDate = new Date(document.querySelector('#startDate').value);
    const endDate = new Date(document.querySelector('#endDate').value);
    const today = new Date();
    var error = false;

    if(startDate.getTime() > today.getTime()){
        logErrorMessage("Invalid Start Date in the Future")
        document.querySelector('#startDate').classList.add('is-invalid');
        error = true;
    }
    if(endDate.getTime() < startDate.getTime()){
        logErrorMessage("Event Ends Before Start Date");
        document.querySelector('#endDate').classList.add('is-invalid');
        error = true;
    }
    if(!error){
        //valid event date
        var event = {
            startDate: startDate,
            endDate: endDate
        };
        fetch(API_URL+'api/v1/records/event',{
            method: 'POST',
            body: JSON.stringify(event),
            headers: {
                'content-type':'application/json',
                authorization: 'Bearer ' + localStorage.token
            }
        }).then(res => res.json()).then(stats=>{
            if(stats){
                console.log(stats);
                document.querySelector('#eventStats').style.display = 'block';
                document.querySelector('#startDateOutput').textContent = 'Start Date: ' + startDate.toLocaleDateString();
                document.querySelector('#endDateOutput').textContent = 'End Date: ' + endDate.toLocaleDateString();
                document.querySelector('#XP').textContent = 'XP: ' + stats.XP;
                document.querySelector('#catches').textContent = 'Catches: ' + stats.catches;
                document.querySelector('#stardust').textContent = 'Stardust: ' + stats.stardust;
                document.querySelector('#kms').textContent = 'KMs: ' + stats.kms;
                document.querySelector('#luckyEggs').textContent =  'Lucky Eggs: ' + stats.luckyEggs;
            }
        }).catch((error)=>{
            error.text().then(msg =>{
                logErrorMessage(JSON.parse(msg).message);
                console.error(JSON.parse(msg).message);
            });
        });
    }
});

function logErrorMessage(msg){
    var div = document.createElement('div');
    div.innerHTML = `<div class="alert alert-danger">`+msg+`</div>`;
    document.querySelector('#error').appendChild(div);
}
function clearErrorMessages(){
    document.querySelector('#error').innerHTML="";
    document.querySelector('#startDate').classList.remove('is-invalid');
    document.querySelector('#endDate').classList.remove('is-invalid');
}