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
    newUSDValueElement,
    saveButton;

  function init(){
    storeElements();
    bindElementsEvents();
    getSavedAlerts();
    getCurrentUSDValue();
  }

  function storeElements(){
    saveButton = $('[data-js="button-save"]');
    currentUSDValueElement = $('[data-js="currency-current-value"');
    currentUSDValueVariationElement = $('[data-js="currency-current-value-variation"');
    newUSDValueElement = $('[data-js="usd-value"]');
    alertListContainer = $('[data-js="alert-list-container"');
    alertList = $('[data-js="alert-list"');
  }

  function bindElementsEvents(){
    saveButton.on('click', onButtonSaveClick);
    newUSDValueElement.on('change paste keyup', onUSDValueChange);
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
    var validUSDValue = (getUSDValueEntered() !== false);
    setSaveButtonEnabled(validUSDValue);
  }

  function onButtonSaveClick(){
    var enteredUSDValue = getUSDValueEntered();
    if (enteredUSDValue === false)
      return;
    enteredUSDValue = parseFloat(enteredUSDValue);
    addUSDValueToAlertsList(enteredUSDValue);
    chromeService.storage.addAlert(enteredUSDValue);
  }

  function getUSDValueEntered(){
    var enteredValue = newUSDValueElement.val().replace(',', '.');
    if (enteredValue.match(/^[0-9]+(\.[0-9]+)?$/))
      return enteredValue;
    return false;
  }

  function setSaveButtonEnabled(enabled){
    saveButton.toggleClass('disabled', !enabled);
    saveButton.prop('disabled', !enabled);
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

})(jQuery, window.chromeService, window.currencyService);
