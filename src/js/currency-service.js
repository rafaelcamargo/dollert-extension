(function($){

  var RESOURCE_URL =  'https://economia.awesomeapi.com.br/json/USD-BRL/';

  var _public = {};

  _public.getCurrentUSDValue = function() {
    var promise = $.Deferred();
    $.ajax({
      url: RESOURCE_URL,
      'content-type': 'application/json',
      success: function(response){
        promise.resolve(parseResponse(response));
      },
      error: function(response){
        promise.reject(response);
      }
    });
    return promise;
  };

  function parseResponse(response){
    return {
      currentValue: response[0].bid.substring(0,4),
      currentVariation: response[0].pctChange.substring(0,4) + '%'
    };
  }

  window.currencyService = _public;

})(jQuery);
