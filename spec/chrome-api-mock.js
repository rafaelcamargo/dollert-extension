(function(){

  'use strict';

  window.ChromeApiMock = function(){
    this.alarms = {
      clear: function(){},
      create: function(){},
      get: function(){},
      onAlarm: {
        addListener: function(){}
      }
    };

    this.storage = {
      onChanged: {
        addListener: function(){}
      },
      sync: {
        get: function(){},
        remove: function(){},
        set: function(){},
      }
    };
  };

  window.chrome = new ChromeApiMock();

})();
