class AppConfigService {
    constructor(amplifyRequestService, apiName) {
      this.amplifyRequestService = amplifyRequestService;
      this.apiName = apiName;
      this.appConfigCache = {};
    }
  
    getAppConfig(languageCode) {
      if (this.appConfigCache[languageCode]){
        return this.appConfigCache[languageCode]
      }
      let appConfigParams = {
        queryStringParameters: {
          "languageCode": languageCode
        }
      }
      this.appConfigCache[languageCode] = this.amplifyRequestService.request(this.apiName, '/app-config', "GET", appConfigParams);
      return this.appConfigCache[languageCode];
    }
  
  }
  
  export default AppConfigService;