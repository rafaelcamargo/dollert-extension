(function($, chromeService, usdValueService){

  var _public = {};
  var alertList, alertListContainer, nowValue, nowVariation;

  function init(){
    bindElements();
    getSavedAlerts();
    getNowValue();
  }

  function bindElements(){
    $('[data-js="button-save"]').on('click', onButtonSaveClick);
    alertListContainer = $('[data-js="alert-list-container"');
    alertList = $('[data-js="alert-list"');
    nowValue = $('[data-js="now-value"');
    nowVariation = $('[data-js="now-variation"');
  }

  function getSavedAlerts(){
    chromeService.storage.getAlerts().then(function(alerts){
      if(alerts.length)
        buildAlertList(alerts);
      else
        alertListContainer.addClass('is-hidden');
    });
  }

  function onButtonSaveClick(){
    var USDEnteredValue = getUSDValueEntered();
    addUSDValueToAlertsList(USDEnteredValue);
    chromeService.storage.addAlert(USDEnteredValue);
  }

  function getUSDValueEntered(){
    return parseFloat($('[data-js="usd-value"]').val().replace(',','.'));
  }

  function buildAlertList(alerts){
    for (var i = 0; i < alerts.length; i++)
      addUSDValueToAlertsList(alerts[i]);
  }

  function addUSDValueToAlertsList(value){
    var item = $('<li class="alert-list-item"></li>');
    var deleteText = $('<span class="dollert-delete">Remove</span>');
    var USDValue = $('<span class="dollert-usd-value"></span>');
    item.append(deleteText);
    item.append(USDValue.text(value));
    item.attr('data-usd-value', value).on('click', removeAlert);
    alertList.append(item);
    alertListContainer.removeClass('is-hidden');
  }

  function removeAlert(evt){
    var item = $(evt.currentTarget);
    var value = item.attr('data-usd-value');
    chromeService.storage.removeAlert(value);
    item.remove();
    if(!$('li', alertList).length)
      alertListContainer.addClass('is-hidden');
  }

  function getNowValue() {
    usdValueService.getCurrentValue()
      .then(onGetUSDCurrentValueSuccess);
  }

  function onGetUSDCurrentValueSuccess(response){
    setupUSDCurrentValue(response.dolar.cotacao);
    setupUSDCurrentValueVariation(response.dolar.variacao);
  }

  function setupUSDCurrentValue(dolarValue){
    var value = dolarValue.substring(0,4);
    nowValue.text(value);
  }

  function setupUSDCurrentValueVariation(dolarVariation) {
    var variation = dolarVariation.substring(0,5);

    if(isPositiveVariation(variation)) {
      nowVariation.addClass('is-positive');
    } else {
      nowVariation.addClass('is-negative');
    }

    nowVariation.text(variation);
  }

  function isPositiveVariation(variation) {
    return parseFloat(variation) >= 0;
  }

  init();

})(jQuery, window.chromeService, window.usdValueService);
