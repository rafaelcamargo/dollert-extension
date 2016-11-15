(function($, chromeService, currencyService){

  var DOLLERT_ALARM_ID = 'dollertAlarm';
  var THIRTY_MINUTES_IN_MILLISECONDS = 1800000;

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
      createDollertAlarm();
  }

  function setupAlarm(storage){
    if(!storage.dollerts)
      clearDollertAlarm();
    else
      createDollertAlarm();
  }

  function createDollertAlarm(){
    chromeService.alarms.get(DOLLERT_ALARM_ID).then(function(dollertAlarm){
      if(!dollertAlarm)
        chromeService.alarms.create(DOLLERT_ALARM_ID, {
          periodInMinutes: 1
        });
    });
  }

  function clearDollertAlarm(){
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
    chromeService.storage.getLastNotifiedAlert().then(function(lastNotifiedAlert){
      if(shouldNotifyUser(savedAlerts, lastNotifiedAlert, currentUSDValue))
        notifyUser(currentUSDValue);
    });
  }

  function notifyUser(currentUSDValue){
    var alertDetails = {
      value: currentUSDValue,
      time: new Date().getTime()
    };
    chromeService.notification.show(currentUSDValue);
    chromeService.storage.addAlertLastNotified(alertDetails);
  }

  function shouldNotifyUser(savedAlerts, lastNotifiedAlert, currentUSDValue){
    var isAlertAlreadySaved = chromeService.storage.isAlertAlreadySaved(savedAlerts, currentUSDValue);
    if(!isAlertAlreadySaved || (isAlertAlreadySaved && wasAlertNotifiedInTheLast30Minutes(currentUSDValue, lastNotifiedAlert)))
      return false;
    return true;
  }

  function wasAlertNotifiedInTheLast30Minutes(currentUSDValue, lastNotifiedAlert){
    if(currentUSDValue === parseFloat(lastNotifiedAlert.value))
      return new Date().getTime() - parseInt(lastNotifiedAlert.time) < THIRTY_MINUTES_IN_MILLISECONDS;
  }

  _public.init();

  window.notifierService = _public;

}(jQuery, window.chromeService, window.currencyService));
