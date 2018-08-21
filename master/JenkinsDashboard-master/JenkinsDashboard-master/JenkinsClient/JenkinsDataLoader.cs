using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace JenkinsClient
{
    public class JenkinsDataLoader
    {
        JenkinsServerInfo _serverInfo = null;
        public JenkinsDataLoader(JenkinsServerInfo serverInfo)
        {
            _serverInfo = serverInfo;
        }

        //string JenkinsServerUrl = "https://ci.jenkins-ci.org/job/jenkins_pom/api/json";


        public async Task<ServerInfo> GetProjects()
        {
            using (HttpClient client = SetupHttpClientRequest())
            {
                var resp = await client.GetAsync(Utilities.AddApiToUrl(_serverInfo.JenkinsServer));
                if (resp.IsSuccessStatusCode)
                {
                    var projects = await resp.Content.ReadAsStringAsync();

                    var projectResponse = JsonConvert.DeserializeObject<ServerInfo>(projects);
                    return projectResponse;
                }
            }
            return null;
        }

        public async Task<BuildJob> GetProjectData(string url)
        {
            url = Utilities.AddApiToUrl(url);
            var requestUri = new Uri(url);
            return await GetProjectData(requestUri);
        }

        public async Task<BuildJob> GetProjectData(Uri requestUri)
        {

            using (HttpClient client = SetupHttpClientRequest())
            {
                var resp = await client.GetAsync(requestUri);


                string response = await resp.Content.ReadAsStringAsync();
                var projectResponse = JsonConvert.DeserializeObject<BuildJob>(response);

                return projectResponse;
                //var name = jObject["displayName"];
            }
        }

        public async Task<BuildInformation> GetBuildInformation(Build build)
        {
            return await GetBuildInformation(build.url);
        }

        public async Task<BuildInformation> GetBuildInformation(string Url)
        {
            Url = Utilities.AddApiToUrl(Url);

            var requestUri = new Uri(Url);

            using (HttpClient client = SetupHttpClientRequest())
            {

                var resp = await client.GetAsync(requestUri);
                if (resp.IsSuccessStatusCode)
                {
                    string response = await resp.Content.ReadAsStringAsync();
                    var buildInfo = JsonConvert.DeserializeObject<BuildInformation>(response);
                    return buildInfo;
                }
            }
            return null;
        }

        private HttpClient SetupHttpClientRequest()
        {

            HttpClientHandler handler = new HttpClientHandler()
            {
                PreAuthenticate = true
            };
            var client = new HttpClient(handler);

            if (client != null)
            {
                if (_serverInfo.RequiresAuthentication)
                {
                    var byteArray = Encoding.ASCII.GetBytes(_serverInfo.UserName + ":" + _serverInfo.ApiToken);//"joel.hess:1e76a66f0565b3dbf3f741922b0f9435");
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
                }
            }

            return client;
            
        }

    }
}
