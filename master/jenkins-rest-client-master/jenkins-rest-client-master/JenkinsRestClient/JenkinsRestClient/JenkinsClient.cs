using System.Collections.Generic;
using JenkinsRestClient.Data;

namespace JenkinsRestClient
{
    public class JenkinsClient : IJenkinsClient
    {
        private readonly IJenkinsServerApi _server;

        public JenkinsClient(IJenkinsServerApi server)
        {
            _server = server;
        }

        #region IJenkinsClient Members

        public IEnumerable<Job> GetJobs()
        {
            return GetJenkinsData().Jobs;
        }

        public void StartJob(Job job)
        {
            _server.Post("/job/" + job.Name + "/build");
        }

        public JobDetail GetJobDetails(Job job)
        {
            return _server.Get<JobDetail>("/job/" + job.Name + "/api/json");
        }

        public IEnumerable<SlaveData> GetSlaves()
        {
            return GetComputerData().Computer;
        }

        #endregion

        public JenkinsData GetJenkinsData()
        {
            return _server.Get<JenkinsData>("/api/json");
        }

        public JenkinsComputerData GetComputerData()
        {
            return _server.Get<JenkinsComputerData>("/computer/api/json");
        }
    }
}