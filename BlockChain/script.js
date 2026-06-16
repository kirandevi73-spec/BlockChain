const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const container = document.querySelector('.container');

// When the 'Register' button on the right panel is clicked
// (This button is visible when the login form is active, prompting user to register)
registerBtn.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
});

// When the 'Login' button on the left panel is clicked
// (This button is visible when the registration form is active, prompting user to login)
loginBtn.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
});