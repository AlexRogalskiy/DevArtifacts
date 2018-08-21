using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Dashboard.Desktop.Model
{
    [Serializable]
    public class ProjectModel :Prism.Mvvm.BindableBase
    {
        private string _FriendlyName;
        public string FriendlyName{ get { return _FriendlyName; }  set { SetProperty(ref _FriendlyName, value); } }

        private DateTime _lastChecked;
        public DateTime LastChecked { get { return _lastChecked; } set { SetProperty(ref this._lastChecked, value); } }

        private string _lastProjectStatus;
        public string LastProjectStatus { get { return _lastProjectStatus; } set { SetProperty(ref this._lastProjectStatus, value); } }

        private JenkinsClient.BuildStatus _lastBuildStatus;
        public JenkinsClient.BuildStatus LastBuildStatus { get { return _lastBuildStatus; } set { SetProperty(ref this._lastBuildStatus, value); } }
        public bool IsEnabled { get; set; }
        public string ProjectUri { get; set; }

        private JenkinsClient.BuildJob _buildJob;
        [XmlIgnore]
        public JenkinsClient.BuildJob BuildJob { get { return _buildJob; } set { SetProperty(ref _buildJob, value); } }
    }
}
