using System.Collections.Generic;
using JenkinsRestClient.Data;

namespace JenkinsRestClient
{
    public interface IJenkinsClient
    {
        IEnumerable<Job> GetJobs();
        JenkinsData GetJenkinsData();
        void StartJob(Job job);
        IEnumerable<SlaveData> GetSlaves();
        JobDetail GetJobDetails(Job job);
        JenkinsComputerData GetComputerData();
    }
}