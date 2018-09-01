const express = require('express')
const retext = require('../lib/retext.js')
const marked = require('../lib/marked.js')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/dashboard', function(req, res) {
  res.render('dashboard');
});

router.get('/intent', function(req, res) {
  res.render('intent');
});

router.get('/:state/submit-for-review', function(req, res) {
  var locals = {};
  validateEdition(req, locals);

  if (locals.success) {
    req.session.data[locals.state + '-state'] = 'Submitted';
    req.session.data[locals.state + '-show-errors'] = false;
    req.session.data[locals.state + '-show-success'] = true;
  } else {
    req.session.data[locals.state + '-show-errors'] = true;
    req.session.data[locals.state + '-show-success'] = false;
  }

  res.redirect('/' + locals.state + '/document-tasks');
});

// Add your routes here - above the module.exports line

router.get('/:state/attachment/:attachmentId', function(req, res){
  res.render('attachment', req.params)
});

router.get('/patterns/content-checker', function(req, res) {
  var text = req.session.data['text'];
  var locals = {};
  retext.checkText(text, locals);
  res.render('patterns/content-checker', locals)
})

router.get('/:state/preview', function(req, res) {
  var state = req.params.state;
  var text = req.session.data[state + '-body'] || '';
  var locals = { state: state };
  marked.convertMarkdownToHTML(text, locals);
  res.render('preview', locals)
})

router.get('/publishing-guidance', function(req, res) {
  var text = "Content published in Whitehall publisher on www.gov.uk should be either:\n\n* guidance to help users complete a transaction with government\n* information to help users understand what government is doing\n\nIt should be information only government can provide.\n\n### Check existing content\nNew content should not significantly repeat existing content. \n\n[Search GOV.UK](https://www.gov.uk/search) to check if the user need is being met elsewhere.\n\n### Ask GDS\nIf you’re unsure [ask the GOV.UK team at the Government Digital Service](https://support.integration.publishing.service.gov.uk/).\n\n## What to publish elsewhere\n\n### Campaigns\n\nCampaign websites are designed to:\n\n* change behaviour by encouraging people to lead healthy, safer lives\n* ensure operational effectiveness of Government by informing people about public services\n* enhance the reputation of the UK, promote interests internationally, and respond in times of crisis\n* explain government policies and programmes to clarify legal or statutory requirements\n\nCampaign websites can be set up using either:\n\n* the government Campaign Platform\n* or a bespoke campaigns microsite\n\n### Intranets\nInformation exclusively for civil servants with no public interest should be published on internal intranets.\n\n### Parliament.uk \nThe [Parliament website](https://www.parliament.uk/) covers the work of parliament to scrutinise proposed legislation in the House of Commons, the House of Lords, and committees. \n\n### Hansard\n[Hansard](https://hansard.parliament.uk/) is the record of everything said or written during proceedings of the House of Commons and the House of Lords.\n\n### Legislation.gov.uk\nBills which have been approved by the Commons, the Lords, and The Queen become law and are recorded on [Legislation.gov.uk](http://www.legislation.gov.uk/).\n\n### Devolved government\nIn Scotland, Wales and Northern Ireland, devolved administrations are responsible for many domestic policy issues, and their Parliaments/Assemblies have law-making powers for those areas.\n\n[Read more about how government is run](https://www.gov.uk/government/how-government-works#how-government-is-run)\n\n### Other organisations\nInformation or services that can be better supplied by organisations outside government should be linked to and not reproduced. For example, Shelter or the NHS.\n\n### Ask GDS\nIf you’re unsure [ask the GOV.UK team at the Government Digital Service](https://support.integration.publishing.service.gov.uk/).\n";
  var locals = {};
  marked.convertMarkdownToHTML(text, locals);
  res.render('publishing-guidance', locals);
})

router.get('/:state/document-type', function(req, res) {
  var state = req.params.state;

  if (req.session.data[state + '-format'] == 'News article'
        || req.session.data[state + '-format'] == 'Speech'
        || req.session.data[state + '-format'] == 'Publication'
        || req.session.data[state + '-format'] == 'Medical safety alert') {
    res.render('document-type', req.params);
  } else {
    res.redirect('/' + state + '/title-summary-body');
  }
});

router.get('/content-check', function(req, res){
  checkContent(req, res, req.query['text']);
});

router.post('/content-check', function(req, res){
  checkContent(req, res, req.body['text']);
});

function checkContent(req, res, text) {
  var obj = {};

  retext.checkText(text, obj);
  res.header('Content-type','application/json');
  res.header('Charset','utf8');
  res.send(JSON.stringify(obj));
}

router.get('/live-preview', function(req, res){
  livePreview(req, res, req.query['text']);
});

router.post('/live-preview', function(req, res){
  livePreview(req, res, req.body['text']);
});

function livePreview(req, res, text) {
  var obj = {};
  text = text || "";
  marked.convertMarkdownToHTML(text, obj);
  res.header('Content-type','application/json');
  res.header('Charset','utf8');
  res.send(JSON.stringify(obj));
}

router.get('/:state(new|draft|submitted|published)/:page', function(req, res) {
  var locals = {}
  validateEdition(req, locals);
  res.render(req.params.page, locals)
});

function validateEdition(req, locals) {
  var state = req.params.state;
  var data = req.session.data;
  var title_summary_body_errors = [];
  var about_content_errors = [];
  var errors;

  data[locals.state + '-show-success'] = false;
  locals.state = state;

  if (!data[state + '-summary']) {
    title_summary_body_errors.push({
      title: 'Enter a summary',
      page: 'title-summary-body',
      field: 'summary'
    })
  }

  if (!data[state + '-body']) {
    title_summary_body_errors.push({
      title: 'Enter body copy',
      page: 'title-summary-body',
      field: 'body'
    })
  }

  if (!data[state + '-published-before']) {
    about_content_errors.push({
      title: 'Indicate if this content is new or has been published elsewhere',
      page: 'about-content',
      field: 'published-before'
    })
  }

  if (!data[state + '-tag-count'] || data[state + '-tag-count'] < 1) {
    about_content_errors.push({
      title: 'Enter at least one tag',
      page: 'about-content',
      field: 'tag-on-govuk'
    })
  }

  if (!data[state + '-lead-organisation']) {
    about_content_errors.push({
      title: 'Enter a lead organisation',
      page: 'about-content',
      field: 'lead-organisation'
    })
  }

  errors = [].concat(title_summary_body_errors).concat(about_content_errors);

  if (errors.length > 0) {
    locals.errors = errors;
    locals.title_summary_body_errors = title_summary_body_errors;
    locals.about_content_errors = about_content_errors;
    locals.field_errors = errors.reduce(function(map, obj) {
      map[obj.field] = obj.title;
      return map;
    }, {});
  } else {
    locals.success = true;
  }
}

module.exports = router
