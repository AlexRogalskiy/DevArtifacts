namespace JenkinsJIRA_API.Entities.Misc
{
    #region using
    using Newtonsoft.Json;
    #endregion
    /// <summary>
    /// Represents an avatarUrl JSON object
    /// </summary>
    /// <remarks>
    /// "avatarUrls": {
    ///     "16x16": "http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred",
    ///     "48x48": "http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred"
    /// }
    /// </remarks>
    public class AvatarUrls
    {
        [JsonProperty("16x16")]
        public string Size16 { get; set; }

        [JsonProperty("48x48")]
        public string Size48 { get; set; }
    }
}
