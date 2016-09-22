(function($, chromeService, currencyService){

  var DOLLERT_ALARM_ID = 'dollertAlarm';

  function init(){
    setListeners();
    checkSavedAlerts();
  }

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
    if(dollarMatchesAnySavedAlert(savedAlerts, currentUSDValue))
        notifyUser(currentUSDValue);
  }

  function dollarMatchesAnySavedAlert(savedAlerts, currentUSDValue){
    for (var i = 0; i < savedAlerts.length; i++)
      if(savedAlerts[i] === currentUSDValue)
        return true;
  }

  function notifyUser(currentUSDValue){
    var notification = buildNotification(currentUSDValue);
    new Notification(notification.title, notification.options);
  }

  function buildNotification(currentUSDValue){
    return {
      title: '1 USD = ' + currentUSDValue + ' BRL',
      options: {
        icon: 'icon_128x128.png'
      }
    };
  }

  init();

}(jQuery, window.chromeService, window.currencyService));
