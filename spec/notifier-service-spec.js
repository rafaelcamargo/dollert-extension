describe('Notifier Service', function(){

  var stubStorageGetAlerts,
    stubAlarmsGet;

  beforeEach(function(){
    stubStorageGetAlerts = function(resolvedResponse){
      chromeService.storage.getAlerts = function(){
        return {
          then: function(callback){
            callback(resolvedResponse);
          }
        }
      }
    };

    stubAlarmsGet = function(resolvedResponse){
      chromeService.alarms.get = function(){
        return {
          then: function(callback){
            callback(resolvedResponse);
          }
        }
      }
    }
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

});
