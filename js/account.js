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