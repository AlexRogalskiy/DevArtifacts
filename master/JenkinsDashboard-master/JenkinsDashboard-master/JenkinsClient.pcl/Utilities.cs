using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    internal class Utilities
    {
        static string apiString = "/api/json";

        internal static string AddApiToUrl(string url)
        {
            if (url.EndsWith("/"))
                url.TrimEnd('/');

            if (url.EndsWith(apiString))
                return url;
            else
                return string.Concat(url, apiString);
        }

        //internal static Uri AddApiToUri(Uri url)
        //{
        //    if (url.EndsWith("/"))
        //        url.TrimEnd('/');

        //    if (url.EndsWith(apiString))
        //        return url;
        //    else
        //        return string.Concat(url, apiString);
        //}
    }
}
