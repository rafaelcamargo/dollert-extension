(function(){

  'use strict';

  var _public = {};

  _public.alarms = {
    clear: function(){},
    create: function(){},
    get: function(){},
    onAlarm: {
      addListener: function(){}
    }
  };

  _public.storage = {
    onChanged: {
      addListener: function(){}
    },
    sync: {
      get: function(){},
      remove: function(){},
      set: function(){},
    }
  };

  window.chrome = _public;

})();
