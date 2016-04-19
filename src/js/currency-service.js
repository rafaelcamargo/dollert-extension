(function($){

  var RESOURCE_URL =  'http://developers.agenciaideias.com.br/cotacoes/json';

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
      currentValue: response.dolar.cotacao.substring(0,4),
      currentVariation: response.dolar.variacao.substring(0,5) + '%'
    };
  }

  window.currencyService = _public;

})(jQuery);
