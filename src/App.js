import './App.css';
import logo from './media/brand_image.png';

import { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      emailInput: '',
      emailInputReadOnly: false
    }

    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
  }

  handleEmailInput(event){
    this.setState({
      emailInput: event.target.value
    });
  }

  async submitEmail(){
        console.log(("attempting request"))
        const email = this.state.emailInput;
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

  render(){
    return (
      <div className="login-container">
        <img src={logo} className="brand-image" alt="Brand Image"/>
        <form id="loginForm">
          <div id="emailContainer">
            <input type="email" id="emailInput" placeholder="Enter your email" required 
            readOnly={this.state.emailInputReadOnly} 
            value={this.state.emailInput} 
            onChange={this.handleEmailInput}
            onKeyDown={e => {
              if (e.key === 'Enter'){

              }
            }}/>
          </div>
          <input type="password" id="passwordInput" placeholder="Password" required style={{display: 'none'}}/>
          <input type="submit" value="Login" style={{display: 'none'}}/>
        </form>
      </div>
    );
  }
}

export default App;
