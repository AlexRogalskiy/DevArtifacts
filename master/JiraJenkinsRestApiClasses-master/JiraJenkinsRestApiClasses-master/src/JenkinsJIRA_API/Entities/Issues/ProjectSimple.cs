namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Project field when creating a project
    /// </summary>
    public class ProjectSimple
    {
        [JsonProperty("key")]
        public string key { get; set; }
    }
}
