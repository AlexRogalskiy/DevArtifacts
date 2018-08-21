namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Use POST or GET
    ///     Fix version field
    /// </summary>
    public class FixVersionSimple
    {
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
