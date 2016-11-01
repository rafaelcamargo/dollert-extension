describe('Notifier Service', function(){

  it('should set listeners on module initialisation', function(){
    spyOn(chromeService.alarms, 'addListener');
    spyOn(chromeService.storage, 'onChanged');

    notifierService.init();
    expect(chromeService.alarms.addListener).toHaveBeenCalledWith(jasmine.any(Function));
    expect(chromeService.storage.onChanged).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should check saved alerts on module initialisation', function(){
    spyOn(chromeService.storage, 'getAlerts').and.returnValue({
      then: function(){}
    });

    notifierService.init();
    expect(chromeService.storage.getAlerts).toHaveBeenCalled();
  });

  it('should request USD exchange value', function(){
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
