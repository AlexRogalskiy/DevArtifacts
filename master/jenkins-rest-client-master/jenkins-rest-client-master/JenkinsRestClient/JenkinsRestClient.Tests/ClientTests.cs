using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using JenkinsRestClient.Data;
using Moq;
using NUnit.Framework;
using Newtonsoft.Json;

namespace JenkinsRestClient.Tests
{
    [TestFixture]
    public class ClientTests
    {
        private Mock<IJenkinsServerApi> _fakeServer;

        private static T GetJson<T>(string name)
        {
            Assembly thisExe = Assembly.GetExecutingAssembly();
            Stream stream = thisExe.GetManifestResourceStream("JenkinsRestClient.Tests.JsonResults." + name);
            using (var reader = new StreamReader(stream))
            {
                string result = reader.ReadToEnd();
                return JsonConvert.DeserializeObject<T>(result);
            }
        }
        [SetUp]
        public void SetUp()
        {
            _fakeServer = new Mock<IJenkinsServerApi>();
        }

        [Test]
        public void TestStartJob()
        {
            var client = GetSut();
            _fakeServer.Setup(t => t.Get<JenkinsData>("/api/json")).Returns(GetJson<JenkinsData>("jenkinsData1.json"));
            var jobs = client.GetJobs();
            client.StartJob(jobs.First());
            _fakeServer.Verify(t => t.Post("/job/asdsa/build"),Times.Once());

        }

        [Test]
        public void TestJobDetail()
        {
            var client = GetSut();
            _fakeServer.Setup(t => t.Get<JenkinsData>("/api/json")).Returns(GetJson<JenkinsData>("jenkinsData1.json"));
            _fakeServer.Setup(t => t.Get<JobDetail>("/job/asdsa/api/json")).Returns(GetJson<JobDetail>("jobDetail1.json"));
            var jobs = client.GetJobs();
            var jobDetail = client.GetJobDetails(jobs.FirstOrDefault());
            Assert.AreEqual(2,jobDetail.Builds.Count);

        }
        private JenkinsClient GetSut()
        {
            
            var client = new JenkinsClient(_fakeServer.Object);
            return client;
        }

        [Test]
        public void TestJenkinsComputerData()
        {
            
            _fakeServer.Setup(t => t.Get<JenkinsComputerData>("/computer/api/json")).Returns(
                GetJson<JenkinsComputerData>("jenkinsComputerData1.json"));
            var client = GetSut();
            var slaveDatas = client.GetComputerData().Computer.ToList();
            Assert.AreEqual(2, slaveDatas.Count);
            Assert.AreEqual(2,slaveDatas[0].NumExecutors);
            Assert.IsFalse(slaveDatas[0].Offline);
            Assert.IsTrue(slaveDatas[1].Offline);
            Assert.AreEqual(1, slaveDatas[1].NumExecutors);
            Assert.AreEqual(2,client.GetSlaves().Count());
        }

        [Test]
        public void TestJobs()
        {
            _fakeServer.Setup(t => t.Get<JenkinsData>("/api/json")).Returns(GetJson<JenkinsData>("jenkinsData1.json"));
            var client = GetSut();
            List<Job> jobs = client.GetJobs().ToList();
            Assert.AreEqual(1, jobs.Count());
            Job job = jobs.FirstOrDefault();
            Assert.AreEqual("asdsa", job.Name);
            Assert.AreEqual("http://127.0.0.1:8080/job/asdsa/", job.Url);
            Assert.IsTrue(job.IsSuccess());
            Assert.IsFalse(job.IsFailed());
        }

        [Test]
        public void TestMainData()
        {
            _fakeServer.Setup(t => t.Get<JenkinsData>("/api/json")).Returns(GetJson<JenkinsData>("jenkinsData1.json"));
            var client = GetSut();
            Assert.AreEqual(2, client.GetJenkinsData().NumExecutors);
        }
    }
}