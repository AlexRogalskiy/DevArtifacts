let button = document.querySelector("#make-readable");

button.addEventListener("click", function() {
  
  scroll(0, 0);
  
  let mainTweetSource = document.querySelector("#main-tweet-template").innerText;
  let mainTweetTemplate = Handlebars.compile(mainTweetSource);

  let subTweetSource = document.querySelector("#sub-tweet-template").innerText;
  let subTweetTemplate = Handlebars.compile(subTweetSource);

  let content = document.querySelector("#text").textContent;
  let contentArray = content.replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|"); 

  let allSubtweets = "";

  let mainTweetData = {
    "avatar": "200/abott@adorable.io.png",
    "user-fullname": "Jimmy Fiddlecakes",
    "user-username": "@everythingmatters",
    "tweet-text": contentArray.shift(),
    "tweet-time": "5:48 PM - 15 Sep 2017",
    "comments": contentArray.length + 1,
    "retweets": Math.floor(Math.random() * 100),
    "loves": Math.floor(Math.random() * 200),
    "tweet-number": 1,
    "tweet-total": contentArray.length + 1
  };
  let mainTweetHtml = mainTweetTemplate(mainTweetData);

  contentArray.forEach(function(sentence, i) {
    let subtweetData = {
      "avatar": "200/abott@adorable.io.png",
      "user-fullname": "Jimmy Fiddlecakes",
      "user-username": "@everythingmatters",
      "tweet-text": sentence,
      "retweets": Math.floor(Math.random() * 50),
      "loves": Math.floor(Math.random() * 50),
      "tweet-number": i + 2,
      "tweet-total": contentArray.length + 1
    };
    let subTweetHtml = subTweetTemplate(subtweetData);
    allSubtweets += subTweetHtml;
  });

  document.querySelector("#content").innerHTML = `
    <div class="all-tweets-container">
      ${mainTweetHtml}
      ${allSubtweets}
    </div>
  `;
  
  document.body.classList.add("ready-to-read-now");
  content.remove();
  button.remove();
  
});
