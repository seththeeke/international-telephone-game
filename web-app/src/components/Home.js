import React from 'react';
import './../css/Home.css';

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
         appLanguageCode: "en"
      }

      this.translateText = this.translateText.bind(this);
      this.setupApp = this.setupApp.bind(this);
      this.updateWebsiteLanguageCode = this.updateWebsiteLanguageCode.bind(this);
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
         console.log(this.appConfig);
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

   translateText(){
      let textToTranslate = document.getElementById("textToTranslate").value;
      let sourceLanguageCode = document.getElementById("sourceLanguageOption").value;
      let targetLanguageCode = document.getElementById("targetLanguageOption").value;
      this.props.translateService.translateText(textToTranslate, sourceLanguageCode, targetLanguageCode).then(function(response){
         this.setState({
            translatedText: response.data.translatedText.TranslatedText
         });
      }.bind(this), function(error){
         console.log(error);
      });

      // this.setState({
      //    translatedText: "Some Translated Text"
      // });
   }

   updateWebsiteLanguageCode(){
      this.setupApp(document.getElementById("websiteLanguageCodeOption").value);
   }

   render() {
      return (
         <div className='home-container'>
            <div>
               <div>
                  <div className="language-select-container">
                     <div className="language-select-label">{this.state.websiteLanguageSelectionLabel}</div>
                     <select className="language-select" id="websiteLanguageCodeOption">
                        {this.state.options}
                     </select>
                  </div>
                  <button onClick={this.updateWebsiteLanguageCode}>{this.state.updateWebsiteLanguageButtonText}</button>
               </div>
               <div>
                  <div className="language-select-container">
                     <div className="language-select-label">{this.state.sourceLabel}</div>
                     <select className="language-select" id="sourceLanguageOption">
                        {this.state.options}
                     </select>
                  </div>
                  <div className="language-select-container">
                     <div className="language-select-label">{this.state.targetLabel}</div>
                     <select className="language-select" id="targetLanguageOption">
                        {this.state.options}
                     </select>
                  </div>
               </div>
               <input id="textToTranslate" className="text-to-translate-input" type="text" placeholder={this.state.textToTranslatePlaceholder}></input>
            </div>
            <div>
               <button onClick={this.translateText}>{this.state.translateButtonText}</button>
            </div>
            <div>{this.state.translatedText}</div>
         </div>
      );
   }
}

export default Home;