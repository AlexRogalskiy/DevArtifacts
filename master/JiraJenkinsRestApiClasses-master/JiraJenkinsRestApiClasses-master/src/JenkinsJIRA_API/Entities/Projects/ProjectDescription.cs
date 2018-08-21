namespace JenkinsJIRA_API.Entities.Projects
{
    #region MyRegion
    using Newtonsoft.Json;
    using JenkinsJIRA_API.Entities.Misc;
    #endregion
    /// <summary>
    /// A class representing a project descriptin in JIRA
    /// </summary>
    public class ProjectDescription : BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("key")]
        public string Key { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("avatarUrls")]
        public AvatarUrls AvatarUrls { get; set; }
    }
}
