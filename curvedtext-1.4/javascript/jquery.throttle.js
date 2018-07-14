/**
 * jQuery Throttle
 *
 * Throttled functions.
 *
 * @author Oliver Musebrink
 * @link http://www.olivermusebrink.de/
 * @copyright Licensed under the GPL Version 2 license
 * @version 1.0
 */
;(function ($)
{
    /**
     * Returns a throttled function.
     *
     * @param function fn The function to execute
     *
     * @param number timeout The timeout
     *
     * @param boolean trailing Trailing
     *
     * @return function The throttled function
     */
    $.throttle = function (fn, timeout, trailing)
    {
        // Throttled function
        var throttledFn = function ()
        {
            // Execute
            var execute = function ()
            {
                // Set timeout
                wait = window.setTimeout(clear, timeout);

                // Call function
                fn.apply(this, args);
            }

            // Clear
            var clear = function ()
            {
                // Clear timeout
                wait = 0;

                // Trail
                if(trail)
                {
                    trail = false;
                    execute();
                }
            }

            // Arguments
            var args = arguments;

            // Execute
            if(!wait)
            {
                execute();
            }

            // Trailing
            else if(trailing)
            {
                trail = true;
            }
        };

        // Timer
        var wait = 0;

        // Trail
        var trail = false;

        // Allow throttled function to be removed with "unbind"
        if($.guid)
        {
            // GUID
            throttledFn.guid = throttledFn.guid || $.guid++;
        }

        return (timeout > 0 ? throttledFn : fn);
    };
})(jQuery);