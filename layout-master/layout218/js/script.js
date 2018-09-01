var data = getCodePenId();
var a = document.createElement('a');
var linkText = document.createTextNode("Get your HTML email");
a.appendChild(linkText);
a.target ="_blank";
a.href = 'https://zurb.com/playground/slinky?codepen_user=' + data.user + '&codepen_slug=' + data.id + '#inlined-email';
a.style="position:fixed; bottom:20px; right:20px;display:block;color:#fff;background-color:#EC2E71; padding:10px;text-align:center; padding: 16px 18px;"
if(data.type === 'editor') { 
  document.body.appendChild(a);
}
