(function($, chromeService){

  var _public = {};
  var alertList, alertListContainer;
  
  function init(){
    bindElements();
    getSavedAlerts();
  }

  function bindElements(){
    $('[data-js="button-save"]').on('click', onButtonSaveClick);
    $('[data-js="usd-value"]').on('change paste keyup', onUSDValueChange);
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

  function onUSDValueChange(){
    var buttonSave = $('[data-js="button-save"]');
    var USDEnteredValue = getUSDValueEntered();
    var invalidUSDValue = isNaN(USDEnteredValue);
    buttonSave.toggleClass('disabled', invalidUSDValue);
    buttonSave.prop('disabled', invalidUSDValue);
    console.log('value = ' + USDEnteredValue + ', it is invalid?=' + invalidUSDValue);
  }

  function onButtonSaveClick(){
    var USDEnteredValue = getUSDValueEntered();
    addUSDValueToAlertsList(USDEnteredValue);
    chromeService.storage.addAlert(USDEnteredValue);
  }

  function getUSDValueEntered(){
    var enteredValue = $('[data-js="usd-value"]').val().replace(',', '.');
    if (!enteredValue.match(/^[0-9]+(\.[0-9]+)?$/))
      return NaN;
    else
      return parseFloat(enteredValue);
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
