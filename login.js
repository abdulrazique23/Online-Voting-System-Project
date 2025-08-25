document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (username === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (data.success) {
            // Show brief message and redirect
            document.body.insertAdjacentHTML('afterbegin', '<div class="login-message">Login successful!</div>');
            setTimeout(() => {
                window.location.href = 'voting.html';
            }, 1000);
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
    }
});

document.getElementById('signupButton').addEventListener('click', function() {
    window.location.href = 'signup.html';
});

// Add styles for login message
const style = document.createElement('style');
style.textContent = `
.login-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 1000;
    animation: fadeOut 2s ease-in-out forwards;
}

@keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
`;
document.head.appendChild(style);
