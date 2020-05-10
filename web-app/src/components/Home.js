import React from 'react';
import './../css/Home.css';

class Home extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         options: [],
         translatedText: ""
      }

      this.translateText = this.translateText.bind(this);

      this.languageCodes = [
         {
            "label": "Afrikaans",
            "code": "af"
         },
         {
            "label": "Albanian",
            "code": "sq"
         },
         {
            "label": "Amharic",
            "code": "am"
         },
         {
            "label": "Arabic",
            "code": "ar"
         },
         {
            "label": "Azerbaijani",
            "code": "az"
         },
         {
            "label": "Bengali",
            "code": "bn"
         },
         {
            "label": "Bosnian",
            "code": "bs"
         },
         {
            "label": "Bulgarian",
            "code": "bq"
         },
         {
            "label": "Chinese (Simplified)",
            "code": "zh"
         },
         {
            "label": "Chinese (Traditional)",
            "code": "zh-TW"
         },
         {
            "label": "Croatian",
            "code": "hr"
         },
         {
            "label": "Czech",
            "code": "cs"
         },
         {
            "label": "Danish",
            "code": "da"
         },
         {
            "label": "Dari",
            "code": "fa-AF"
         },
         {
            "label": "Dutch",
            "code": "nl"
         },
         {
            "label": "English",
            "code": "en"
         },
         {
            "label": "Estonian",
            "code": "et"
         },
         {
            "label": "Finnish",
            "code": "fi"
         },
         {
            "label": "French",
            "code": "fr"
         },
         {
            "label": "French (Canada)",
            "code": "fr-CA"
         },
         {
            "label": "Georgian",
            "code": "ka"
         },
         {
            "label": "German",
            "code": "de"
         },
         {
            "label": "Greek",
            "code": "el"
         },
         {
            "label": "Hause",
            "code": "ha"
         },
         {
            "label": "Hebrew",
            "code": "he"
         },
         {
            "label": "Hindi",
            "code": "hi"
         },
         {
            "label": "Hungarian",
            "code": "hu"
         },
         {
            "label": "Indonesian",
            "code": "id"
         },
         {
            "label": "Italian",
            "code": "it"
         },
         {
            "label": "Japenese",
            "code": "ja"
         },
         {
            "label": "Korean",
            "code": "ko"
         },
         {
            "label": "Latvian",
            "code": "lv"
         },
         {
            "label": "Malay",
            "code": "ms"
         },
         {
            "label": "Norwegian",
            "code": "no"
         },
         {
            "label": "Persian",
            "code": "fa"
         },
         {
            "label": "Pashto",
            "code": "ps"
         },
         {
            "label": "Polish",
            "code": "pl"
         },
         {
            "label": "Portuguese",
            "code": "pt"
         },
         {
            "label": "Romanian",
            "code": "ro"
         },
         {
            "label": "Russian",
            "code": "ru"
         },
         {
            "label": "Serbian",
            "code": "sr"
         },
         {
            "label": "Slovak",
            "code": "sk"
         },
         {
            "label": "Slovenian",
            "code": "sl"
         },
         {
            "label": "Somali",
            "code": "so"
         },
         {
            "label": "Spanish",
            "code": "es"
         },
         {
            "label": "Spanish (Mexico)",
            "code": "es-MX"
         },
         {
            "label": "Swahili",
            "code": "sw"
         },
         {
            "label": "Swedish",
            "code": "sv"
         },
         {
            "label": "Tagalog",
            "code": "tl"
         },
         {
            "label": "Tamil",
            "code": "ta"
         },
         {
            "label": "Thai",
            "code": "th"
         },
         {
            "label": "Turkish",
            "code": "tr"
         },
         {
            "label": "Ukrainian",
            "code": "uk"
         },
         {
            "label": "Urdu",
            "code": "ur"
         },
         {
            "label": "Vietnamese",
            "code": "vi"
         },
      ]
   }

   componentDidMount(){
      let languageOptions = [];
      for (let languageOption of this.languageCodes){
         languageOptions.push(
            <option key={languageOption.code} value={languageOption.code}>{languageOption.label}</option> 
         );
      }
      this.setState({
         options: languageOptions
      });
   }

   translateText(){
      let textToTranslate = document.getElementById("textToTranslate").value;
      let sourceLanguageCode = document.getElementById("sourceLanguageOption").value;
      let targetLanguageCode = document.getElementById("targetLanguageOption").value;
      // this.props.translateService.translateText(textToTranslate, sourceLanguageCode, targetLanguageCode).then(function(response){
      //    this.setState({
      //       translatedText: response.data.TranslatedText
      //    });
      // }.bind(this), function(error){
      //    console.log(error);
      // });

      this.setState({
         translatedText: "Some Translated Text"
      });
   }

   render() {
      return (
         <div className='home-container'>
            <div>
               <div>
                  <label>Source Language</label>
                  <select id="sourceLanguageOption">
                     {this.state.options}
                  </select>
               </div>
               <div>
                  <label>Target Language</label>
                  <select id="targetLanguageOption">
                     {this.state.options}
                  </select>
               </div>
               <input id="textToTranslate" type="text" placeholder="Text To Translate"></input>
            </div>
            <div>
               <button onClick={this.translateText}>Translate</button>
            </div>
            <div>{this.state.translatedText}</div>
         </div>
      );
   }
}

export default Home;