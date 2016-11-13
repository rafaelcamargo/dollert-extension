describe('Notifier Service', function(){

  var stubStorageGetAlerts,
    stubAlarmsGet,
    rawFunctions;

  beforeEach(function(){
    rawFunctions = {
      chromeServiceStorageGetAlerts: chromeService.storage.getAlerts,
      chromeServiceAlarmsGet: chromeService.alarms.get
    };

    stubStorageGetAlerts = function(resolvedResponse){
      chromeService.storage.getAlerts = function(){
        return {
          then: function(callback){
            callback(resolvedResponse);
          }
        };
      };
    };

    stubAlarmsGet = function(resolvedResponse){
      chromeService.alarms.get = function(){
        return {
          then: function(callback){
            callback(resolvedResponse);
          }
        };
      };
    };
  });

  afterEach(function(){
    chromeService.storage.getAlerts = rawFunctions.chromeServiceStorageGetAlerts;
    chromeService.alarms.get = rawFunctions.chromeServiceAlarmsGet;
  });

  it('should set listeners on module initialisation', function(){
    spyOn(chromeService.alarms, 'addListener');
    spyOn(chromeService.storage, 'onChanged');

    notifierService.init();
    expect(chromeService.alarms.addListener).toHaveBeenCalledWith(jasmine.any(Function));
    expect(chromeService.storage.onChanged).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should check saved alerts on module initialisation', function(){
    stubStorageGetAlerts([]);
    spyOn(chromeService.storage, 'getAlerts').and.callThrough();

    notifierService.init();
    expect(chromeService.storage.getAlerts).toHaveBeenCalled();
  });

  it('should schedule currency service request when there is some alert stored', function(){
    stubStorageGetAlerts([3.60]);
    stubAlarmsGet(undefined);
    spyOn(chromeService.alarms, 'create');

    notifierService.init();
    expect(chromeService.alarms.create).toHaveBeenCalledWith('dollertAlarm', {
      periodInMinutes: 1
    });
  });

  it('should not schedule currency service request when there is some alert already created', function(){
    stubStorageGetAlerts([3.60]);
    stubAlarmsGet({});
    spyOn(chromeService.alarms, 'create');

    notifierService.init();
    expect(chromeService.alarms.create).not.toHaveBeenCalled();
  });

  it('should request USD exchange value on module initialisation when there is some alert stored', function(){
    spyOn(currencyService, 'getCurrentUSDValue').and.returnValue({
      then: function(){}
    });
    chromeService.alarms.addListener = function(callback){
      callback();
    };

    notifierService.init();
    expect(currencyService.getCurrentUSDValue).toHaveBeenCalled();
  });

  it('should clear schedule on module initialisation when there is no alert stored', function(){
    spyOn(chromeService.alarms, 'clear');
    chromeService.storage.onChanged = function(callback){
      callback({});
    };

    notifierService.init();
    expect(chromeService.alarms.clear).toHaveBeenCalledWith('dollertAlarm');
  });

  it('should schedule USD exchange value request on module initialisation when there is alert stored', function(){
    spyOn(chromeService.alarms, 'create');
    spyOn(chromeService.alarms, 'get').and.returnValue({
      then: function(callback){
        callback();
      }
    });
    chromeService.storage.onChanged = function(callback){
      callback({
        dollerts: [3.60]
      });
    };

    notifierService.init();
    expect(chromeService.alarms.get).toHaveBeenCalledWith('dollertAlarm');
    expect(chromeService.alarms.create).toHaveBeenCalledWith('dollertAlarm', {
      periodInMinutes: 1
    });
  });

  it('should notify user when current USD exchange value matches any previous stored value', function(){
    spyOn(currencyService, 'getCurrentUSDValue').and.returnValue({
      then: function(callback){
        callback({
          currentValue: '3.60'
        });
      }
    });
    spyOn(chromeService.storage, 'getAlerts').and.returnValue({
      then: function(callback){
        callback([3.55, 3.60]);
      }
    });
    spyOn(chromeService.notification, 'show');
    chromeService.alarms.addListener = function(callback){
      callback();
    };

    notifierService.init();
    expect(chromeService.notification.show).toHaveBeenCalledWith(3.6);
  });

  it('should not notify user when current USD exchange value doesnt matches any previous stored value', function(){
    spyOn(currencyService, 'getCurrentUSDValue').and.returnValue({
      then: function(callback){
        callback({
          currentValue: '3.25'
        });
      }
    });
    spyOn(chromeService.storage, 'getAlerts').and.returnValue({
      then: function(callback){
        callback([3.55, 3.60]);
      }
    });
    spyOn(chromeService.notification, 'show');
    chromeService.alarms.addListener = function(callback){
      callback();
    };

    notifierService.init();
    expect(chromeService.notification.show).not.toHaveBeenCalled();
  });

});
