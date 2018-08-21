namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Used to create issues
    /// </summary>
    public class Issuetype
    {
        [JsonProperty("id")]
        public string ID { get; set; }
    }
}
