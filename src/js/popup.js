(function($, chromeService, currencyService){

  var CURRENT_USD_VALUE = {
    LOADER_MESSAGE: 'Loading value...',
    VARIATION: {
      CSS_CLASS: {
        POSITIVE: 'is-positive',
        NEGATIVE: 'is-negative'
      }
    },
    FAIL: {
      MESSAGE: 'Failed to get current USD value',
      CSS_CLASS: 'is-failed'
    }
  };

  var BUTTON = {
    CSS_CLASSES: {
      DISABLED: 'is-disabled'
    }
  };

  var AUTHOR_WEBSITE_URL = 'https://www.rafaelcamargo.com';

  var _public = {},
    alertListElement,
    alertValueInputElement,
    alertListContainerElement,
    currentUSDValueElement,
    currentUSDValueVariationElement,
    saveButtonElement;

  _public.init = function(){
    storeElements();
    disableSaveButton();
    bindElements();
    getSavedAlerts();
    getCurrentUSDValue();
  };

  function storeElements(){
    alertListElement = $('[data-js="alert-list"]');
    alertValueInputElement = $('[data-js="alert-value"]');
    alertListContainerElement = $('[data-js="alert-list-container"]');
    currentUSDValueElement = $('[data-js="currency-current-value"]');
    currentUSDValueVariationElement = $('[data-js="currency-current-value-variation"]');
    saveButtonElement = $('[data-js="button-save"]');
    creditLinkElement = $('[data-js="link-credit"]');
  }

  function disableSaveButton(){
    saveButtonElement.attr('disabled','disabled').addClass(BUTTON.CSS_CLASSES.DISABLED);
  }

  function enableSaveButton(){
    saveButtonElement.removeAttr('disabled').removeClass(BUTTON.CSS_CLASSES.DISABLED);
  }

  function bindElements(){
    saveButtonElement.on('click', onButtonSaveClick);
    creditLinkElement.on('click', openAuthorWebsite);
    alertValueInputElement.on('keyup change mouseenter mouseleave', onAlertValueInputChange);
  }

  function getSavedAlerts(){
    chromeService.storage.getAlerts().then(function(alerts){
      if(alerts.length)
        buildAlertList(alerts);
      else
        alertListContainerElement.addClass('is-hidden');
    });
  }

  function onButtonSaveClick(){
    var USDEnteredValue = getAlertValueEntered();
    addUSDValueToAlertsList(USDEnteredValue);
    chromeService.storage.addAlert(USDEnteredValue);
  }

  function getAlertValueEntered(){
    var value = alertValueInputElement.val().replace(',','.');
    return parseFloat(value);
  }

  function buildAlertList(alerts){
    for (var i = 0; i < alerts.length; i++)
      addUSDValueToAlertsList(alerts[i]);
  }

  function addUSDValueToAlertsList(value){
    var itemElement = $('<li class="cp-alert-list-item"></li>');
    var deleteTriggerElement = $('<span class="cp-alert-list-item-delete">Remove</span>');
    var itemValueElement = $('<span class="cp-alert-list-item-content"></span>');
    itemElement.append(deleteTriggerElement);
    itemElement.append(itemValueElement.text(value));
    itemElement.attr('data-alert-value', value).on('click', removeAlert);
    alertListElement.append(itemElement);
    alertListContainerElement.removeClass('is-hidden');
  }

  function removeAlert(evt){
    var item = $(evt.currentTarget);
    removeAlertFromStorage(item);
    removeAlertFromList(item);
  }

  function removeAlertFromStorage(item){
    var value = item.attr('data-alert-value');
    chromeService.storage.removeAlert(value);
  }

  function removeAlertFromList(item){
    item.remove();
    if(wasLastItemRemoved())
      hideAlertListContainerElement();
  }

  function wasLastItemRemoved(){
    return $('li', alertListElement).length === 0;
  }

  function hideAlertListContainerElement(){
    alertListContainerElement.addClass('is-hidden');
  }

  function getCurrentUSDValue() {
    setCurrentUSDValueLoaderMessage();
    currencyService.getCurrentUSDValue()
      .then(onGetCurrentUSDValueSuccess)
      .fail(onGetCurrentUSDValueFail);
  }

  function setCurrentUSDValueLoaderMessage(){
    currentUSDValueElement.text(CURRENT_USD_VALUE.LOADER_MESSAGE);
  }

  function onGetCurrentUSDValueSuccess(response){
    setupCurrentUSDValue(response.currentValue);
    setupCurrentUSDVariation(response.currentVariation);
  }

  function setupCurrentUSDValue(value){
    currentUSDValueElement.text(value);
  }

  function setupCurrentUSDVariation(variation) {
    var variationType = isPositiveVariation(variation) ? 'positive' : 'negative';
    currentUSDValueVariationElement.text(variation);
    setCurrentUSDVariationStyle(variationType);
  }

  function isPositiveVariation(variation) {
    return parseFloat(variation) >= 0;
  }

  function setCurrentUSDVariationStyle(variationType){
    var availableCssClasses = CURRENT_USD_VALUE.VARIATION.CSS_CLASS;
    currentUSDValueVariationElement
      .removeClass([availableCssClasses.POSITIVE, availableCssClasses.NEGATIVE].join(' '));
    if(variationType == 'positive')
      currentUSDValueVariationElement.addClass(CURRENT_USD_VALUE.VARIATION.CSS_CLASS.POSITIVE);
    else
      currentUSDValueVariationElement.addClass(CURRENT_USD_VALUE.VARIATION.CSS_CLASS.NEGATIVE);
  }

  function onGetCurrentUSDValueFail() {
    currentUSDValueElement
      .text(CURRENT_USD_VALUE.FAIL.MESSAGE)
      .addClass(CURRENT_USD_VALUE.FAIL.CSS_CLASS);
  }

  function openAuthorWebsite(){
    window.open(AUTHOR_WEBSITE_URL, '_blank');
  }

  function onAlertValueInputChange(){
    var value = getAlertValueEntered();
    if(value)
      enableSaveButton();
    else
      disableSaveButton();
  }

  window.popup = _public;

  document.addEventListener('DOMContentLoaded', _public.init);

}(jQuery, window.chromeService, window.currencyService));
