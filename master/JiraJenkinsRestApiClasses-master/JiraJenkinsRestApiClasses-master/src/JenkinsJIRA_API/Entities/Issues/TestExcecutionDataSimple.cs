namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// JSON property fields
    /// </summary>
    public class TestExcecutionDataSimple
    {
        [JsonProperty("fields")]
        public TesttExcecutionFields fields { get; set; }
    }
}
