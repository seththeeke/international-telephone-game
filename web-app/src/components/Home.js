import React from 'react';
import './../css/Home.css';
import AddIcon from '@material-ui/icons/Add'

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
         additionalTranslations: []
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
            appLanguageCode: languageCode
         });
      }.bind(this));
   }

   async translateText(){
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
            translatedText: response.data.translatedText.TranslatedText
         });
      }.bind(this), function(error){
         console.log(error);
      });
   }

   updateWebsiteLanguageCode(){
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
            <div>
               <img className="app-logo" src={logo}></img>
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
                     <AddIcon></AddIcon>
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
            <div>
               <button className="primary-button" onClick={this.translateText}>{this.state.translateButtonText}</button>
            </div>
         </div>
      );
   }
}

export default Home;