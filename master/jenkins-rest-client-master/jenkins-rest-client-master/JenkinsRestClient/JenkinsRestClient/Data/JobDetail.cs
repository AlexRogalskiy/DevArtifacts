using System.Collections.Generic;

namespace JenkinsRestClient.Data
{
    public class JobDetail : Job
    {
        public string DisplayName{ get; set; }
        public string DisplayNameOrNull{ get; set; }
        public List<Build> Builds { get; set; }
    }
}