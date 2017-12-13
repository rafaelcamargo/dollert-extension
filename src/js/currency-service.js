(function($){

  var RESOURCE_URL =  'https://dollert-api.wedeploy.io/rates';

  var _public = {};

  _public.getCurrentUSDValue = function() {
    var promise = $.Deferred();
    $.ajax({
      url: RESOURCE_URL,
      'content-type': 'application/json',
      success: function(response){
        promise.resolve(response[0]);
      },
      error: function(err){
        promise.reject(err);
      }
    });
    return promise;
  };

  window.currencyService = _public;

}(jQuery));
