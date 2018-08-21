namespace JenkinsJIRA_API.Entities.Misc
{
    #region using
    using Newtonsoft.Json;
    using System.Collections.Generic;
    #endregion
    /// <summary>
    /// Last Build Artifact GET response
    /// </summary>
    public class LastBuiltArtifactRsp
    {
        [JsonProperty("number")]
        public int BuildNumber { get; set; }

        [JsonProperty("artifacts")]
        public List<artifactResults> Artifacts { get; set; }
    }
}
