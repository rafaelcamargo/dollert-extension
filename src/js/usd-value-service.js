(function($){

  var USD_VALUE_RESOURCE_URL =  'http://developers.agenciaideias.com.br' +
                                '/cotacoes/json';

  var _public = {};

  _public.getCurrentValue = function() {
    var promise = $.Deferred();
    $.ajax({
      url: USD_VALUE_RESOURCE_URL,
      'content-type': 'application/json',
      success: function(response){
        promise.resolve(response);
      },
      error: function(response){
        promise.reject(response);
      }
    });
    return promise;
  };

  window.usdValueService = _public;

})(jQuery);
