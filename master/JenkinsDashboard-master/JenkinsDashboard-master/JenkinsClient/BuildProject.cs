using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class BuildJob
    {
        public List<Action> actions { get; set; }
        public string description { get; set; }
        public string displayName { get; set; }
        public object displayNameOrNull { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public bool buildable { get; set; }
        public List<Build> builds { get; set; }
        public string color { get; set; }
        public Build firstBuild { get; set; }
        public List<HealthReport> healthReport { get; set; }
        public bool inQueue { get; set; }
        public bool keepDependencies { get; set; }
        public Build lastBuild { get; set; }
        public Build lastCompletedBuild { get; set; }
        public Build lastFailedBuild { get; set; }
        public Build lastStableBuild { get; set; }
        public Build lastSuccessfulBuild { get; set; }
        public Build lastUnstableBuild { get; set; }
        public Build lastUnsuccessfulBuild { get; set; }
        public int nextBuildNumber { get; set; }
        public List<Property> property { get; set; }
        public object queueItem { get; set; }
        public bool concurrentBuild { get; set; }
        public Scm scm { get; set; }
        public List<object> upstreamProjects { get; set; }
    }




    public class Scm
    {
    }

    public class Action
    {
        
    }


    public class Property
    {
    }
}
