$(document).on(
   'mobileinit',
   function()
   {
      // Page Loader Widget
      $.mobile.loader.prototype.options.text = 'Loading...';
      $.mobile.loader.prototype.options.textVisible = true;

      // Bypass Access-Control-Allow-Origin
      $.support.cors = true;
      $.mobile.allowCrossDomainPages = true;

      // Theme
      $.mobile.page.prototype.options.theme  = 'b';
      $.mobile.page.prototype.options.headerTheme = 'b';
      $.mobile.page.prototype.options.contentTheme = 'b';
      $.mobile.page.prototype.options.footerTheme = 'b';
      $.mobile.page.prototype.options.backBtnTheme = 'b';
   }
);