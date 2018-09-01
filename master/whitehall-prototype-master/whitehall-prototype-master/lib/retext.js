var retext = require('retext');
var dictionary = require('dictionary-en-gb');

var contractions = require('retext-contractions');
var english = require('retext-english');
var equality = require('retext-equality');
var indefiniteArticle = require('retext-indefinite-article');
var overuse = require('retext-overuse');
var passive = require('retext-passive');
var profanities = require('retext-profanities');
var readability = require('retext-readability');
var redundantAcronyms = require('retext-redundant-acronyms');
var repeatedWords = require('retext-repeated-words');
var simplify = require('retext-simplify');
var spell = require('retext-spell');
var usage = require('retext-usage');

function processMessages(messages) {
  var processedMessages = [];
  var hadHardToRead = false;

  messages.forEach(function(message) {
    switch (message.source) {
      case 'retext-repeated-words':
       // `for ` to `for for`
        message.actual = message.actual + message.actual;
        processedMessages.push(message);
        break;
      case 'retext-readability':
        if (!hadHardToRead) {
          message.message = 'Sentence reading age over 16, it may be hard to read';
          processedMessages.push(message);
          hadHardToRead = true;
        }
        break;
      case 'retext-profanities':
        var notSwears = ['welfare'];

        if (notSwears.includes(message.actual)) {
          break;
        }

        if (message.profanitySeverity > 1) {
          processedMessages.push(message);
        }
        break;
      case 'retext-contractions':
        // Don’t warn about ”’ not matching "'
        var converted = message.expected[0].replace(/[\u2018\u2019]/g, "'")
                                           .replace(/[\u201C\u201D]/g, '"');
        if (converted != message.actual) {
          processedMessages.push(message);
        }
        break;
      default:
        processedMessages.push(message);
    }
  });

  return processedMessages;
}

function customChecks(text, messages) {
  //checkForLongSentences(text, messages);
  checkForLongParagraphs(text, messages);
}

function checkForLongSentences(text, messages) {
  var sentences = text.split(/\.[\s\n]/g)

  sentences.forEach(function(sentence) {
    var wordCount = sentence.split(' ').length;
    if (wordCount > 40) {
      messages.push({
        actual: sentence,
        reason: 'Sentence too long ('+wordCount+'/40 words)',
        message: 'Sentence too long ('+wordCount+'/40 words)',
        name: '--',
        ruleId: 'checkForLongSentences',
        source: 'checkForLongSentences'
      });
    }
  });
}

function checkForLongParagraphs(text, messages) {
  var paragraphs = text.split('\n');
  paragraphs.forEach(function(para) {
    var wordCount = para.split(' ').length;
    if (wordCount > 150) {
      messages.push({
        actual: para,
        reason: 'Paragraph too long ('+wordCount+'/150 words)',
        message: 'Paragraph too long ('+wordCount+'/150 words)',
        name: '--',
        ruleId: 'checkForLongParagraphs',
        source: 'checkForLongParagraphs'
      });
    }
  });
}

exports.checkText = function (text, locals) {
  retext()
    .use(contractions)
    //.use(equality)
    //.use(indefiniteArticle)
    //.use(overuse)
    //.use(passive)
    .use(profanities)
    //.use(readability, { age: 19 })
    .use(redundantAcronyms)
    .use(repeatedWords)
    //.use(simplify)
    //.use(spell, dictionary)
    //.use(usage)
    .process(text, function (err, file) {
      console.log(file.messages);

      messages = processMessages(file.messages)
      customChecks(text, messages);

      locals.report = messages;
      console.error(err || file);
    });
}
