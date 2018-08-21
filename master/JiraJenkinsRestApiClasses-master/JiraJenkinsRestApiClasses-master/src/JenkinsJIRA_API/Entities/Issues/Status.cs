namespace JenkinsJIRA_API.Entities.Issues
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Represents a Status JSON object
    /// </summary>
    /// <remarks>
    /// "status" : {
    ///     "self" : "http://localhost.:8080/rest/api/2/status/5",
    ///     "description" : "A resolution has been taken, and it is awaiting verification by reporter. From here issues are either reopened, or are closed.",
    ///     "iconUrl" : "http://localhost.:8080/images/icons/status_resolved.gif",
    ///     "name" : "Resolved",
    ///     "id" : "5"
    /// }
    /// </remarks>
    public class Status : BaseEntity
    {
        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("iconUrl")]
        public string IconUrl { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }
    }
}
