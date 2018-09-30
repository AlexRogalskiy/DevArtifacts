function Settings(lastUpdate, fromCurrency, toCurrency)
{
   var _db = window.localStorage;
   var _tableName = 'settings';

   this.lastUpdate = lastUpdate;
   this.fromCurrency = fromCurrency;
   this.toCurrency = toCurrency;

   this.save = function()
   {
      _db.setItem(_tableName, JSON.stringify(this));
   }

   this.load = function()
   {
      return JSON.parse(_db.getItem(_tableName));
   }
}

Settings.getSettings = function()
{
   var settings = new Settings().load();
   return (settings === null) ?
      {} :
      new Settings(
         settings.lastUpdate,
         settings.fromCurrency,
         settings.toCurrency
      );
}