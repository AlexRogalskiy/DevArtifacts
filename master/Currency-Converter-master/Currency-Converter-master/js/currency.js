function Currency(abbreviation, rate)
{
   var _db = window.localStorage;
   var _tableName = 'currencies';

   this.abbreviation = abbreviation;
   this.rate = rate;

   this.save = function()
   {
      var currencyIndex = Currency.getIndex(this.abbreviation);
      var currencies = Currency.getCurrencies();

      if (currencyIndex === false)
         currencies.push(this);
      else
         currencies[currencyIndex] = this;

      _db.setItem(_tableName, JSON.stringify(currencies));
   }

   this.load = function()
   {
      return JSON.parse(_db.getItem(_tableName));
   }
}

Currency.prototype.compareTo = function(other)
{
   return Currency.compare(this, other);
}

Currency.compare = function(currency, other)
{
   if (other == null)
      return 1;
   else if (currency == null)
      return -1;

   return currency.abbreviation.localeCompare(other.abbreviation);
}

Currency.getCurrencies = function()
{
   var currencies = new Currency().load();
   return (currencies === null) ? [] : currencies;
}

Currency.getCurrency = function(abbreviation)
{
   var index = Currency.getIndex(abbreviation);
   return (index === false) ? null : Currency.getCurrencies()[index];
}

Currency.getIndex = function(abbreviation)
{
   var currencies = Currency.getCurrencies();
   for(var i = 0; i < currencies.length; i++)
   {
      if (currencies[i].abbreviation.toUpperCase() === abbreviation.toUpperCase())
         return i;
   }

   return false;
}

Currency.getRate = function(abbreviation)
{
   var currency = Currency.getCurrency(abbreviation);
   return (currency === null) ? 0 : currency.rate;
}

Currency.convert = function(value, from, to)
{
   // Round up to the 2nd decimal
   return Math.round(value / Currency.getRate(from) * Currency.getRate(to) * 100) / 100;
}