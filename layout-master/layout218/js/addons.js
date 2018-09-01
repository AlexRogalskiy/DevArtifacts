function getCodePenId() {
  var CODEPEN_ID = /codepen\.io\/([^/]+)\/(?:pen|debug|fullpage|fullembedgrid)\/([^?#/]+)/;
  var id, user;

  if(CODEPEN_ID.test(window.location.href)) {
    user = CODEPEN_ID.exec(window.location.href)[1];
    id = CODEPEN_ID.exec(window.location.href)[2];
    type= 'view';
  } else {
    // Case when you're in CodePen editor
    // the iFrame doesn't contain the pen's id and you can't 
    // access the perant's address as it's on different subdomain
    var metas = document.getElementsByTagName('link');
    for(i=0;i<metas.length;i++) {
      if(metas[i].getAttribute('rel') == 'canonical') {
        if(CODEPEN_ID.test(metas[i].getAttribute('href')))
           user = CODEPEN_ID.exec(metas[i].getAttribute('href'))[1];
        id = CODEPEN_ID.exec(metas[i].getAttribute('href'))[2];    type= 'editor';
      }
    }
  }
  
  return {id: id,user:user, type: type};
}

var data = getCodePenId();
document.getElementById("penId").innerHTML =data.id;
document.getElementById("penUser").innerHTML = data.user;
document.getElementById("penView").innerHTML = data.type;