namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Represents a Fields JSON object
    ///     Pertains to JIRA specefic issues
    ///     Plugins may require their own issue format
    /// </summary>
    /// <remarks>
    public class Fields
    {
        [JsonProperty("summary")]
        public string Summary { get; set; }

        [JsonProperty("status")] 
        public Status Status { get; set; }

        [JsonProperty("assignee")]
        public Assignee Assignee { get; set; }
    }
}
