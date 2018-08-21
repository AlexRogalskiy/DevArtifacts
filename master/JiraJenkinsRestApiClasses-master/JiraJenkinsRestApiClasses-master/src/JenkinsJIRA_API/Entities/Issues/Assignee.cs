using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using JenkinsJIRA_API.Entities.Misc;

namespace JenkinsJIRA_API.Entities.Issues
{
    /// <summary>
    /// Represents an assignee JSON object
    /// </summary>
    /// <remarks>
    /// "assignee" : {
    ///	    "self" : "http://localhost.:8080/rest/api/2/user?username=adm",
    ///	    "name" : "adm",
    ///	    "emailAddress" : "foo@bar.com",
    ///	    "avatarUrls" : {
    ///	    	"16x16" : "http://localhost.:8080/secure/useravatar?size=small&avatarId=10122",
    ///	    	"48x48" : "http://localhost.:8080/secure/useravatar?avatarId=10122"
    /// }    
    /// </remarks>
    public class Assignee : BaseEntity
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("emailAddress")]
        public string EmailAddress { get; set; }

        [JsonProperty("avatarUrls")]
        public AvatarUrls AvatarUrls { get; set; }

        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        [JsonProperty("active")]
        public bool Active { get; set; }
    }
}
