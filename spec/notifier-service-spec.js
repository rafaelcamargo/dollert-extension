describe('Notifier Service', function(){

  var THIRTY_MINUTES_IN_MILLISECONDS = 1800000;
  var ONE_MINUTE_IN_MILLISECONDS = 60000;

  var rawFunctions,
    triggerStorageChange,
    triggerDollertAlarm,
    mockPromiseResponse;

  beforeEach(function(){
    rawFunctions = {
      chromeServiceStorageOnChanged: chromeService.storage.onChanged,
      chromeServiceAlarmsAddListener: chromeService.alarms.addListener
    };

    triggerDollertAlarm = function(){
      chromeService.alarms.addListener = function(callback){
        callback();
      };
      notifierService.init();
    };

    triggerStorageChange = function(storage){
      chromeService.storage.onChanged = function(callback){
        callback(storage);
      };
      notifierService.init();
    };

    mockPromiseResponse = function(object, method, response){
      spyOn(object, method).and.returnValue({
        then: function(callback){
          callback(response);
        }
      });
    };
  });

  afterEach(function(){
    chromeService.storage.onChanged = rawFunctions.chromeServiceStorageOnChanged;
    chromeService.alarms.addListener = rawFunctions.chromeServiceAlarmsAddListener;
  });

  it('should set listeners on module initialisation', function(){
    spyOn(chromeService.alarms, 'addListener');
    spyOn(chromeService.storage, 'onChanged');

    notifierService.init();
    expect(chromeService.alarms.addListener).toHaveBeenCalledWith(jasmine.any(Function));
    expect(chromeService.storage.onChanged).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should check saved alerts on module initialisation', function(){
    mockPromiseResponse(chromeService.storage, 'getAlerts', []);

    notifierService.init();
    expect(chromeService.storage.getAlerts).toHaveBeenCalled();
  });

  it('should schedule currency service request when there is some alert stored', function(){
    mockPromiseResponse(chromeService.storage, 'getAlerts', [3.60]);
    mockPromiseResponse(chromeService.alarms, 'get', undefined);
    spyOn(chromeService.alarms, 'create');

    notifierService.init();
    expect(chromeService.alarms.create).toHaveBeenCalledWith('dollertAlarm', {
      periodInMinutes: 1
    });
  });

  it('should not schedule currency service request when there is some alert already created', function(){
    mockPromiseResponse(chromeService.storage, 'getAlerts', [3.60]);
    mockPromiseResponse(chromeService.alarms, 'get', {});
    spyOn(chromeService.alarms, 'create');

    notifierService.init();
    expect(chromeService.alarms.create).not.toHaveBeenCalled();
  });

  it('should add an alarm listener on module initialisation', function(){
    spyOn(chromeService.alarms, 'addListener');

    notifierService.init();
    expect(chromeService.alarms.addListener).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should add a storage change listener on module initialisation', function(){
    spyOn(chromeService.storage, 'onChanged');

    notifierService.init();
    expect(chromeService.storage.onChanged).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should clear dollert alarm when there is no more alert lefting in storage', function(){
    spyOn(chromeService.alarms, 'clear');

    triggerStorageChange({});
    expect(chromeService.alarms.clear).toHaveBeenCalledWith('dollertAlarm');
  });

  it('should create a dollert alarm when some alert is stored and there is no alarm created yet', function(){
    spyOn(chromeService.alarms, 'create');
    mockPromiseResponse(chromeService.alarms, 'get', null);

    triggerStorageChange({
      dollerts: [3.60]
    });
    expect(chromeService.alarms.create).toHaveBeenCalledWith('dollertAlarm', {
      periodInMinutes: 1
    });
  });

  it('should not create a dollert alarm when some alert is stored and there is a alarm already created', function(){
    spyOn(chromeService.alarms, 'create');
    mockPromiseResponse(chromeService.alarms, 'get', {});

    triggerStorageChange({
      dollerts: [3.60]
    });
    expect(chromeService.alarms.create).not.toHaveBeenCalled();
  });

  it('should notify user when current USD exchange value matches any previous stored value', function(){
    mockPromiseResponse(currencyService, 'getCurrentUSDValue', {
      currentValue: '3.60'
    });
    mockPromiseResponse(chromeService.storage, 'getAlerts', [3.55, 3.60]);
    mockPromiseResponse(chromeService.storage, 'getLastNotifiedAlert', {});
    spyOn(chromeService.notification, 'show');
    spyOn(chromeService.storage, 'addAlertLastNotified');

    triggerDollertAlarm();
    expect(chromeService.notification.show).toHaveBeenCalledWith(3.6);
    expect(chromeService.storage.addAlertLastNotified).toHaveBeenCalledWith({
      value: 3.6,
      time: jasmine.any(Number)
    });
  });

  it('should not notify user when current USD exchange value doesnt matches any previous stored value', function(){
    mockPromiseResponse(currencyService, 'getCurrentUSDValue', {
      currentValue: '3.25'
    });
    mockPromiseResponse(chromeService.storage, 'getAlerts', [3.55, 3.60]);
    mockPromiseResponse(chromeService.storage, 'getLastNotifiedAlert', {});
    spyOn(chromeService.notification, 'show');

    triggerDollertAlarm();
    expect(chromeService.notification.show).not.toHaveBeenCalled();
  });

  it('should not notify user when current USD matches the latest notified value and user got notified about it in the last 30 minutes', function(){
    mockPromiseResponse(currencyService, 'getCurrentUSDValue', {
      currentValue: '2.99'
    });
    mockPromiseResponse(chromeService.storage, 'getAlerts', [2.99, 3.60]);
    mockPromiseResponse(chromeService.storage, 'getLastNotifiedAlert', {
      value: '2.99',
      time: new Date().getTime() - THIRTY_MINUTES_IN_MILLISECONDS + ONE_MINUTE_IN_MILLISECONDS
    });
    spyOn(chromeService.notification, 'show');

    triggerDollertAlarm();
    expect(chromeService.notification.show).not.toHaveBeenCalled();
  });

  it('should notify user when current USD matches the latest notified value and user didn\'t got notified about it for more than 30 minutes', function(){
    mockPromiseResponse(currencyService, 'getCurrentUSDValue', {
      currentValue: '2.99'
    });
    mockPromiseResponse(chromeService.storage, 'getAlerts', [2.99, 3.60]);
    mockPromiseResponse(chromeService.storage, 'getLastNotifiedAlert', {
      value: '2.99',
      time: new Date().getTime() - THIRTY_MINUTES_IN_MILLISECONDS - ONE_MINUTE_IN_MILLISECONDS
    });
    spyOn(chromeService.notification, 'show');
    spyOn(chromeService.storage, 'addAlertLastNotified');

    triggerDollertAlarm();
    expect(chromeService.notification.show).toHaveBeenCalledWith(2.99);
    expect(chromeService.storage.addAlertLastNotified).toHaveBeenCalledWith({
      value: 2.99,
      time: jasmine.any(Number)
    });
  });

});
