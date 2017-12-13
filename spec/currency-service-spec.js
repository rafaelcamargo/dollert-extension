describe('Currency Service', function(){

  var CURRENT_USD_VALUE_SUCCESS_RESPONSE = [{
    "currentValue": "3.25",
    "currentVariation": "-0.5%"
  }];
  var CURRENT_USD_VALUE_ERROR_RESPONSE = 'failed to get current USD value';

  var rawFunctions;

  beforeEach(function(){
    rawFunctions = {
      jquery: window.$
    };
  });

  afterEach(function(){
    window.$ = rawFunctions.jquery;
  });

  it('should request current USD value', function(){
    spyOn($, 'ajax');
    currencyService.getCurrentUSDValue();
    expect($.ajax).toHaveBeenCalledWith({
      url: 'https://dollert-api.wedeploy.io/rates',
      'content-type': 'application/json',
      success: jasmine.any(Function),
      error: jasmine.any(Function)
    });
  });

  it('should return a promise when requesting current USD value', function(){
    spyOn($, 'ajax');

    var promise = currencyService.getCurrentUSDValue();

    expect(promise.reject).toBeDefined();
    expect(promise.resolve).toBeDefined();
  });

  it('should parse response when get current USD value successfully', function(){
    $.ajax = function(params){
      params.success(CURRENT_USD_VALUE_SUCCESS_RESPONSE);
    };

    var parsedData;
    var promise = currencyService.getCurrentUSDValue();

    promise.then(function(response){
      parsedData = response;
    });

    expect(parsedData).toEqual({
      currentValue: '3.25',
      currentVariation: '-0.5%'
    });
  });

  it('should reject promise when failing to get current USD value', function(){
    $.ajax = function(params){
      params.error(CURRENT_USD_VALUE_ERROR_RESPONSE);
    };

    var errorMessage;
    var promise = currencyService.getCurrentUSDValue();

    promise.fail(function(response){
      errorMessage = response;
    });

    expect(errorMessage).toEqual(CURRENT_USD_VALUE_ERROR_RESPONSE);
  });

});
