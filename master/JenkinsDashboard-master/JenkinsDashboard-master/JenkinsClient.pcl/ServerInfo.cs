﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class ServerInfo
    {
        public class AssignedLabel
        {
        }

        public class OverallLoad
        {
        }

        public class PrimaryView
        {
            public string name { get; set; }
            public string url { get; set; }
        }

        public class UnlabeledLoad
        {
        }

        public class View
        {
            public string name { get; set; }
            public string url { get; set; }
        }

            public List<AssignedLabel> assignedLabels { get; set; }
            public string mode { get; set; }
            public string nodeDescription { get; set; }
            public string nodeName { get; set; }
            public int numExecutors { get; set; }
            public object description { get; set; }
            public List<BuildJob> jobs { get; set; }
            public OverallLoad overallLoad { get; set; }
            public PrimaryView primaryView { get; set; }
            public bool quietingDown { get; set; }
            public int slaveAgentPort { get; set; }
            public UnlabeledLoad unlabeledLoad { get; set; }
            public bool useCrumbs { get; set; }
            public bool useSecurity { get; set; }
            public List<View> views { get; set; }
    }
}
