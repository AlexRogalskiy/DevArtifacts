/**
 * jQuery Typorize
 *
 * A simple style injector for advanced typography.
 *
 * This plugin was inspired by the "lettering.js" that can be found at
 * http://letteringjs.com/
 *
 * @author Oliver Musebrink
 * @link http://www.olivermusebrink.de/
 * @copyright Licensed under the GPL Version 2 license
 * @version 1.0
 */
;(function ($)
{
    /**
     * Initializes the plugin.
     *
     * @param object opts The options
     *
     * @return object The object (to maintain chainability)
     */
    $.fn.typorize = function (opts)
    {
        // Default options
        var defaults = {
            type:           'letters',
            className:      '',
            spaceClassName: 'space'
        };

        // Extend options
        var options = $.extend(true, {}, defaults, opts);

        return this.each(function ()
        {
            // Container
            var container = $(this);

            // Content
            var content;

            // Settings
            var splitExpr,
                className;

            // Content
            switch(options.type)
            {
                case 'lines':

                    // Content
                    content = container.html();

                    // Replace uppercase tags with lowercase tags
                    content = content.replace(/<\/?[a-zA-Z0-9]+.*?>/g, function (str) { return str.toLowerCase(); });

                    // Settings
                    splitExpr = '<br>';
                    className = 'line';

                break;

                case 'words':

                    // Content
                    content = container.text();

                    // Settings
                    splitExpr = ' ';
                    className = 'word';

                break;

                default:

                    // Content
                    content = container.text();

                    // Settings
                    splitExpr = '';
                    className = 'letter';

                break;
            }

            // Overwrite class name
            if(options.className != '')
            {
                className = options.className;
            }

            // Remove whitespace and multiple spaces
            content = content.replace(/^\s+|\s+$/g, '' );
            content = content.replace(/\s+/g,       ' ');

            // Split content
            content = content.split(splitExpr);

            // Wrap content
            var l       = content.length,
                f       = (typeof(options.className) === 'function'),
                classes,
                ch;

            // Empty container
            container.empty();

            for(var i = 0; i < l; i++)
            {
                // Get character and set class
                ch      = content[i];
                classes = (f ? options.className(i + 1, l) : (className + (i + 1)));

                // Replace space
                if(ch == ' ')
                {
                    ch       = '&nbsp;';
                    classes += ' ' + options.spaceClassName;
                }

                // Append wrapped character
                container.append(  '<span class="' + classes + '">'
                                 +     ch
                                 + '</span>');
            }

            // Return container for chaining
            return container;
        });
    };
})(jQuery);