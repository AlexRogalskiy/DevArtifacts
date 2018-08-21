namespace JenkinsJIRA_API.Managers
{
    #region using
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Text;
    using System.IO;
    using System.Net;
    using System;
    using System.Linq;
    using Entities.Issues;
    using Entities.Searching;
    using Entities.TestExcecution;
    using System.Collections.Generic;
    #endregion

    #region Enumerators

    #endregion

    public class JiraManager
    {
        #region Fields
        //private const string BaseUrl = "http://sparkflow.collaboration.agilent.com/rest/api/latest/";
        //private const string BaseXRAYUrl = "http://sparkflow.collaboration.agilent.com/rest/raven/1.0/api/";
        protected readonly string _encodedCredentials;
        #endregion

        #region Constructor
        /// <summary>
        /// Creates a JIRA REST API management object
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        public JiraManager(string username, string password, string jiraURI)
        {
           _encodedCredentials = GetEncodedCredentials(username, password);
            BaseUrl = $"{jiraURI}rest/api/latest/";
            BaseXRAYUrl = $"{jiraURI}rest/raven/1.0/api/";
        }
        #endregion

        #region Properties
        protected string BaseUrl { get; set; }
        protected string BaseXRAYUrl { get; set; }
        #endregion

        #region Public Methods
        /// <summary>
        /// Search for JIRA issues
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public SearchResponse SearchFor(SearchRequest request)
        {
            var data = JsonConvert.SerializeObject(request);
            var response = this.MakeJIRARequest<SearchResponse>("POST", "search", data: data);
            return response;
        }
        public void UpdateIssue(string issueKey, string updateFieldsJSON)
        {
            //TODO take json object instead of stringjson
            MakeJIRARequest<JObject>("PUT", "issue", issueKey, updateFieldsJSON);
        }
        /// <summary>
        /// Create a Test Excecution.
        /// JIRA REST response is test excecution
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public string CreateTestExcecution(TestExcecutionDataSimple request)
        {
            //TODO perform a GET first to work with Custom fields
            var data = JsonConvert.SerializeObject(request);
            var response = this.MakeJIRARequest<CreateIssueResponse>("POST", "issue", data: data);
            return response.IssueKey;
        }
        /// <summary>
        /// Plan to Obselete and make common XRAY request method
        /// </summary>
        /// <param name="testKey"></param>
        /// <returns></returns>
        public List<TestRun> GetXrayTestExcecution(string testKey)
        {
            var arguments = new List<string> {testKey,"test"};
            var rsp = MakeXRAYRequest<List<TestRun>>("GET", "testexec", arguments);
            return rsp;
            //var url = $"{BaseXRAYUrl}testexec/{testKey}/test";
            ////TODO HttpStatusCode.OK is 200, XRAY can return other 20x codes based on request type
            //try
            //{
            //    HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            //    request.ContentType = "application/json";
            //    request.Method = "GET";
            //    request.Headers.Add("Authorization", "Basic " + _encodedCredentials);

            //    //Prepare JSON string to send if data parameter is not null

            //    using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            //    {
            //        //Status code Created wasn't correctly handled here
            //        if ((response.StatusCode != HttpStatusCode.OK))
            //            throw new Exception(String.Format(
            //                "Server error (HTTP {0}: {1}).",
            //                response.StatusCode,
            //                response.StatusDescription));
            //        JsonSerializer serializer = new JsonSerializer();
            //        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            //        {
            //            using (var jsonTextReader = new JsonTextReader(reader))
            //            {
            //                return (JObject) serializer.Deserialize(jsonTextReader, typeof (JObject));
            //            }
            //        }
            //    }
            //}
            //catch (WebException wex)
            //{
            //    if (wex.Response == null) return default(JObject);
            //    using (var errorResponse = (HttpWebResponse)wex.Response)
            //    {
            //        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
            //        {
            //            string error = reader.ReadToEnd();
            //        }
            //    }
            //    return default(JObject);
            //}
        }
        /// <summary>
        /// Add test excecutions to testKey
        /// </summary>
        /// <param name="testKey"></param>
        /// <param name="testToAdd"></param>
        /// <returns></returns>
        public List<string> AddXrayTestExcecutions(string testKey, TestExcecutionAdd testToAdd)
        {
            var data = JsonConvert.SerializeObject(testToAdd);
            var arguments = new List<string> {testKey,"test"};
            var rsp = MakeXRAYRequest<List<string>>("POST", "testexec", arguments,data);
            return rsp;
            //var url = $"{BaseXRAYUrl}testexec/{testKey}/test";
            //try
            //{
            //    HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            //    request.ContentType = "application/json";
            //    request.Method = "POST";
            //    request.Headers.Add("Authorization", "Basic " + _encodedCredentials);

            //    //Prepare JSON string to send
            //    var data = JsonConvert.SerializeObject(testToAdd);
            //    using (StreamWriter writer = new StreamWriter(request.GetRequestStream()))
            //    {
            //        writer.Write(data);
            //    }

            //    using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            //    {
            //        //Handle response correctly base on HTTP error code
            //        JsonSerializer serializer = new JsonSerializer();
            //        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            //        {
            //            using (var jsonTextReader = new JsonTextReader(reader))
            //            {
            //                return (List<string>)serializer.Deserialize(jsonTextReader, typeof(List<string>));
            //            }
            //        }
            //    }
            //}
            //catch (Exception e)
            //{
            //    Console.WriteLine(e.Message);
            //    Console.Read();
            //    return null;
            //}
        }
        /// <summary>
        /// Update Test runs in an exection in JIRA
        /// TODO make generic MakeXRAYRequest 
        ///     or allow Make request to change URL formatting
        /// </summary>
        /// <param name="testExecKey">Test ExcecutionKey</param>
        /// <param name="executionStatus">Test Excecution Status</param>
        public void UpdateXrayTestExcecutions(string testExecKey, Dictionary<string, bool?> executionStatus)
        {
            //TODO update Test Excecution with either XRAY format JSON results or use put to set pass/fail, but no details 
            //GET test see if that even works 
            //  TESTING looks like hteres an issue with Automated[Cucumber] test and making GET testrun request
            var testRuns = GetXrayTestExcecution(testExecKey);
            var testToUpdate = new Dictionary<int,string>();
            string status;
            foreach (var run in testRuns)
            {
                if (executionStatus.ContainsKey(run.Key))
                {
                    if (executionStatus[run.Key].HasValue)
                    {
                        status = (executionStatus[run.Key].Value) ? "PASS" : "FAIL";
                    }
                    else
                    {
                        status = "TODO";
                    }
                    testToUpdate[run.ID] = status;
                }
            }

            foreach (var testRunPair in testToUpdate)
            {
                JObject query = new JObject(new JProperty("status", testRunPair.Value));
                var data = query.ToString();
                MakeXRAYRequest<JObject>("PUT", "testrun",
                    new List<string> {testRunPair.Key.ToString()}, data);
            }


        } 
        /// <summary>
        /// Discover a customID field in JIRA using a name to find.  
        /// Needs testing with other formats
        /// </summary>
        /// <param name="projectKey"></param>
        /// <param name="issueType"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public string GetCustomFieldWithName(string projectKey, string issueType, string name)
        {
            //Handle not finding a match, when customfield is Null
            var paramaters = $"createmeta?projectKeys={projectKey}&issuetypeNames={issueType}&expand=projects.issuetypes.fields";
            var response = this.MakeJIRARequest<JObject>("GET", "issue", paramaters);
            //Linq to find customfield with "name" equal to our name
            var validFields = response["projects"].First.Children<JProperty>().FirstOrDefault(x => x.Name == "issuetypes").Value.First["fields"];
            var customField = validFields.Children<JProperty>().FirstOrDefault(x => x.Value["name"].Value<string>() == name);
            return customField.Name;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Turns username and pasword in Encoded UT8
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        protected string GetEncodedCredentials(string username, string password)
        {
            //To work with JIRA REST API need Base64 encode the string
            string mergedCredentials = String.Format("{0}:{1}", username, password);
            byte[] byteCredentials = UTF8Encoding.UTF8.GetBytes(mergedCredentials);
            return Convert.ToBase64String(byteCredentials);
        }
        protected Issue GetIssue(string issueKey)
        {
            var response = this.MakeJIRARequest<Issue>("GET", "issue", issueKey);
            return response;
        }
        protected T MakeJIRARequest<T>(string requestMethod, string resourceName, string arguments = null, string data = null)
        {
            //TODO use HTTP codes to handle/!handle responses appropriatley
            var url = $"{BaseUrl}{resourceName}/";
            if (arguments != null)
            {
                url = $"{url}{arguments}";
            }
            //TODO HttpStatusCode.OK is 200, JIRA can return other 20x codes based on request type
            //  Change up Method to correcly handle instead of of always debugging to catch errors
            try
            {
                HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
                request.ContentType = "application/json";
                request.Method = requestMethod;
                request.Headers.Add("Authorization", "Basic " + _encodedCredentials);

                //Prepare JSON string to send if data parameter is not null
                if (data != null)
                {
                    //TODO validate JSON format
                    using (StreamWriter writer = new StreamWriter(request.GetRequestStream()))
                    {
                        writer.Write(data);
                    }
                }

                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    //Status code Created wasn't correctly handled here, there are many GOOD status goods
                    //if ((response.StatusCode != HttpStatusCode.OK))
                    //    throw new Exception(String.Format(
                    //    "Server error (HTTP {0}: {1}).",
                    //    response.StatusCode,
                    //    response.StatusDescription));
                    JsonSerializer serializer = new JsonSerializer();
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        using (var jsonTextReader = new JsonTextReader(reader))
                        {
                            return (T) serializer.Deserialize(jsonTextReader, typeof (T));
                        }
                    }
                }
            }
            catch (WebException wex)
            {
                if (wex.Response == null) return default(T);
                using (var errorResponse = (HttpWebResponse) wex.Response)
                {
                    using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                    {
                        string error = reader.ReadToEnd();
                    }
                }
                return default(T);
            }
        }
        protected T MakeXRAYRequest<T>(string requestMethod, string resourceName, List<string> arguments = null, string data = null)
        {
            var url = $"{BaseXRAYUrl}{resourceName}/";
            if (arguments != null)
            {
                foreach (var argum in arguments)
                {
                    url += $"{argum}/";
                }
            }
            //TODO HttpStatusCode.OK is 200, JIRA can return other 20x codes based on request type
            try
            {
                HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
                request.ContentType = "application/json";
                request.Method = requestMethod;
                request.Headers.Add("Authorization", "Basic " + _encodedCredentials);
                //Prepare JSON string to send if data parameter is not null
                if (data != null)
                {
                    //TODO validate JSON format (maybe not since I start with a JSONserialize)
                    using (StreamWriter writer = new StreamWriter(request.GetRequestStream()))
                    {
                        writer.Write(data);
                    }
                }
                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    //Status code handling?
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
            catch (WebException wex)
            {
                if (wex.Response == null) return default(T);
                using (var errorResponse = (HttpWebResponse)wex.Response)
                {
                    using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                    {
                        string error = reader.ReadToEnd();
                    }
                }
                return default(T);
            }
        }
        #endregion
    }
}
