using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class JenkinsServerInfo
    {
        public string JenkinsServer { get; set; }
        public bool RequiresAuthentication => !(string.IsNullOrEmpty(UserName) && string.IsNullOrEmpty(ApiToken));
        public string UserName { get; set; }
        public string ApiToken { get; set; }
    }
}
