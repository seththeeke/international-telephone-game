class TranslateService {
  constructor(amplifyRequestService, apiName) {
    this.amplifyRequestService = amplifyRequestService;
    this.apiName = apiName;
    this.translateServiceCache = {};
  }

  translateText(text, sourceLanguageCode, targetLanguageCode) {
    let cacheKey = text+sourceLanguageCode+targetLanguageCode;
    if (this.translateServiceCache[cacheKey]){
      return this.translateServiceCache[cacheKey];
    }
    let languageParams = {
      body: {
        "sourceLanguageCode": sourceLanguageCode,
        "targetLanguageCode": targetLanguageCode,
        "text": text
      }
    }
    this.translateServiceCache[cacheKey] = this.amplifyRequestService.request(this.apiName, '/translate', "PUT", languageParams);
    return this.translateServiceCache[cacheKey];
  }

}

export default TranslateService;