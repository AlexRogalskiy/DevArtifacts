namespace JenkinsJIRA_API.Entities.Misc
{
    #region using
    using System.Collections.Generic;
    using Newtonsoft.Json;
    #endregion
    public class XrayTestCasePost
    {
        [JsonProperty("add")]
        public List<string> TCsToAdd { get; set; }

        [JsonProperty("remove")]
        public List<string> TCsToRemove { get; set; }
    }
}
