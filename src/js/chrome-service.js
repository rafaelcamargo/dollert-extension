(function(){

  var _public = {};

  _public.alarms = {
    create: function(id, options){
      chrome.alarms.create(id, options);
    },
    addListener: function(callback){
      chrome.alarms.onAlarm.addListener(callback);
    },
    get: function(id, callback){
      var promise = $.Deferred();
      callback = callback || function(response){
        promise.resolve(response);
      };
      chrome.alarms.get(id, callback);
      return promise;
    },
    clear: function(id, callback){
      callback = callback || function(){};
      chrome.alarms.clear(id, callback);
    }
  };

  _public.storage = {
    defaultKey: 'dollerts',
    get: function(item, callback){
      this.handleStorage('get', item, callback);
    },
    set: function(item, callback){
      this.handleStorage('set', item, callback);
    },
    remove: function(item, callback){
      this.handleStorage('remove', item, callback);
    },
    handleStorage: function(method, item, callback){
      callback = callback || function(){};
      chrome.storage.sync[method](item, callback);
    },
    isAlertAlreadySaved: function(previousValues, value){
      for (var i = 0; i < previousValues.length; i++)
        if(previousValues[i] === value)
          return true;
    },
    addAlert: function(value){
      this.get(this.defaultKey, function(response){
        var key = _public.storage.defaultKey;
        var storageItem = _public.storage.getStorageItem(response);
        if(!_public.storage.isAlertAlreadySaved(storageItem[key], value))
          storageItem[key].push(value);
        _public.storage.set(storageItem);
      });
    },
    removeAlert: function(value){
      this.get(this.defaultKey, function(response){
        var key = _public.storage.defaultKey;
        var storageItem = _public.storage.getStorageItem(response);
        for (var i = 0; i < storageItem[key].length; i++)
          if(storageItem[key][i] === parseFloat(value))
            storageItem[key].splice(i, 1);
        if(storageItem[key].length)
          _public.storage.set(storageItem);
        else
          _public.storage.remove(key);
      });
    },
    getAlerts: function(){
      var promise = $.Deferred();
      this.get(this.defaultKey, function(response){
        var key = _public.storage.defaultKey;
        var storageItem = _public.storage.getStorageItem(response);
        promise.resolve(storageItem[key]);
      });
      return promise;
    },
    getStorageItem: function(response){
      var key = this.defaultKey;
      var storageItem = response || {};
      storageItem[key] = storageItem[key] || [];
      return storageItem;
    },
    onChanged: function(callback){
      chrome.storage.onChanged.addListener(callback);
    }
  };

  _public.notification = {
    show: function(currentUSDValue){
      var details = this.build(currentUSDValue);
      return new Notification(details.title, details.options);
    },
    build: function(currentUSDValue){
      return {
        title: '1 USD = ' + currentUSDValue + ' BRL',
        options: {
          icon: 'icon_128x128.png'
        }
      };
    }
  };

  window.chromeService = _public;

}());
