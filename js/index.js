if(localStorage.token){
    document.querySelector('#logout').textContent = 'Log Out';
}
else{
    document.querySelector('#logout').textContent = 'Log In';
}

function logButton(){
    if(localStorage.token){
        localStorage.removeItem("token");
        window.location.href('../index.html')
        document.querySelector('#logout').textContent = 'Log In';
    }
    else{
      window.location.href('../pages/login.html');
      document.querySelector('#logout').textContent = 'Log Out';
    }
  }