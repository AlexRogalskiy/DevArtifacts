namespace JenkinsJIRA_API.Managers
{
    #region using
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    using Entities.Misc;
    using System.Net;
    using System.IO;
    #endregion
    public class JenkinsManager
    {
        #region fields
        //private const string build_host = "http://jenkins:8080/";
        private readonly string _encodedCredentials;
        //private const string lastBuildArtifactURL = build_host + "/job/%s/lastCompletedBuild/artifact/%s";
        #endregion

        #region Properties
        protected string build_host { get; set; }
        #endregion
        protected string lastBuildArtifactURL { get; set; }
        #region Constructor
        /// <summary>
        /// Creates a Jenkins REST API management object.  
        /// The only requierment for this to work is your connection has to be on the company Network
        /// </summary>
        public JenkinsManager(string jenkinsURL) //If only network connection needed
        {
            build_host = jenkinsURL;
            lastBuildArtifactURL = build_host + "/job/%s/lastCompletedBuild/artifact/%s";
        }
        public JenkinsManager(string username, string pass, string jenkinsURL) //Adapt if username password required
        {
            build_host = jenkinsURL;
            lastBuildArtifactURL = build_host + "/job/%s/lastCompletedBuild/artifact/%s";
            GetEncodedCredentials(username,pass);
        }
        #endregion

        #region Methods
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T">Object with JSON.net JsonProperties</typeparam>
        /// <param name="url"></param>
        /// <param name="requestMethod"></param>
        /// <returns></returns>
        protected T MakeJenkinsRequest<T>(string url,string requestMethod)
        {
            //TODO HttpStatusCode handle failed request
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            request.ContentType = "application/json";
            request.Method = requestMethod;
            //request.Headers.Add("Authorization?")
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                JsonSerializer serializer = new JsonSerializer();
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    using (var jsonTextReader = new JsonTextReader(reader))
                    {
                        return (T)serializer.Deserialize(jsonTextReader, typeof(T));
                    }
                }
            }
        }
        /// <summary>
        /// Turns username and pasword in Encoded UT8
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        protected void GetEncodedCredentials(string username, string password)
        {
            //TODO encode jenkins log in info in correct form
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Downloads specified jobs in artifact info to Output directory.
        /// Grabs the latest build, successful or not
        /// </summary>
        /// <param name="branchJenkinsName"></param>
        /// <param name="targetJob"></param>
        /// <param name="artifactInfo"></param>
        public KeyValuePair<int,string> GetLastBuiltArtifact(string branchJenkinsName, string targetJob, string artifactToFind )
        {
            var artifactExtention = ".jar"; //Artifact format expected
            var targetJobURL = $"{build_host}view/{branchJenkinsName}/job/{targetJob}/";
            var apiUrl = $"{targetJobURL}lastCompletedBuild/api/json";
            var responseArtifacts = MakeJenkinsRequest<LastBuiltArtifactRsp>(apiUrl,"GET");
            //Get artifact links
            var resultKV = new KeyValuePair<int, string>();
            string downloadUrl = String.Empty; //Maybe just use nullable string here
            //return artifacts where matches.  No matches will not be included in the list.  Can handle better
            foreach (var artifact in responseArtifacts.Artifacts)
            {
                if (artifact.DispPath == artifactToFind)
                {
                    resultKV = new KeyValuePair<int, string>(responseArtifacts.BuildNumber, $"{targetJobURL}lastCompletedBuild/artifact/{artifact.RelativePath}");
                    break;
                }
            }
            //TODO make LINQ statement  
            //TODO handle missing artifacts that user wanted to find
            return resultKV; //a bit lazy here use better return type.  This dict will only have 1 kv pair
        }
        #endregion


    }
}
