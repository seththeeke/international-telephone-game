import React from 'react';
import './App.css';
import AppRouter from './components/AppRouter.js';
import { BrowserRouter as Router } from "react-router-dom";
import TranslateService from './services/TranslateService.js';
import AppConfigService from './services/AppConfigService.js';
import AmplifyRequestService from './services/AmplifyRequestService.js';
import github from "./img/github.png";
// AWS Amplify Imports
import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

class App extends React.Component {
  constructor(props){
    super(props);
    this.translateServiceApiName = "TranslateService";
    this.amplifyRequestService = new AmplifyRequestService();
    this.translateService = new TranslateService(this.amplifyRequestService, this.translateServiceApiName);
    // being lazy and using the same api gateway
    this.appConfigService = new AppConfigService(this.amplifyRequestService, this.translateServiceApiName);
  }

  render(){
    return (
      <div className="App">          
        <Router>
          <AppRouter
            translateService={this.translateService}
            appConfigService={this.appConfigService}
          ></AppRouter>
          <a target="_blank" rel="noopener noreferrer" href="https://www.github.com/seththeeke/language-graph">
            <img className="icon" alt="github" src={github}></img>
          </a>
        </Router>
      </div>
    );
  }
  
}

export default App;