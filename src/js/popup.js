(function($, chromeService){

  var _public = {};
  var alertList, alertListContainer;
  
  function init(){
    bindElements();
    getSavedAlerts();
  }

  function bindElements(){
    $('[data-js="button-save"]').on('click', onButtonSaveClick);
    alertListContainer = $('[data-js="alert-list-container"');
    alertList = $('[data-js="alert-list"');
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

  init();

})(jQuery, window.chromeService);
