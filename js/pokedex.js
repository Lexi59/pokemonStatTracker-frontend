var pokedexDict;
function checkUsername() {
    fetch(API_URL, {
        headers: {
            authorization: 'Bearer ' + localStorage.token
        }
    }).then(res => res.json())
        .then(async (result) => {
            if (result.user) {
                if (!localStorage.getItem('pokedex')) {
                    await getPokedex()
                }
            }
            else {
                localStorage.removeItem('token');
                window.location.replace('../pages/login.html');
            }
        });
}

document.querySelector('#pokedexForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrorMessages();
    var values = document.querySelector('#pokedexNum').value.split(',');
    values = values.filter(x => x.indexOf('.') === -1);
    values = values.map(x => parseInt(x))
    values = values.filter(x => (x > 0 && isNaN(x) === false));
    if (values) {
        var pokedex = localStorage.getItem('pokedex').split(',');
        for (var i = 0; i < values.length; i++) {
            var row = document.createElement('tr');
            row.innerHTML = `<td>`+values[i]+`</td>`+
                `<td>`+pokedex[values[i]-1]+`</td>`+
                `<td>`+' '+`</td>`+
                `<td>`+' '+`</td>`;
                row.innerHTML += `<td><button class="btn btn-danger my-2 my-sm-0 ml-auto table-buttons" onclick='deleteEntry("`+values[i]+`")'>🗑️</button></td>`;
                document.querySelector('#pokedexTable tbody').appendChild(row);
            console.log(pokedex[values[i]-1]);
        }
    }
    else {
        logErrorMessage("Invalid number");
    }
})

function deleteEntry(num){
    var rows = document.getElementById('pokedexTable').rows
    for(var i = 0; i < rows.length; i++){
        if(rows[i].childNodes[0].innerHTML == num){
            document.getElementById('pokedexTable').deleteRow(i);
            return;
        }
    }

}

function logErrorMessage(msg, levelError = false) {
    var div = document.createElement('div');
    div.innerHTML = `<div class="alert alert-danger">` + msg + `</div>`;
    if (levelError) { document.querySelector('#LevelError').appendChild(div); }
    else { document.querySelector('#error').appendChild(div); }
}
function clearErrorMessages() {
    document.querySelector('#error').innerHTML = "";
}

async function getPokedex() {
    var arr = [];
    await fetch('https://pogoapi.net/api/v1/pokemon_names.json'
    ).then(res => res.json())
        .then((result) => {
            var objectArr = Object.values(result);
            var dict = [];
            for (var i = 0; i < objectArr.length; i++) {
                dict.push(objectArr[i].name);
            }
            const expiration = {
                value: dict.join(','),
                expiry: new Date().getTime() + 86400000,
            }
            window.localStorage.setItem('pokedex', JSON.stringify(expiration));
        });
}