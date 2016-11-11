(function($, chromeService, currencyService){

  var DOLLERT_ALARM_ID = 'dollertAlarm';

  var _public = {};

  _public.init = function(){
    setListeners();
    checkSavedAlerts();
  };

  function setListeners(){
    chromeService.alarms.addListener(requestUSDExchangeValue);
    chromeService.storage.onChanged(setupAlarm);
  }

  function checkSavedAlerts(){
    chromeService.storage.getAlerts().then(onGetAlertsSuccess);
  }

  function onGetAlertsSuccess(alerts){
    if(alerts.length)
      scheduleUSDExchangeValueRequest();
  }

  function setupAlarm(storage){
    if(!storage.dollerts)
      clearSchedule();
    else
      scheduleUSDExchangeValueRequest();
  }

  function scheduleUSDExchangeValueRequest(){
    chromeService.alarms.get(DOLLERT_ALARM_ID).then(function(alarms){
      if(!alarms)
        chromeService.alarms.create(DOLLERT_ALARM_ID, {
          periodInMinutes: 1
        });
    });
  }

  function clearSchedule(){
    chromeService.alarms.clear(DOLLERT_ALARM_ID);
  }

  function requestUSDExchangeValue(){
    currencyService.getCurrentUSDValue()
      .then(onGetCurrentUSDValueSuccess);
  }

  function onGetCurrentUSDValueSuccess(response){
    chromeService.storage.getAlerts().then(function(savedAlerts){
      checkCurrentUSDValue(savedAlerts, parseFloat(response.currentValue));
    });
  }

  function checkCurrentUSDValue(savedAlerts, currentUSDValue){
    if(chromeService.storage.isAlertAlreadySaved(savedAlerts, currentUSDValue))
      notifyUser(currentUSDValue);
  }

  function notifyUser(currentUSDValue){
    chromeService.notification.show(currentUSDValue);
  }

  _public.init();

  window.notifierService = _public;

}(jQuery, window.chromeService, window.currencyService));
