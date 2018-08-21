namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using System.Collections.Generic;
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Class to create a Test Excecution with correct fields 
    /// fixVersion doesn't show up in create meta as required. Check?
    /// </summary>
    public class TesttExcecutionFields
    {
        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty(PropertyName = "issuetype")]
        public Issuetype Issuetype { get; set; }

        [JsonProperty(PropertyName = "project")]
        public ProjectSimple ProjectKey { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("fixVersions")]
        public List<FixVersionSimple> FixVersion { get; set; }
    }
}
