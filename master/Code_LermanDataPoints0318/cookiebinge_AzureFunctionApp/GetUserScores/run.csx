using System.Net;
//call with:
//https://cookiebinge.azurewebsites.net/api/GetUserScores/{userId}
//example: https://cookiebinge.azurewebsites.net/api/GetUserScores/54321
public static HttpResponseMessage Run(string userId,
               HttpRequestMessage req, IEnumerable<dynamic> documents, TraceWriter log)
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

