describe('Popup', function(){

  var alertListElement,
    alertValueInputElement,
    alertListContainerElement,
    alertListItems,
    currentUSDValueElement,
    currentUSDValueVariationElement,
    saveButtonElement,
    linkCreditElement,
    insertAlert,
    getAlertListItems,
    stubCurrentUSDValueRequestReturn,
    mockCurrentUSDValueReponse,
    init;

  beforeEach(function(){
    var fixtures =  '<input data-js="alert-value">' +
                    '<button data-js="button-save" type="button"></button>' +
                    '<span data-js="currency-current-value"></span>' +
                    '<span data-js="currency-current-value-variation"></span>' +
                    '<div data-js="alert-list-container" class="is-hidden">' +
                      '<ul data-js="alert-list"></ul>' +
                    '<div>' +
                    '<span data-js="link-credit"></span>';
    setFixtures(fixtures);

    alertListElement = $('[data-js="alert-list"]');
    alertValueInputElement = $('[data-js="alert-value"]');
    alertListContainerElement = $('[data-js="alert-list-container"]');
    currentUSDValueElement = $('[data-js="currency-current-value"]');
    currentUSDValueVariationElement = $('[data-js="currency-current-value-variation"]');
    saveButtonElement = $('[data-js="button-save"]');
    linkCreditElement = $('[data-js="link-credit"]');

    insertAlert = function(alertValue){
      alertValueInputElement.val(alertValue);
      saveButtonElement.trigger('click');
    };

    getAlertListItems = function(){
      return $('li', alertListElement);
    };

    stubCurrentUSDValueRequestReturn = function(){
      var promise = $.Deferred();
      spyOn(currencyService, 'getCurrentUSDValue').and.returnValue(promise);
      return promise;
    };

    mockCurrentUSDValueReponse = function(promise, status, value, variation){
      if(status == 'success')
        promise.resolve({
          currentValue: value,
          currentVariation: variation + '%'
        });
      else
        promise.reject();
    };

    init = function(){
      popup.init();
    };

    spyOn(chromeService.storage, 'addAlert');
    spyOn(chromeService.storage, 'removeAlert');
  });

  it('should add alerts', function(){
    init();
    insertAlert('3,60');
    expect(getAlertListItems().length).toEqual(1);
    expect(chromeService.storage.addAlert).toHaveBeenCalledWith(3.6);
    insertAlert('3,45');
    expect(getAlertListItems().length).toEqual(2);
    expect(chromeService.storage.addAlert).toHaveBeenCalledWith(3.45);
  });

  it('should show alert list container when some alert is inserted', function(){
    init();
    insertAlert('3,60');
    expect(alertListContainerElement.hasClass('is-hidden')).toEqual(false);
  });

  it('should added alert have a self remove trigger label', function(){
    init();
    insertAlert('3,55');
    expect($('span', getAlertListItems()[0])[0].innerHTML).toEqual('Remove');
  });

  it('should added alert have a custom attribute containing alert value', function(){
    init();
    insertAlert('3,23');
    expect($(getAlertListItems()[0]).attr('data-alert-value')).toEqual('3.23');
  });

  it('should added alert have alert value as text', function(){
    init();
    insertAlert('3,35');
    expect($('span', getAlertListItems()[0])[1].innerHTML).toEqual('3.35');
  });

  it('should remove an existing alert', function(){
    init();
    insertAlert('3,35');
    insertAlert('3,65');
    insertAlert('3,75');
    alertListItems = getAlertListItems();
    $(alertListItems[1]).trigger('click');
    expect(chromeService.storage.removeAlert).toHaveBeenCalledWith('3.65');
  });

  it('should hide alert list container when last alert is removed', function(){
    init();
    insertAlert('3,35');
    alertListItems = getAlertListItems();
    $(alertListItems[0]).trigger('click');
    expect(alertListContainerElement.hasClass('is-hidden')).toEqual(true);
  });

  it('should show loading message when getting USD current value', function(){
    stubCurrentUSDValueRequestReturn();
    init();
    expect(currentUSDValueElement.text()).toEqual('Loading value...');
  });

  it('show show current USD exchange value on initialisation', function(){
    var promise = stubCurrentUSDValueRequestReturn();

    init();
    mockCurrentUSDValueReponse(promise, 'success', 3.65, 1.2);
    expect(currentUSDValueElement.text()).toEqual('3.65');
  });

  it('should show fail message when is not possible get current USD value on initialisation', function(){
    var promise = stubCurrentUSDValueRequestReturn();

    init();
    promise.reject();
    expect(currentUSDValueElement.text()).toEqual('Failed to get current USD value');
  });

  it('should show current USD value positive variation properly styled on initialisation', function(){
    var promise = stubCurrentUSDValueRequestReturn();

    init();
    mockCurrentUSDValueReponse(promise, 'success', 3.30, 2.35);
    expect(currentUSDValueVariationElement.text()).toEqual('2.35%');
    expect(currentUSDValueVariationElement.hasClass('is-positive')).toEqual(true);
    expect(currentUSDValueVariationElement.hasClass('is-negative')).toEqual(false);
  });

  it('should show current USD value negative variation properly styled on initialisation', function(){
    var promise = stubCurrentUSDValueRequestReturn();

    init();
    mockCurrentUSDValueReponse(promise, 'success', 3.03, -1.3);
    expect(currentUSDValueVariationElement.text()).toEqual('-1.3%');
    expect(currentUSDValueVariationElement.hasClass('is-positive')).toEqual(false);
    expect(currentUSDValueVariationElement.hasClass('is-negative')).toEqual(true);
  });

  it('should add previously saved alerts on alert list on initialisation', function(){
    var promise = $.Deferred();
    spyOn(chromeService.storage, 'getAlerts').and.returnValue(promise);

    init();
    promise.resolve([3.35, 2.98]);
    alertListItems = getAlertListItems();
    expect(alertListItems.length).toEqual(2);
  });

  it('should open author\'s website when clicking on credit link', function(){
    spyOn(window, 'open');

    init();
    linkCreditElement.trigger('click');
    expect(window.open).toHaveBeenCalledWith('https://www.rafaelcamargo.com', '_blank');
  });

});
