import React from 'react';
import './../css/Home.css';
import AddIcon from '@material-ui/icons/Add';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CircularProgress from '@material-ui/core/CircularProgress';

import logo from '../img/logo.png';

class Home extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         options: [],
         translatedText: "",
         sourceLabel: "Source Language",
         targetLabel: "Target Language",
         translateButtonText: "Translate",
         textToTranslatePlaceholder: "Text to Translate",
         websiteLanguageSelectionLabel: "Website Language Selection",
         updateWebsiteLanguageButtonText: "Update Website Language Code",
         appLanguageCode: "en",
         additionalTranslations: [],
         isLoadingWebsite: true,
         isTranslating: false,
         translateLimitExceeded: false
      }

      this.translateText = this.translateText.bind(this);
      this.setupApp = this.setupApp.bind(this);
      this.updateWebsiteLanguageCode = this.updateWebsiteLanguageCode.bind(this);
      this.addAdditionalLanguage = this.addAdditionalLanguage.bind(this);
   }

   componentDidMount(){
      this.setupApp(this.state.appLanguageCode);
   }

   setupApp(languageCode){
      this.props.appConfigService.getAppConfig(languageCode).then(function(response){
         this.appConfig = response.data.Items[0];
         let languageOptionsForCode = this.appConfig.options.L;
         let languageOptions = [];
         for (let languageOption of languageOptionsForCode){
            languageOptions.push(
               <option key={languageOption.M.code.S} value={languageOption.M.code.S}>{languageOption.M.label.S}</option> 
            );
         }
         this.setState({
            options: languageOptions,
            sourceLabel: this.appConfig.sourceLabel.S,
            targetLabel: this.appConfig.targetLabel.S,
            translateButtonText: this.appConfig.translateButtonText.S,
            textToTranslatePlaceholder: this.appConfig.textToTranslatePlaceholder.S,
            websiteLanguageSelectionLabel: this.appConfig.websiteLanguageSelectionLabel.S,
            updateWebsiteLanguageButtonText: this.appConfig.updateWebsiteLanguageButtonText.S,
            translateLimitExceededText: this.appConfig.translateLimitExceededText.S,
            appLanguageCode: languageCode,
            additionalTranslations: [],
            isLoadingWebsite: false
         });
      }.bind(this));
   }

   async translateText(){
      this.setState({
         isTranslating: true
      });
      let sourceTextToTranslate = document.getElementById("textToTranslate").value;
      let startLanguageCode = document.getElementById("sourceLanguageOption").value;
      let currTextToTranslate = sourceTextToTranslate;
      let currLanguageCode = startLanguageCode;
      let targetLanguageCode = document.getElementById("targetLanguageOption").value;
      for (let lang of this.state.additionalTranslations) {
         let selectId = lang.key + "-select";
         let nextLanguageCode = document.getElementById(selectId).value;

         let response = await this.props.translateService.translateText(currTextToTranslate, currLanguageCode, nextLanguageCode);
         let inputId = lang.key + "-input";
         currTextToTranslate = response.data.translatedText.TranslatedText;
         currLanguageCode = nextLanguageCode;
         document.getElementById(inputId).placeholder = currTextToTranslate;
      }

      this.props.translateService.translateText(currTextToTranslate, currLanguageCode, targetLanguageCode).then(function(response){
         this.setState({
            translatedText: response.data.translatedText.TranslatedText,
            isTranslating: false
         });
      }.bind(this), function(error){
         this.setState({
            translateLimitExceeded: true,
            isTranslating: false
         });
      }.bind(this));
   }

   updateWebsiteLanguageCode(){
      this.setState({
         isLoadingWebsite: true
      });
      this.setupApp(document.getElementById("websiteLanguageCodeOption").value);
   }

   addAdditionalLanguage(){
      let currTranslations = this.state.additionalTranslations;
      let keyProp = "additionalLanguage-" + currTranslations.length;
      let selectId = keyProp + "-select";
      let inputId = keyProp + "-input";
      currTranslations.push(
         <div key={keyProp} className="language-select-container">
            <select id={selectId} className="language-select">
               {this.state.options}
            </select>
            <div>
               <input id={inputId} className="text-to-translate-input" type="text" disabled></input>
            </div>
         </div>
      );
      this.setState({
         additionalTranslations: currTranslations
      });
   }

   render() {
      return (
         <div className='home-container'>
            <div className="page-spinner-container" hidden={!this.state.isLoadingWebsite}>
               <CircularProgress></CircularProgress>
            </div>
            <div hidden={this.state.isLoadingWebsite}>
               <div>
                  <img className="app-logo" src={logo}></img>
               </div>
               <div className="limit-exceeded-container" hidden={!this.state.translateLimitExceeded}>
                  {this.state.translateLimitExceededText}
               </div>
               <div>
                  <div>
                     <div className="language-select-container">
                        <div className="language-select-label">{this.state.websiteLanguageSelectionLabel}</div>
                        <select className="language-select" id="websiteLanguageCodeOption">
                           {this.state.options}
                        </select>
                     </div>
                     <button className="primary-button" onClick={this.updateWebsiteLanguageCode}>{this.state.updateWebsiteLanguageButtonText}</button>
                  </div>
                  <div>
                     <div className="language-select-container">
                        <div className="language-select-label">{this.state.sourceLabel}</div>
                        <select className="language-select" id="sourceLanguageOption">
                           {this.state.options}
                        </select>
                        <div>
                           <input id="textToTranslate" className="text-to-translate-input" type="text" placeholder={this.state.textToTranslatePlaceholder}></input>
                        </div>
                     </div>
                     <div className="additional-languages-container">
                        {this.state.additionalTranslations}
                     </div>
                     <div className="add-language-container" onClick={this.addAdditionalLanguage}>
                        <AddIcon className="icon-button"></AddIcon>
                     </div>
                     <div className="language-select-container">
                        <div className="language-select-label">{this.state.targetLabel}</div>
                        <select className="language-select" id="targetLanguageOption">
                           {this.state.options}
                        </select>
                        <div>
                           <input className="text-to-translate-input" type="text" placeholder={this.state.translatedText} disabled></input>
                        </div>
                     </div>
                  </div>
               </div>
               <div hidden={!this.state.isTranslating}>
                  <CircularProgress />
               </div>
               <div>
                  <button className="primary-button" onClick={this.translateText}>{this.state.translateButtonText}</button>
                  <div onClick={this.updateWebsiteLanguageCode}>
                     <RotateLeftIcon className="icon-button"></RotateLeftIcon>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

export default Home;