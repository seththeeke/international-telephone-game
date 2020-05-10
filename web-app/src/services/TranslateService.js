class TranslateService {
  constructor(amplifyRequestService, apiName) {
    this.amplifyRequestService = amplifyRequestService;
    this.apiName = apiName;
  }

  translateText(text, sourceLanguageCode, targetLanguageCode) {
    let languageParams = {
      body: {
        "sourceLanguageCode": sourceLanguageCode,
        "targetLanguageCode": targetLanguageCode,
        "text": text
      }
    }
    return this.amplifyRequestService.request(this.apiName, '/translate', "PUT", languageParams);
  }

}

export default TranslateService;