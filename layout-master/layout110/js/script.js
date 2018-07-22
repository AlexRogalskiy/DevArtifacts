/**
* > try out this es2015 thing
* > get 10 hours into project
* > read that `class` is bad practice
* > try not to cry
* > cry a lot
*/

/**
* Minimal wrapper class for Nate Wiley's cpv2api (http://cpv2api.com/).
* It's super specific to this app and pretty fragile, I wouldn't recommend using it elsewhere.
*/
class CPV2 {
  constructor() {
    this.apiURL = "https://cpv2api.herokuapp.com/";
    this.throttler = new AjaxThrottler();
  }

  /**
  * Gets a user's profile
  * @param {string} user - username of user to be retrieved
  * @param {function} callback
  */
  getUser(user, callback) {
    this.throttler.addRequest({
      url: this.apiURL + "profile/" + user,
      success: r => {
        callback(r);
      }
    });
  }

  /**
  * Gets a follow count (whether following or followers) for a user.
  * @param {string} user - username of user to be checked
  * @param {string} key - key of data to be returned ('following' or 'followers')
  * @param {function} callback - uses the found count as arg
  */
  getCount(user, key, callback) {
    this.getUser(user, r => {
      if (r.success) {
        callback(parseInt(r.data[key]));
      }

      // User not found. Mostly (only?) happens with teams, which would need
      // to be handled seperately. Currently, teams aren't supported by cpv2api
      else {
        callback(0);
      }
    });
  }

  /**
  * Recursively loops through a grid and returns all pages of data
  * @param {number} [page = 1] - current page of grid
  * @param {string} endpoint - endpoint of grid to be looked up
  * @param {function} eachPage - fired after each page has been retrieved
  * @param {function} onComplete - fired once all pages have been retrieved
  */
  getAllPages({page = 1, endpoint, eachPage, onComplete}) {
    let data = new Set();
    const url = this.apiURL + endpoint + "?page=" + page;
    this.throttler.addRequest({
      url: url,
      error: (e) => {
        console.error("Something broke, try again? (" +  e.statusText + ")"); // ...lol
      },
      success: (response) => {
        if (response.success) {
          response.data.forEach(user => {
            data.add(user);
          });
          eachPage(response, data);
          if (this.bailEarly) {
            this.bailEarly = false;
            return;
          } else {
            this.getAllPages({
              page: page + 1,
              endpoint: endpoint,
              eachPage: eachPage,
              onComplete: onComplete,
            });
          }
        } else {
          onComplete();
        }
      }
    });
  }
}

/**
* Just in case there's some situation where hundreds of requests
* are trying to fire at once, this ensures that only a somewhat
* sane amount are actually going off at the same time.
*
* In extreme situations the browser can actually just crash without this.
*/
class AjaxThrottler {
  constructor() {
    this.requestsBeforeThrottle = 10; // number of allowed requests before throttling kicks in
    this.pendingRequests = []; // current number of pending requests
    this.queuedRequests = []; // current number of queued requests
  }

  /**
  * Adds a request to the queue
  * @param {object} requestSettings - The settings to be used for the ajax request (uses $.ajax)
  */
  addRequest(requestSettings) {
    requestSettings.beforeSend = jqXHR => {
      this.pendingRequests.push(jqXHR);
    };

    requestSettings.complete = jqXHR => {
      const index = this.pendingRequests.indexOf(jqXHR);
      this.pendingRequests.splice(index, 1);
      this.processNext();
    };

    if (this.pendingRequests.length < this.requestsBeforeThrottle) {
      $.ajax(requestSettings);
    } else {
      this.queuedRequests.push(requestSettings);
    }
  }

  processNext() {
    const request = this.queuedRequests.shift();
    if (request) {
      $.ajax(request);
    }
  }
}

/**
* Loops over a set of items, calling an asynchronous function
* using each item as an argument.
*
* Once those functions have all completed, executes a callback.
*
* @param {function} loopFunc - the fuction to be executed. All items queued will be passed as an argument.
* @param {funciton} killFunc - function executed after the queue has been terminated manually
* @param {function} callback - executed once *all* items have been processed
*
* This whole mess needs to be refactored 'cause right now you need to pass in
* random functions that should really be contained in the class.
*/
class AsyncQueue {
  constructor({loopFunc, callback, killFunc}) {
    this.items = new Set();
    this.loopFunc = loopFunc;
    this.callback = callback;
    this.killFunc = killFunc;
  }

  /**
  * Adds an item to the queue
  * @param {*} item - item to be added to the queue. Will be passed as an argument to loopFunc
  */
  addItem(item) {
    this.items.add(item);
  }

  /**
  * Removes an item from the queue. If no items remain, fires the queue's callback.
  * @param {*} item - item to be removed from the queue
  */
  removeItem(item) {
    this.items.delete(item);
    if (this.items.size === 0) {
      this.callback();
    }
  }

  /**
  * Removes everything from the queue and executes the kill function
  */
  kill() {
    this.items.forEach(item => { this.removeItem(item); });
    this.removeItem = () => { return; };
    this.killFunc();
  }

  /**
  * Loops through all items currently in the queue.
  */
  process() {
    this.items.forEach(item => {
      this.loopFunc(item);
    });
  }
}

/**
* Basically just a tree node. But calling them nodes feels so impersonal :(
*/
class User {
  constructor({username, nicename, avatar, parent = null}) {
    this.username = username;
    this.nicename = nicename;
    this.avatar = avatar;
    this.parent = parent;
    this.link = $("<a target=\"_blank\">");
    this.link.text("@" + this.username);
    this.link.attr("href", "https://codepen.io/" + this.username);
  }
}

/**
* Stores users. Keeps track of all current usernames
* in a set for super fast searching, as well as keeping
* an array of User instances to track which level
* of the tree each user came from.
*/
class UserStore {
  constructor() {
    this.userSet = new Set();
    this.levels = [];
    this.addLevel();
  }

  /**
  * @param {User} user - the user to store
  */
  addUser(user) {
    if (this.userSet.has(user.username)) {
      return;
    }
    this.userSet.add(user.username);
    this.currentLevel.push(user);
  }

  /**
  * Creates an empty array and inserts it into the array of levels
  */
  addLevel() {
    this.currentLevel = [];
    this.levels.push(this.currentLevel);
  }
}

/**
* Just pretend this is somewhere in the codebase that makes
* any sort of logical sense thx~
*
* (it's the ticker for counting profiles searched)
*/
class Counter {
  constructor(el) {
    this.el = el;
    this.queue = 0;
    this.totalCount = 0;
    this.animating = false;
  }
  add() {
    this.queue++;
    if (!this.animating) {
      this.animating = true;
      this.raf = requestAnimationFrame(()=> {this.animate();});
    }

  }
  animate() {
    if (this.queue > 0) {
      const diff = Math.ceil(this.queue / 10);
      this.queue -= diff;
      this.totalCount += diff;
      this.el.text(this.totalCount);
      this.raf = requestAnimationFrame(()=> {this.animate();});
    } else {
      cancelAnimationFrame(this.raf);
      this.animating = false;
    }
  }
}

/**
* Overall tree of users. Does all the user stuff. users.
* @param {string} username - the parent of this tree
* @param {string} endpoint - the endpoint this string will use to add new levels ('followers' or 'following')
*/

class UserTree {
  constructor(user, endpoint, counter) {
    this.endpoint = endpoint;
    this.userStore = new UserStore();
    this.userStore.addUser(user);
    this.counter = counter;
  }

  /**
  * Adds a new level to the tree
  * @param {function} callback
  * @param {function} [killEarlyTest] - checks if the loop should bail early
  */
  addLevel(callback, killEarlyTest) {
    // Sets up a new queue that will loop through *all* users in the current level,
    // and add *their* followers/followees (depending on the tree's endpoint)
    // to a new level
    const queue = new AsyncQueue({
      loopFunc: user => {
        cpv2.getAllPages({
          endpoint: this.endpoint + "/" + user.username,
          eachPage: (response, data) => {
            data.forEach(newUser => {
              this.counter.add();
              this.userStore.addUser(new User({
                username: newUser.username,
                nicename: newUser.nicename,
                avatar: newUser.avatar,
                parent: user
              }));
            });
            if (killEarlyTest()) {
              queue.kill();
            }
          },
          onComplete: () => {
            queue.removeItem(user);
          }
        });
      },
      killFunc: () => { cpv2.bailEarly = true; },
      callback: callback
    });

    this.userStore.currentLevel.forEach(user => {
      queue.addItem(user);
    });

    this.userStore.addLevel();
    queue.process();
  }

  /**
  * Gets the number of users in the next level without actually traversing it.
  * This is useful because there is huge time saving potential -- often times
  * checking ~50 users can save us from having to loop through hundreds if not thousands.
  * @param {function} callback - will be called with the found amount as arg
  */
  getAmountInNextLevel(callback) {
    const level = this.userStore.currentLevel;
    
    // If we've already looped through this level we don't
    // need to waste time doing so again
    if (this.cachedLevel && this.cachedLevel.level == level) {
      callback(this.cachedLevel.count);
      return;
    }
    // Okay this is dumb as hell but basically we're just gonna skip this
    // step if the number of users we'd have to loop through is too high.
    // If we don't we'll waste a ton of time counting everything and frankly
    // if there's this large of a level it's gonna take a while anyways.
    //
    // Choosing 60 is totally arbitrary. The right way to do this is probably
    // to set up some sorta timeout but if everything else wasn't evidence
    // enough, I'm clearly on a mission to do things the most painful way possible.
    if (level.length > 60) {
      callback(99999);
      return;
    }

    // Otherwise if there's a sane amount of users to loop through
    // we'll go ahead and do it.
    let count = 0;
    const queue = new AsyncQueue({
      loopFunc: user => {
        cpv2.getCount(user, this.endpoint, currentCount => {
          count += currentCount;
          queue.removeItem(user);
          this.counter.add();
        });
      },
      callback: () => {
        this.cachedLevel = {
          level: level,
          count: count
        };
        callback(count);
      }
    });

    level.forEach(user => {
      queue.addItem(user.username);
    });
    queue.process();
  }
}

/**
* Handles all of the logic between comparing two users and is ultimately
* responsible for finding a match if one exists.
* @param {string} followee - username of the tree that will be built of followees
* @param {string} follower - username of the tree that will be built of followers
* @param {function} success - function called if a match is found. Uses the match as arg
* @param {function} failure - function to be called if no match exists
* @param {Counter} counter - counter to increment each time a user is looked up
*/
class TreeComparer {
  constructor({follower, followee, success, failure, counter}) {
    this.followerTreeParent = this.follower;
    this.followingTreeParent = this.followee;
    this.success = success;
    this.failure = failure;
    this.followerTree = new UserTree(followee, "followers", counter);
    this.followingTree = new UserTree(follower, "following", counter);
    this.loop();
  }

  /**
  * Main comparison loop. If a match is found or a tree is dead, stops the loop.
  * Otherwise keeps this party goin'
  */
  loop() {
    const match = this.checkForMatches();
    if (match) {
      this.buildMatchChain(match);
    } else if (this.followerTree.userStore.currentLevel.length === 0 ||
             this.followingTree.userStore.currentLevel.length === 0) {
      this.giveUp();
    } else {
      this.advanceTreeWithShorterLevel();
    }
  }

  giveUp() {
    this.failure();
  }

  /**
  * Looks at each tree to determine the size of the *next* level, and then adds
  * a level to the smaller of the two. Calls loop() when it's done.
  *
  * Basically this allows us to make as few requests as possible.
  * For example, consider two users: A (following 5k people) and B (10 followers).
  * If I want to know if A is following B, it's a lot faster to check
  * _B's followers_ rather than _A's followees_.
  *
  * Over time this can save us *hundreds* of requests.
  */
  advanceTreeWithShorterLevel() {
    this.followingTree.getAmountInNextLevel(followingCount => {
      this.followerTree.getAmountInNextLevel(followerCount => {
        let treeToAdvance;
        if (followingCount < followerCount) {
          treeToAdvance = this.followingTree;
        } else {
          treeToAdvance = this.followerTree;
        }
        treeToAdvance.addLevel(() => { this.loop(); }, () => { return this.checkForMatches(); });
      });
    });
  }

  /**
  * Looks for matches across the two trees
  * @returns {User|Boolean} match - returns the matched user if found, otherwise returns false
  */
  checkForMatches() {
    return (this.checkForDirectMatch() || this.checkForIndirectMatch() || false);
  }

  /**
  * Checks whether the opposing user set contains the target username
  * (if it does, we found them directly and don't need to loop through arrays looking for an indirect match)
  * @returns {User|Boolean} match - returns the matched user if found, otherwise returns false
  */
  checkForDirectMatch() {
    // Bail early if we can 'cause this is faster to calculate than looping through arrays
    if (!this.followingTree.userStore.userSet.has(this.followerTreeParent) &&
        !this.followerTree.userStore.userSet.has(this.followingTreeParent)) {
      return false;
    }

    // Once we know we have a match we still need to go and find it. Not sure
    // if it's faster to search the smaller level first or vice versa,
    // might be worth benchmarking at some point.
    const followingTreeCurrent = this.followingTree.userStore.currentLevel;
    for (let i = 0; i < followingTreeCurrent.length; i++) {
      if (followingTreeCurrent[i].username == this.followerTreeParent) {
        return {followingMatch: followingTreeCurrent[i]};
      }
    }

    const followerTreeCurrent = this.followerTree.userStore.currentLevel;
    for (let i = 0; i < followerTreeCurrent.length; i++) {
      if (followerTreeCurrent[i].username == this.followingTreeParent) {
        return {followerMatch: followerTreeCurrent[i]};
      }
    }
  }

  /**
  * Checks for overlap across the most recent levels of each tree
  * @returns {User|Boolean} match - returns the matched user if found, otherwise returns false
  */
  checkForIndirectMatch() {
    const followingTreeCurrent = this.followingTree.userStore.currentLevel;
    const followerTreeCurrent = this.followerTree.userStore.currentLevel;
    for (let i = 0; i < followingTreeCurrent.length; i++) {
      for (let j = 0; j < followerTreeCurrent.length; j++) {
        if (followingTreeCurrent[i].username == followerTreeCurrent[j].username) {
          return ({followingMatch: followingTreeCurrent[i], followerMatch: followerTreeCurrent[j]});
        }
      }
    }
  }

  /**
  * Constructs an ordered array from follower to followee.
  * @param {User} [followingMatch=null] - found match on the following side
  * @param {user} [followerMatch=null] - found match on the followee side
  */
  buildMatchChain({followingMatch = null, followerMatch = null}) {
    let matchArray = [];
    if (followingMatch) {
      while (followingMatch.parent) {
        matchArray.unshift(followingMatch);
        followingMatch = followingMatch.parent;
      }
      matchArray.unshift(followingMatch);
    }
    if (followerMatch) {

      // if the array is empty (ie no following match) this won't do anything,
      // if it's not empty it'll trim the inevitable duplicate
      matchArray.splice(-1, 1);
      
      while (followerMatch.parent) {
        matchArray.push(followerMatch);
        followerMatch = followerMatch.parent;
      }
      matchArray.push(followerMatch);
    }
    
    // Lets the app know there's a successful match
    // (and passes it the data so it can build out the UI)
    this.success(matchArray);
  }
}

/**
* Handles the initial selection of a user
* @param {string} type - whether the user is a follower or followee
*/
class UserUI {
  constructor(type) {
    this.type = type;
    this.template = $("#usercard-template").find(".usercard").clone();
    this.id = this.type.toLowerCase();
    this.template.attr("id", this.id);
    this.setupElements();
    this.bindEvents();
    this.ready = false;
    $(".usercards-wrap").append(this.template);
    // thx Jake https://codepen.io/jakealbaugh/pen/vOVVqG/ (who got it from Nate Wiley I guess? either way xoxo)
    this.randomUserList = ["thebabydino","tmrDevelops","pixelass","WhiteWolfWizard","natewiley","oknoblich","bennettfeely","jackrugile","hugo","LukyVj","towc","yoksel","dudleystorey","lukerichardville","Hornebom","netsi1964","nakome","berdejitendra","kenjiSpecial","katydecorah","rlemon","abergin","chrisgannon","ge1doot","lbebber","loktar00","Sonick","FWeinb","juanbrujo","andreasstorm","zadvorsky","tholman","Mombasa","fixcl","judag","MyXoToD","EduardoLopes","Zeaklous","HugoGiraudel","suez","grayghostvisuals","satchmorun","rileyjshaw","dope","gbnikolov","jakealbaugh","hakimel","elrumordelaluz","Mamboleoo","rachsmith","chrisota","kevinjannis","Kseso","TimPietrusky","ImagineProgramming","enxaneta","SitePoint","joshnh","KyleDavidE","brbcoding","TimLamber","raurir","rafaelcastrocouto","joe-watkins","alexsafayan","leemark","samarkandiy","desandro","the_ruther4d","sdras","DonKarlssonSan","carpenumidium","ettrics","pmk","jakob-e","lonekorean","pouretrebelle","jshawl","wontem","tystrong","ScottMarshall","akwright","laviperchik","sol0mka","Pesca","mariusbalaj","chriscoyier","scottkellum","donovanh","GreenSock","code_dependant","zerospree","grgrdvrt","markmurray","Thibaut","unmeshpro","davatron5000","jorgeatgu","trhino","Dreamdealer","maggiben","soulwire","32bitkid","waddington","rickyeckhardt","yukulele","egrucza","Francext","winkerVSbecks","nicolazj","schoenwaldnils","pcameron","indyplanets", "mariemosley", "dervondenbergen","fbrz","seanseansean","mikehobizal","joshbader","zachernuk","nicoptere","noahblon","daneden","cx20","codeandcam","roborich","gastonfig","simeydotme","vineethtr","gpyne","Ruddy","wenbin5243","shubhra","hynden","acarva1","martinwolf","SaschaSigl","kaliedarik","stefanjudis","Xanmia","noeldelgado","Michiel","simurai","timohausmann","GabbeV","boltaway","pixelthing","airnan","MichaelArestad","ykob","Metty","DeptofJeffAyer","atelierbram","jjmartucci","creme","soulrider911","designcouch","ZevanRosser","dehash","geoffyuen","davilious","msurguy","hans","dissimulate","edankwan","satcy","chinchang","trajektorijus","mladen___","johnie","kman","tjoen","chrisnager","AmeliaBR","yusufbkr","jonitrythall","rachelwong","beesandtrees","jpod","cchambers","auginator","frytyler","jessenwells","robertmesserle","Oka","naoyashiga","mariosmaselli","XDBoy018","larrygeams","BrianDGLS","moklick","andytran","CrocoDillon","msval","pankajparashar","jonigiuro","MarcMalignan","jeroens","ludviglindblom","sakri","keithclark","ajerez","mallendeo","alexdevero","jurbank","brownerd","jcoulterdesign","potatoDie","shakdaniel","marian-cojoc-ro","rachelnabors","uriuriuriu","virgilpana","zachacole","bronsrobin","daless14","Elbone","ZCKVNS","vsync","pirrera","matt-west","long-lazuli" ,"frxnz","Lewitje","amcharts","yy","Aldlevine","jxnblk","icebob","PageOnline", "terrymun","icutpeople","prowebix","bali_balo","fusco","jaflo","boylett","adamjld","brandonbrule","chris-creditdesign","nickmoreton","mknadler","igcorreia","scrimothy","rss","run-time","jlong","macreart","achudars","ssh","cjgammon","ControlledChaos","monstersaurous","christian-fei","captainbrosset","Funsella","kevingimbel","onediv","s","rlacorne","Yakudoo","drew_mc","shshaw","michaellee","ThisIsJohnBrown","chrislaarman","jotavejv","tdevine33","ionic","pwsm50","shadeed","georgehastings","ademilter","keithwyland","khadkamhn","rikschennink","bphillips201","zitrusfrisch","jhamon","andersschmidt","Rplus","chrishutchinson","Zaku","jsbrown","kowlor","paintbycode", "quezo", "souporserious","Guilh", "alexzaworski"];
  }

  reset() {
    this.ready = false;
    this.template.after(this.templateBackup);
    this.template.remove();
    this.template = this.templateBackup;
    this.templateBackup = this.template.clone();
    this.setupElements();
    this.bindEvents();
  }

  setupElements() {
    this.templateBackup = this.template.clone(true);
    this.form = this.template.find(".usercard__form");
    this.avatar = this.template.find(".usercard__avatar");
    this.heading = this.template.find(".usercard__name");
    this.subhead = this.template.find(".usercard__username");
    this.heading.text(this.type);
    this.subhead.text("@" + this.id);
    this.input = this.template.find(".usercard__input");
    this.inputRow = this.template.find(".usercard__input-wrap");
    this.stats = this.template.find(".usercard__userstats");
    this.back = this.template.find(".usercard__back");
    this.random = this.template.find(".usercard__random");
    this.followingStat = this.template.find(".js-following-stat");
    this.followerStat = this.template.find(".js-follower-stat");
    this.inputRow.jrumble({
      x: 3,
      y: 0,
      rotation: 0,
    });
  }

  bindEvents() {
    this.form.on("submit", e => { this.handleFormSubmit(e); });
    this.back.click(() => { this.reset(); });
    this.random.click(() => {
      const index = Math.floor(Math.random() * this.randomUserList.length);
      this.input.val(this.randomUserList[index]);
      this.input.trigger("input");
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    NProgress.configure({parent: "#" + this.id});
    NProgress.start();
    cpv2.getUser(this.input.val(), r => {
      if (r.success && r.data.username) {
        this.handleUser(r.data);
      } else {
        this.handleInvalidUser();
      }
    });
  }

  handleInvalidUser() {
    this.input.addClass("invalid");
    this.inputRow.trigger("startRumble");
    setTimeout(() => {
      this.inputRow.trigger("stopRumble");
    }, 400);
    this.input.off("input");
    this.input.one("input", () => {
      this.input.removeClass("invalid");
    });
    NProgress.done();
  }

  handleUser(userData) {
    this.user = new User({
      username: userData.username,
      nicename: userData.nicename,
      avatar: userData.avatar
    });

    // grab the image first since that's the only thing that
    // actually has to download
    this.avatar.attr("src", userData.avatar);
    this.avatar.one("load error", () => {
      NProgress.done();
      this.subhead.html(this.user.link);
      this.heading.text(this.user.nicename);
      this.followerStat.text(userData.followers);
      this.followingStat.text(userData.following);
      this.prepUser();
      this.ready = true;
    });

  }

  prepUser() {
    this.stats.addClass("prepped");
    this.heading.addClass("prepped");
    this.avatar.addClass("prepped");
    this.subhead.addClass("prepped");
    this.revealUser();
  }

  revealUser() {
    this.form.addClass("hidden");

    // just kinda feels right if it's delayed a bit
    setTimeout(()=> { this.back.addClass("active"); }, 100);

    // forces repaint so animations all fire
    this.template.find(".prepped").hide().show(0).addClass("active");
  }

  isReady() {
    if (!this.ready) {
      this.handleInvalidUser();
      return false;
    }
    return true;
  }
}

/**
* ...This is what happens when you don't use a framework.
* ...
* ...Use a framework.
*/
class App {
  constructor() {
    this.cache();
    this.init();
  }
  
  cache() {
    this.cache = $("body").clone();
  }
  
  init() {
    this.follower = new UserUI("Follower");
    this.followee = new UserUI("Followee");
    this.startButton = $(".start");
    this.startScreen = $("#start-screen");
    this.resultScreen = $("#result-screen");
    this.successScreen = $("#success-screen");
    this.resultWrap = $("#result-wrapper");
    this.counter = $("#counter");
    this.failScreen = $("#fail-screen");
    this.resetButton = $(".js-reset");
    this.bindEvents();
  }
  
  restoreCache() {
    $("body").replaceWith(this.cache.clone());
    this.init();
  }
  
  // I am the undisputed champion of 
  // semantic naming conventions
  hideOffscreenThingo(thingo, callback) {
    thingo.addClass("hiding");
    thingo.one("transitionend", () => {
      thingo.addClass("hidden down").removeClass("hiding");
      if (callback) {
        callback();
      }
    });
  }
  
  showOffscreenThingo(thingo, callback) {
    thingo.removeClass("hidden");
    thingo.hide().show(0).removeClass("down");
    if (callback) {
      callback();
    }
  }

  swapOffscreenThingos(currentThingo, newThingo, callback) {
    this.hideOffscreenThingo(currentThingo, ()=> {
      this.showOffscreenThingo(newThingo, () => {
        if (callback) {
          callback();
        }
      });
    });
  }
  
  getHiddenThingoHeight(thingo) {
    thingo.removeClass("hidden");
    const height = thingo.outerHeight(true);
    thingo.addClass("hidden");
    return height;
  }

  prepResultScreen() {
    NProgress.configure({
      parent: "#" + this.resultScreen.attr("id"),
      trickleSpeed: 800
    });
    NProgress.start();
    
    $("#head-to-head__follower-avatar").attr("src", this.follower.user.avatar);
    $("#head-to-head__follower-username").html(this.follower.user.link.clone());
    $("#head-to-head__follower-nicename").text(this.follower.user.nicename);
    
    $("#head-to-head__followee-avatar").attr("src", this.followee.user.avatar);
    $("#head-to-head__followee-username").html(this.followee.user.link.clone());
    $("#head-to-head__followee-nicename").text(this.followee.user.nicename);

  }

  bindEvents() {
    this.resetButton.click(() => {
      this.restoreCache();
    });
    this.startButton.click(() => {
      if (this.follower.isReady() && this.followee.isReady()) {
        this.swapOffscreenThingos(this.startScreen, this.resultScreen, () => {
          this.prepResultScreen();
          const treeComparer = new TreeComparer({
            follower: this.follower.user,
            followee: this.followee.user,
            counter: new Counter($(".counter__number")),
            success: (matchArray) => {
              NProgress.done();
              this.handleMatch(matchArray);
            },
            failure: () => {
              NProgress.done();
              this.handleNoMatch();
            }
          });
        });
      }
    });
  }

  handleMatch(matchArray) {
    const wrap = $("#pair-wrap");
    const template = $("#profile-pair").find(".profile-pair");

    // ... lol
    if (matchArray.length == 1) {
      matchArray.push(matchArray[0]);
      template.find(".follows-text").text("is literally");
    }

    for (let i = 0; i < matchArray.length - 1; i++) {
      let pair = template.clone();
      const follower = pair.find(".profile-pair__follower");
      const followee = pair.find(".profile-pair__followee");
      follower.find(".profile-pair__avatar").attr("src", matchArray[i].avatar);
      follower.find(".profile-pair__details__name").text(matchArray[i].nicename);
      follower.find(".profile-pair__details__username").html(matchArray[i].link.clone());
      followee.find(".profile-pair__avatar").attr("src", matchArray[i + 1].avatar);
      followee.find(".profile-pair__details__name").text(matchArray[i + 1].nicename);
      followee.find(".profile-pair__details__username").html(matchArray[i + 1].link.clone());
      wrap.append(pair);
    }
    this.displayResults(this.successScreen);
  }

  handleNoMatch() {
    this.displayResults(this.failScreen);
  }

  displayResults(resultScreen) {
    
    // ... I don't know why this needs 8 added pls help
    this.resultWrap.height(this.resultWrap.outerHeight(true) + 8);
    
    this.resultWrap.height(this.getHiddenThingoHeight(resultScreen));
    this.hideOffscreenThingo(this.counter, () => {
      this.showOffscreenThingo(resultScreen);
    });
  }
}

// init stuff
NProgress.configure({
  speed: 140,
});
const cpv2 = new CPV2();
const app = new App();

// footer was covering UI/looked bad in CodePen grids
if (!!window.location.pathname.match(/fullcpgrid/)) {
  $("footer").hide();
}