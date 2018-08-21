using System.Net;
using RestSharp;

namespace JenkinsRestClient
{
    public class JenkinsServerApi : IJenkinsServerApi
    {
        private readonly RestClient _client;

        public JenkinsServerApi(string host)
        {
            _client = new RestClient("http://" + host) {CookieContainer = new CookieContainer()};
        }

        #region IJenkinsServerApi Members

        public T Get<T>(string url) where T : new()
        {
            var request = new RestRequest(url, Method.GET);
            IRestResponse<T> response = _client.Execute<T>(request);
            return response.Data;
        }

        public void Post(string url)
        {
            var request = new RestRequest(url, Method.GET);
            IRestResponse response = _client.Execute(request);
        }

        #endregion
    }
}