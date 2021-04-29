const API_URL = "https://pokemon-stat-tracker.herokuapp.com/";
var user;
var myStats; 
const xpValues = [1000,3000,6000,10000,15000,21000,28000,36000,45000,55000,65000,
    75000,85000,100000,120000,140000,160000,185000,210000,260000,335000,435000,
    560000,710000,900000,1100000,1350000,1650000,2000000,2500000,3000000,3750000,
    4750000,6000000,7500000,9500000,12000000,15000000,20000000,26000000,33500000,
    42500000,53500000,66500000,82000000,100000000,121000000,146000000,176000000];

function checkUsername(){
    fetch(API_URL, {
        headers:{
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res =>res.json())
    .then((result)=>{
        if(result.user){
            user = result.user
            checkForStats();
            getCalculatedStats();
            loadChart();
            document.querySelector('#welcome').textContent = "Welcome " + user.username + "!";
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
            document.querySelector('#overallStats').style.display = 'block';
            var card = document.querySelector('#overallStatCard');
            card.appendChild(createCardPiece('<strong>Level:</strong>  '+getLevel(stats.XP)));
            card.appendChild(createCardPiece('<strong>Total XP:</strong>  ' + stats.XP));
            card.appendChild(createCardPiece('<strong>Total Catches:</strong>  ' + stats.catches));
            card.appendChild(createCardPiece('<strong>Total KMs:</strong>  ' + stats.kms));

        }
    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
    });
}
function createCardPiece(text){
    var p = document.createElement('p');
    p.class = 'card-text';
    p.innerHTML = text;
    return p;
}
function getCalculatedStats(){
    fetch(API_URL+'api/v1/records/data',{
        headers: {
            'content-type':'application/json',
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res => res.json()).then(calculatedStats=>{
        
        document.querySelector('#levelUpDate').innerHTML = '<strong>Predicted Level Up:</strong> ' + getDaysToLevelUp(calculatedStats.totalXP,calculatedStats.XPWeek/7);

        var card = document.querySelector('#personalBestsCard');
        card.appendChild(createCardPiece('<strong>Most XP:</strong>  '+ calculatedStats.mostXP));
        card.appendChild(createCardPiece('<strong> on </strong>  ' + new Date(calculatedStats.mostXPDay).toLocaleDateString()));
        if(calculatedStats.mostXPComments){
            card.appendChild(createCardPiece('<strong>Comments: </strong>  ' + calculatedStats.mostXPComments));
        }
        card.appendChild(createCardPiece('<strong>Most Catches:</strong>  '+ calculatedStats.mostCatches));
        card.appendChild(createCardPiece('<strong> on </strong>  ' + new Date(calculatedStats.mostCatchesDay).toLocaleDateString()));
        if(calculatedStats.mostCatchesComments){
            card.appendChild(createCardPiece('<strong>Comments: </strong>  ' + calculatedStats.mostCatchesComments));
        }

        var card = document.querySelector('#thisWeekCard');
        card.appendChild(createCardPiece('<strong>XP:</strong>  ' + calculatedStats.XPWeek));
        card.appendChild(createCardPiece('<strong>Catches:</strong>  ' + calculatedStats.catchesWeek));
        card.appendChild(createCardPiece('<strong>KMs:</strong>  ' + calculatedStats.KMsWeek.toFixed(1)));

        var card = document.querySelector('#thisMonthCard');
        card.appendChild(createCardPiece('<strong>XP:</strong>  ' + calculatedStats.XPMonth));
        card.appendChild(createCardPiece('<strong>Catches:</strong>  ' + calculatedStats.catchesMonth));
        card.appendChild(createCardPiece('<strong>KMs:</strong>  ' + calculatedStats.KMsMonth.toFixed(1)));
        console.log(calculatedStats);

    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
    });
}

function getLevel(XP){
    if(XP<xpValues[0]){return "1";}
    for(var i =0; i < xpValues.length-1; i++){
        if(XP>=xpValues[i] && XP < xpValues[i+1]){
            return (i+2).toString();
        }
    }
    if(XP>=xpValues[xpValues.length-1]){return "50";}
}

function getDaysToLevelUp(XP, avgXP){
    if(getLevel(XP) == '50'){return "🏆";}
    var XPtoNextLvl = xpValues[parseInt(getLevel(XP))-1]-XP;
    var daysToLevelUp = Math.ceil(XPtoNextLvl/avgXP);
    var newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToLevelUp);
    return newDate.toLocaleDateString();
}


function loadChart(){
    var xpChart = document.getElementById('XPChart').getContext('2d');
    var stardustChart = document.getElementById('StardustChart').getContext('2d');
    var catchesChart = document.getElementById('CatchesChart').getContext('2d');
    var kmsChart = document.getElementById('KMSChart').getContext('2d');
    fetch(API_URL+'api/v1/records/data/chart',{
        headers: {
            'content-type':'application/json',
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res => res.json()).then(data=>{
        console.log(data);
        var chart = new Chart(xpChart, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'XP',
                        backgroundColor: 'rgb(255, 0, 0)',
                        borderColor: 'rgb(255, 0, 0)',
                        data: data.XPdata
                    }]
                },
                options: {
                    scales:{
                        xAxes:[{
                            ticks:{
                                display: true,
                                autoSkip: true,
                                maxTicksLimit: 20
                            }
                        }]
                    }
                }
            });
        chart = new Chart(kmsChart, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'KMs',
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: data.kmsData
                }]
            },
            options: {
                scales:{
                    xAxes:[{
                        ticks:{
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }]
                }
            }
        });
        chart = new Chart(catchesChart, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Catches',
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: data.catchesData
                }]
            },
            options: {
                scales:{
                    xAxes:[{
                        ticks:{
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }]
                }
            }
        });
        chart = new Chart(stardustChart, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Stardust',
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: data.stardustData
                }]
            },
            options: {
                scales:{
                    xAxes:[{
                        ticks:{
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }]
                }
            }
        });

    }).catch((error)=>{
        error.text().then(msg =>{
            logErrorMessage(JSON.parse(msg).message);
            console.error(JSON.parse(msg).message);
        });
    });
    
}
