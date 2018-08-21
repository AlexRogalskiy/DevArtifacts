using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class Build
    {
        private Action[] actions;
        private Artifact[] artifacts;
        //private ChangeSet changeSet;
        //private UserDetails[] culprits;
        private string displayName;
        private TimeSpan? duration;
        private TimeSpan? estimatedDuration;
        private string id;
        private bool isBuilding;
        private BuildJob job;
        private bool keepLog;
        private int number;
        private BuildStatus status;
        //private JenkinsTestReport testReport;
        private DateTime? timeStamp;
        public string url;
    }
}
