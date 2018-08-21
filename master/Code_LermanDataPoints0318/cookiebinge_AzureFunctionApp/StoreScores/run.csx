using System.Net;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log, IAsyncCollector<object> outputDocument)
{
    BingeRequest bingeData =  await req.Content.ReadAsAsync<BingeRequest>();
    log.Verbose("Incoming userId:" + bingeData.userId);
    //cast to document type
    var doc=new BingeDocument(bingeData,log);
    log.Verbose("Outgoing userId:" + doc.userId);
    await outputDocument.AddAsync(doc);
    if (doc.userId !=" " )
    {
        return req.CreateResponse(HttpStatusCode.OK,$"{doc.userId} was created" );
    }
    else {
        return req.CreateResponse(HttpStatusCode.BadRequest,$"The request was incorrectly formatted." );
    }
}
public class BingeRequest{
    public string userId {get;set;}
    public string userName {get;set;}
    public string deviceName {get;set;}
    public DateTime dateTime {get;set;}
    public int score{get;set;}
    public bool worthit {get;set;}
}
public class BingeDocument:BingeRequest
{      
    public BingeDocument(BingeRequest binge, TraceWriter log){
    logged=System.DateTime.Now;
    userId=binge.userId;
    userName=binge.userName;
    deviceName=binge.deviceName;
    dateTime=binge.dateTime;
    score=binge.score;
    worthit=binge.worthit; //accidentally left out in 2nd article
    }
    public DateTime logged{get;set;}
}

