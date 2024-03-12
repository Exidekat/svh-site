// Place this function outside your event listener
function lockEmailInput() {
    const emailInput = document.getElementById('emailInput');
    emailInput.readOnly = true; // Lock the email input
}

function addBackButton() {
    const emailInput = document.getElementById('emailInput');
    const backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.id = 'backButton';
    backButton.onclick = resetForm;
    backButton.style.marginRight = '10px'; // Adjust styling as needed

    emailInput.parentNode.insertBefore(backButton, emailInput);
}

// Resets the form to its initial condition
function resetForm() {
    document.getElementById('emailInput').readOnly = false;
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').style.display = 'none';
    document.getElementById('passwordInput').value = '';
    const multiAuthInput = document.getElementById('multiauthInput');
    if (multiAuthInput) {
        multiAuthInput.remove();
    }
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.remove();
    }
}

// Modify your existing event listener
document.getElementById('emailInput').addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        console.log(("attempting request"))
        const email = this.value;
        try {
            const response = await fetch('/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log((`request received : ${data.authtype}`));
            lockEmailInput(); // Lock the email input
            addBackButton(); // Add the back button next to the email input

            if (data.authtype === 'passwd') {
                document.getElementById('passwordInput').style.display = 'block';
                document.getElementById('passwordInput').focus();
            } else if (data.authtype === 'multiauth') {
                createMultiAuthInput();
            }
        } catch (error) {
            console.error('Authentication error:', error.message);
            // Handle errors or invalid input appropriately in your UI
        }
    }
});

// Function to create 2FA input if authType is 'multiauth'
function createMultiAuthInput() {
    const form = document.getElementById('loginForm');
    if (!document.getElementById('multiauthInput')) {
        const multiAuthInput = document.createElement('input');
        multiAuthInput.type = 'text';
        multiAuthInput.id = 'multiauthInput';
        multiAuthInput.placeholder = 'Enter 2FA code';
        multiAuthInput.style.display = 'block';
        multiAuthInput.className = 'auth-input';

        const submitButton = document.querySelector('input[type=submit]');
        form.insertBefore(multiAuthInput, submitButton); // Insert before the submit button
        multiAuthInput.focus();
    }
}
