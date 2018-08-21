namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// A class representing a JIRA issue
    /// </summary>
    public class Issue : BaseEntity
    {
        private string m_KeyString;

        [JsonProperty("expand")]
        public string Expand { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }

        #region Special key solution
        [JsonProperty("key")]
        public string ProxyKey
        {
            get
            {
                return Key.ToString();
            }
            set
            {
                m_KeyString = value;
            }
        }

        [JsonIgnore]
        public IssueKey Key
        {
            get
            {
                return IssueKey.Parse(m_KeyString);
            }
        }
        #endregion Special key solution

        [JsonProperty("fields")]
        public Fields Fields { get; set; }
    }
}
