namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    using System.Collections.Generic;
    #endregion
    /// <summary>
    /// GET method
    /// CCreate issue response
    /// </summary>
    public class CreateIssueResponse
    {
        [JsonProperty("id")]
        public string IssueID { get; set; }

        [JsonProperty("key")]
        public string IssueKey { get; set; }

        [JsonProperty("self")]
        public string SelfLinkToIssue { get; set; }

        [JsonProperty("errorMessages")]
        public List<string> ErrorMsgs { get; set; }

        //See how error object is broken down
        [JsonProperty("errors")]
        public object Errors { get; set; }
    }
}
