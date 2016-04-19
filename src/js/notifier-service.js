(function($, chromeService, currencyService){

  var USD_VALUE_RESOURCE_URL =  'http://developers.agenciaideias.com.br' +
                                '/cotacoes/json';
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
      .then(onGetUSDExchangeValueSuccess);
  }

  function onGetUSDExchangeValueSuccess(response){
    chromeService.storage.getAlerts().then(function(savedAlerts){
      checkUSDExchangeValue(savedAlerts, parseFloat(response.currentValue));
    });
  }

  function checkUSDExchangeValue(savedAlerts, USDCurrentValue){
    if(dollarMatchesAnySavedAlert(savedAlerts, USDCurrentValue))
        notifyUser(USDCurrentValue);
  }

  function dollarMatchesAnySavedAlert(savedAlerts, USDCurrentValue){
    for (var i = 0; i < savedAlerts.length; i++)
      if(savedAlerts[i] === USDCurrentValue)
        return true;
  }

  function notifyUser(USDCurrentValue){
    var notification = buildNotification(USDCurrentValue);
    new Notification(notification.title, notification.options);
  }

  function buildNotification(USDCurrentValue){
    return {
      title: '1 USD = ' + USDCurrentValue + ' BRL',
      options: {
        icon: 'icon_128x128.png'
      }
    };
  }

  init();

})(jQuery, window.chromeService, window.currencyService);
