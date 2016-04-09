(function($, window){

  var USD_EXCHANGE_VALUE_RESOURCE_URL = 'http://developers.agenciaideias.com.br' +
                                        '/cotacoes/json';

  var _public = {};
  var USDValues = [];
  
  _public.init = function(){
    bindElements();
  };

  function bindElements(){
    $('[data-js="button-save"]').on('click', onButtonSaveClick);
  }

  function onButtonSaveClick(evt){
    evt.preventDefault();
    var USDValue = getUSDValueEntered();
    storeUSDValue(USDValue);
    getUSDExchangeValue()
      .then(onGetUSDExchangeValueSuccess)
      .fail(function(){alert('failed!');});
  }

  function getUSDValueEntered(){
    var value = $('[data-js="usd-value"]').val();
    return parseFloat(value.replace(',','.'));
  }

  function storeUSDValue(USDValue){
    if(!USDValueIsAlreadyStored(USDValue)){
      USDValues.push(USDValue);
      addUSDValueToAlertsList(USDValue);
    }
  }

  function USDValueIsAlreadyStored(USDValue){
    for (var i = 0; i < USDValues.length; i++)
      if(USDValue === USDValues[i])
        return true;
  }

  function addUSDValueToAlertsList(USDValue){
    USDValue = USDValue.toString().replace('.',',');
    var list = $('[data-js="alerts-lsit"');
    var item = $('<li></li>');
    var listUSDValue = $('<span class"usd-value" data-js="alerts-list-usd-value">' + USDValue + '</span>');
    var deleteLink = $('<span class="delete">Remove</span>');
    list.append(item.append(listUSDValue).append(deleteLink));
  }

  function getUSDExchangeValue(){
    var promise = $.Deferred();
    $.ajax({
      url: USD_EXCHANGE_VALUE_RESOURCE_URL,
      'content-type': 'application/json',
      success: function(response){
        promise.resolve(response);
      },
      error: function(response){
        promise.reject(response);
      }
    });
    return promise;
  }

  function onGetUSDExchangeValueSuccess(response){
    var value = response.dolar.cotacao.substring(0,4);
    checkUSDExchangeValue(parseFloat(value));
  }

  function checkUSDExchangeValue(USDExchangeValue){
    for (var i = 0; i < USDValues.length; i++)
      if(USDValues[i] === USDExchangeValue)
        notifyUser(USDExchangeValue);
  }

  function notifyUser(USDExchangeValue){
    if(Notification.permission == "granted")
      new Notification(buildNotification(USDExchangeValue));
    else
      console.log('Failed to notify USD value: ' + USDExchangeValue + ' BRL.');
  }

  function buildNotification(USDExchangeValue){
    return '1 USD = ' + USDExchangeValue + ' BRL';
  }

  window.dollert = _public;

})(jQuery, window);
