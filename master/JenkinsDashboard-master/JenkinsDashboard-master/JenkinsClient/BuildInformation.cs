using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class BuildInformation
    {
            public List<Action> actions { get; set; }
            public List<Artifact> artifacts { get; set; }
            public bool building { get; set; }
            public object description { get; set; }
            public string displayName { get; set; }
            public int duration { get; set; }
            public int estimatedDuration { get; set; }
            public object executor { get; set; }
            public string fullDisplayName { get; set; }
            public string id { get; set; }
            public bool keepLog { get; set; }
            public int number { get; set; }
            public int queueId { get; set; }
            public string result { get; set; }
            public long timestamp { get; set; }
            public string url { get; set; }
            public string builtOn { get; set; }
            //public ChangeSet changeSet { get; set; }
            //public List<Culprit> culprits { get; set; }
    }

    public class Artifact
    {
        public string displayPath { get; set; }
        public string fileName { get; set; }
        public string relativePath { get; set; }
    }
}
