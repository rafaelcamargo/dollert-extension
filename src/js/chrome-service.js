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
    lastAlertNotifiedKey: 'dollertLastNotified',
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
      var key = this.defaultKey;
      this.get(key, function(response){
        var storageItem = _public.storage.getStorageItem(key, response, []);
        if(!_public.storage.isAlertAlreadySaved(storageItem[key], value))
          storageItem[key].push(value);
        _public.storage.set(storageItem);
      });
    },
    addAlertLastNotified: function(alertDetails){
      var key = this.lastAlertNotifiedKey;
      this.get(key, function(response){
        var storageItem = _public.storage.getStorageItem(key, response, {});
        storageItem[key] = alertDetails;
        _public.storage.set(storageItem);
      });
    },
    removeAlert: function(value){
      this.get(this.defaultKey, function(response){
        var key = _public.storage.defaultKey;
        var storageItem = _public.storage.getStorageItem(key, response);
        for (var i = 0; i < storageItem[key].length; i++)
          if(storageItem[key][i] === parseFloat(value))
            storageItem[key].splice(i, 1);
        if(storageItem[key].length)
          _public.storage.set(storageItem);
        else
          _public.storage.remove(key);
      });
    },
    getLastNotifiedAlert: function(){
      return this.getAlerts('lastnotified');
    },
    getAlerts: function(alertType){
      var promise = $.Deferred();
      var alertProperties = this.getAlertProperties(alertType);
      this.get(alertProperties.key, function(response){
        var storageItem = _public.storage.getStorageItem(alertProperties.key, response, alertProperties.type);
        promise.resolve(storageItem[alertProperties.key]);
      });
      return promise;
    },
    getStorageItem: function(key, response, itemType){
      var storageItem = response || {};
      storageItem[key] = storageItem[key] || itemType;
      return storageItem;
    },
    getAlertProperties: function(alertType){
      var properties = {
        key: this.defaultKey,
        type: []
      };
      if(alertType == 'lastnotified'){
        properties.key = this.lastAlertNotifiedKey;
        properties.type = {};
      }
      return properties;
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
