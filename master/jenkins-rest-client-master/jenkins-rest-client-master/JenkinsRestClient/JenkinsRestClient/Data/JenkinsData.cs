using System.Collections.Generic;

namespace JenkinsRestClient.Data
{
    public class JenkinsData
    {
        public string Mode { get; set; }
        public List<Job> Jobs { get; set; }
        public string NodeDescription { get; set; }
        public string NodeName { get; set; }
        public int NumExecutors { get; set; }
        public string Description { get; set; }
    }
}