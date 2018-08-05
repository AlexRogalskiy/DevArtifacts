/*
 * Bullshit Job Title Generator
 *  
 * Inspired by https://github.com/bullgit/bullshit-job-titles
 * by bullgit.github.io
 * 
 * 
 * 2013 by Tim Pietrusky
 * timpietrusky.com
 */

BullshitJobTitleGenerator = (function() {
    
  function BullshitJobTitleGenerator(args) {
    try {
      // Parent element
      this.el = $(args.el);
      this.button = this.el.find(args.button);
      this.appendAfterEl = this.el.find("hr");
      this.generatedEl = this.el.find(args.generatedClassName);
      
      this.generated = 0;
      
      // The name of the class of each job title
      this.className = args.className;
      
      this.firstPart = [
        'Web', 
        'Internet',
        'Senior', 
        'Lead',
        'Professional', 
        'Junior', 
        'Google',
        'Yahoo',
        'Flash',
        'Homepage',
        'Creative',
        'Future',
        'Dreamweaver',
        'Photoshop',
        'Joomla',
        'Frontpage',
        'HTML',
        'CSS',
        'Responsive',
        'WordPress',
        'CodePen',
        'Dribbble',
        'Internet Explorer',
        'GitHub',
        'Office',
        'Reddit',
        'NULL',
        'Undefined',
        'Error',
        'IT',
        'Marketing',
        'SEO',
        'Java',
        'C',
        'C++',
        'PHP',
        'Python',
        'Ruby',
        'SQL',
        'JavaScript',
        'Frontend',
        'Backend',
        'Chrome',
        'Safari',
        'Firefox',
        'Twitter',
        'HackerNews',
        'Social',
        'Linux',
        'Mac',
        'Windows',
        'Android',
        'iOS',
        'Hashtag',
        'Sidebar',
        'cssdeck',
        'JSFiddle',
        'jQuery',
        'Microsoft',
        'Ubuntu',
        'Generator',
        'Job Title Generator',
        'bullgit',
        '4ae9b8',
        'Kickstarter',
        'ebay',
        'Facebook',
        'Google+',
        'SCSS',
        'SASS',
        'LESS',
        'Stylus',
        'Coderwall',
        'Coderbits',
        'Mobile',
        'User Experience',
        'Soundcloud',
        'Node.js',
        'AngularJS',
        'Backbone',
        'React',
        'MongoDB',
        'YouTube',
        'Sublime Text',
        'Firefox OS',
        'Wikipedia',
        'Nerd',
        'Geek',
        'LinkedIn'
      ];
      
      this.secondPart = [
        'Expert',
        'Coffee Maker',
        'File Uploader',
        'Pizza Reheater',
        'Admin',
        'Search Expert',
        'Slayer',
        'Guru',
        'Designer',
        'Mastermind',
        'Millionaire',
        'RockStar',
        'Evangelist',
        'Master',
        'Celebrity',
        'Optimizer',
        'Bitch',
        'Hacker',
        'Dev',
        'Craftsman',
        'Jedi',
        'Sithlord',
        'Person',
        'Tweeter',
        'Slut',
        'Dick',
        'Boss',
        'CTO',
        'Lady',
        'Pirate',
        'Captain',
        'Legend',
        'Ninja',
        'Zombie',
        'King',
        'Supporter',
        'Manager',
        'Director',
        'Consultant',
        'Strategist',
        'Agent',
        'Wizard',
      ];
      
      this.preFirstPart = [
        'Über',
        'Ultra',
        'Freaking',
        'Holy',
        'Only the best',
        'Awesome',
        '+1',
        '♥',
        'Insane',
        'First Class',
        'Unbelievable',
        'Gorgeous',
        'Beautiful',
        '★',
        '#1',
        'Sexy',
        'Hot',
        'One in a million',
        'Slick',
        'Brilliant',
        'Cute',
        'Nice',
        'Perfect'
      ];
      
      // Create a random job title on click
      this.button.on('click', $.proxy(function(e) {
        this.random();
      }, this));
      
      // First title
      this.random();
      
    } catch(e) {}
  };
  
  // Create a random job title
  BullshitJobTitleGenerator.prototype.random = function() {
    try {
      var title = '<span>' + this.preFirstPart[this.randomNumber(0, this.preFirstPart.length - 1)];
        
      title += "</span> " + this.firstPart[this.randomNumber(0, this.firstPart.length - 1)];
      
      title += " " + this.secondPart[this.randomNumber(0, this.secondPart.length - 1)];
  
      var child = $(
        '<h2>'
        + title +
        '</h2>'
      );
      
      // Increase count of generated titles
      this.generated += 1;
      
      // Add count to the DOM
      // this.generatedEl.html(this.generated);
      
      // Add a random class
      child.addClass(this.className + this.randomNumber(1, 12));
      
      //  this.generated
      child.attr("data-position", this.generated);
      
      // Add generated title to the DOM
      this.appendAfterEl.after(child);
    } catch (e) {
      this.random();
    }
  };
  
  // Create a random number
  // min / max
  BullshitJobTitleGenerator.prototype.randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return BullshitJobTitleGenerator;
})();



new BullshitJobTitleGenerator({
  el : $('[data-js="bullshit-jobtitle-generator"]'),
  button : '> nav > button.generate',
  className : 'bullshit-title-',
  generatedClassName : '> nav > .generated'
});