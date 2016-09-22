(function($, chromeService, currencyService){

  var CURRENCY_VARIATION_CSS_CLASS = {
    POSITIVE: 'is-positive',
    NEGATIVE: 'is-negative'
  };

  var _public = {};
  var alertList,
    alertListContainer,
    currentUSDValueElement,
    currentUSDValueVariationElement,
    saveButton;

  function init(){
    storeElements();
    bindElements();
    getSavedAlerts();
    getCurrentUSDValue();
  }

  function storeElements(){
    saveButton = $('[data-js="button-save"]');
    currentUSDValueElement = $('[data-js="currency-current-value"]');
    currentUSDValueVariationElement = $('[data-js="currency-current-value-variation"]');
    alertListContainer = $('[data-js="alert-list-container"]');
    alertList = $('[data-js="alert-list"]');
  }

  function bindElements(){
    saveButton.on('click', onButtonSaveClick);
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
    var item = $('<li class="cp-alert-list-item"></li>');
    var deleteText = $('<span class="cp-alert-list-item-delete">Remove</span>');
    var USDValue = $('<span class="cp-alert-list-item-content"></span>');
    item.append(deleteText);
    item.append(USDValue.text(value));
    item.attr('data-usd-value', value).on('click', removeAlert);
    alertList.append(item);
    alertListContainer.removeClass('is-hidden');
  }

  function removeAlert(evt){
    var item = $(evt.currentTarget);
    removeAlertFromStorage(item);
    removeAlertFromList(item);
  }

  function removeAlertFromStorage(item){
    var value = item.attr('data-usd-value');
    chromeService.storage.removeAlert(value);
  }

  function removeAlertFromList(item){
    item.remove();
    if(wasLastItemRemoved())
      hideAlertListContainer();
  }

  function wasLastItemRemoved(){
    return $('li', alertList).length === 0;
  }

  function hideAlertListContainer(){
    alertListContainer.addClass('is-hidden');
  }

  function getCurrentUSDValue() {
    currencyService.getCurrentUSDValue()
      .then(onGetCurrentUSDValueSuccess)
      .fail(onGetCurrentUSDValueFail);
  }

  function onGetCurrentUSDValueFail() {
    currentUSDValueElement
      .text('Failed to get current USD value')
      .addClass('is-failed');
  }

  function onGetCurrentUSDValueSuccess(response){
    setupCurrentUSDValue(response.currentValue);
    setupCurrentUSDVariation(response.currentVariation);
  }

  function setupCurrentUSDValue(value){
    currentUSDValueElement.text(value);
  }

  function setupCurrentUSDVariation(variation) {
    currentUSDValueVariationElement.text(variation);
    setCurrentUSDVariationNegativeStyle();
    if(isPositiveVariation(variation))
      setCurrentUSDVariationPositiveStyle();
  }

  function isPositiveVariation(variation) {
    return parseFloat(variation) >= 0;
  }

  function setCurrentUSDVariationNegativeStyle() {
    currentUSDValueVariationElement
      .removeClass(CURRENCY_VARIATION_CSS_CLASS.POSITIVE)
      .addClass(CURRENCY_VARIATION_CSS_CLASS.NEGATIVE);
  }

  function setCurrentUSDVariationPositiveStyle(){
    currentUSDValueVariationElement
      .removeClass(CURRENCY_VARIATION_CSS_CLASS.NEGATIVE)
      .addClass(CURRENCY_VARIATION_CSS_CLASS.POSITIVE);
  }

  init();

}(jQuery, window.chromeService, window.currencyService));
