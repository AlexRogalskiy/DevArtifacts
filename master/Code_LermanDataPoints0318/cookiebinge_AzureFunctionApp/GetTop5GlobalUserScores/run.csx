
using System.Net;

//call with:
//https://cookiebinge.azurewebsites.net/api/GetTop5GlobalUserScores
public static HttpResponseMessage Run(
               HttpRequestMessage req, IEnumerable<userScore> documents, TraceWriter log)
{
    if (documents != null)
    {
        log.Info($"Document Count: {documents.Count()}");
        return req.CreateResponse(HttpStatusCode.OK,documents);
    }
    else
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }
}
    public class userScore{
    public string userName{get;set;}
    public string score{get;set;}
    public string worthit {get;set;}
    public string deviceName {get;set;}
    public string dateTime{get;set;}

}