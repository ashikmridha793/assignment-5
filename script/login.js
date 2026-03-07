document.getElementById('login-btn').addEventListener('click', function(){
    
    const usernameInput = document.getElementById('input-username');
    const username = usernameInput.value;
    console.log(username);
    
    const passwordInput = document.getElementById('input-password');
    const password = passwordInput.value;
    console.log(password);
    
    if(username === 'admin' && password === 'admin123'){
        alert('Login successful!');
        window.location.assign('/home.html');
    } else {
        alert('Login failed! Please check your username and password.');
        return;
    }

})