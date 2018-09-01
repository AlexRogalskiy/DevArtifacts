// Core dependencies
const fs = require('fs')

// NPM dependencies
const basicAuth = require('basic-auth')
const marked = require('marked')
const path = require('path')
const portScanner = require('portscanner')
const prompt = require('prompt')
// const request = require('sync-request')

// Local dependencies
const config = require('../app/config.js')

// Variables
// var releaseUrl = null

// Require core and custom filters, merges to one object
// and then add the methods to Nunjucks environment
exports.addNunjucksFilters = function (env) {
  var coreFilters = require('./core_filters.js')(env)
  var customFilters = require('../app/filters.js')(env)
  var filters = Object.assign(coreFilters, customFilters)
  Object.keys(filters).forEach(function (filterName) {
    env.addFilter(filterName, filters[filterName])
  })
}

// Add Nunjucks function called 'checked' to populate radios and checkboxes
exports.addCheckedFunction = function (env) {
  env.addGlobal('checked', function (name, value) {
    // Check data exists
    if (this.ctx.data === undefined) {
      return ''
    }

    var storedValue = this.ctx.data[name]

    // Check the requested data exists
    if (storedValue === undefined) {
      return ''
    }

    var checked = ''

    // If data is an array, check it exists in the array
    if (Array.isArray(storedValue)) {
      if (storedValue.indexOf(value) !== -1) {
        checked = 'checked'
      }
    } else {
      // The data is just a simple value, check it matches
      if (storedValue === value) {
        checked = 'checked'
      }
    }
    return checked
  })
}

/**
 * Simple basic auth middleware for use with Express 4.x.
 *
 * Based on template found at: http://www.danielstjules.com/2014/08/03/basic-auth-with-express-4/
 *
 * @example
 * app.use('/api-requiring-auth', utils.basicAuth('username', 'password'))
 *
 * @param   {string}   username Expected username
 * @param   {string}   password Expected password
 * @returns {function} Express 4 middleware requiring the given credentials
 */

exports.basicAuth = function (username, password) {
  return function (req, res, next) {
    if (!username || !password) {
      console.log('Username or password is not set.')
      return res.send('<h1>Error:</h1><p>Username or password not set. <a href="https://govuk-prototype-kit.herokuapp.com/docs/publishing-on-heroku#5-set-a-username-and-password">See guidance for setting these</a>.</p>')
    }

    var user = basicAuth(req)

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }

    next()
  }
}

// Find an available port to run the server on
exports.findAvailablePort = function (app, callback) {
  var port = null

  // When the server starts, we store the port in .port.tmp so it tries to restart
  // on the same port
  try {
    port = Number(fs.readFileSync(path.join(__dirname, '/../.port.tmp')))
  } catch (e) {
    port = Number(process.env.PORT || config.port)
  }

  console.log('')

  // Check port is free, else offer to change
  portScanner.findAPortNotInUse(port, port + 50, '127.0.0.1', function (error, availablePort) {
    if (error) { throw error }
    if (port === availablePort) {
      // Port is free, return it via the callback
      callback(port)
    } else {
      // Port in use - offer to change to available port
      console.error('ERROR: Port ' + port + ' in use - you may have another prototype running.\n')
      // Set up prompt settings
      prompt.colors = false
      prompt.start()
      prompt.message = ''
      prompt.delimiter = ''

      // Ask user if they want to change port
      prompt.get([{
        name: 'answer',
        description: 'Change to an available port? (y/n)',
        required: true,
        type: 'string',
        pattern: /y(es)?|no?/i,
        message: 'Please enter y or n'
      }], function (err, result) {
        if (err) { throw err }
        if (result.answer.match(/y(es)?/i)) {
          // User answers yes
          port = availablePort
          fs.writeFileSync(path.join(__dirname, '/../.port.tmp'), port)
          console.log('Changed to port ' + port)

          callback(port)
        } else {
          // User answers no - exit
          console.log('\nYou can set a new default port in server.js, or by running the server with PORT=XXXX')
          console.log("\nExit by pressing 'ctrl + c'")
          process.exit(0)
        }
      })
    }
  })
}

// Redirect HTTP requests to HTTPS
exports.forceHttps = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log('Redirecting request to https')
    // 302 temporary - this is a feature that can be disabled
    return res.redirect(302, 'https://' + req.get('Host') + req.url)
  }
  next()
}

// Synchronously get the URL for the latest release on GitHub and cache it
exports.getLatestRelease = function () {
  // use a local zip while we're in private beta
  return '/public/downloads/govuk-prototype-kit-private-beta.zip'
  //
  // var url = ''
  //
  // if (releaseUrl !== null) {
  //   // Release URL already exists
  //   console.log('Release url cached:', releaseUrl)
  //   return releaseUrl
  // } else {
  //   // Release URL doesn't exist
  //   var options = {
  //     headers: {'user-agent': 'node.js'}
  //   }
  //   var gitHubUrl = 'https://api.github.com/repos/alphagov/govuk_prototype_kit/releases/latest'
  //   try {
  //     console.log('Getting latest release from GitHub')
  //
  //     var res = request('GET', gitHubUrl, options)
  //     var data = JSON.parse(res.getBody('utf8'))
  //     var zipballUrl = data['zipball_url']
  //     var releaseVersion = zipballUrl.split('/').pop()
  //     var urlStart = 'https://github.com/alphagov/govuk_prototype_kit/archive/'
  //     var urlEnd = '.zip'
  //     var zipUrl = urlStart + releaseVersion + urlEnd
  //
  //     console.log('Release URL is', zipUrl)
  //     releaseUrl = zipUrl
  //     url = releaseUrl
  //   } catch (err) {
  //     url = 'https://github.com/alphagov/govuk_prototype_kit/releases/latest'
  //     console.log("Couldn't retrieve release URL")
  //   }
  // }
  // return url
}

// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// or /app/views/text/index.html
exports.matchRoutes = function (req, res) {
  var path = (req.params[0])
  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/index', function (err2, html) {
        if (err2) {
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
}

// Try to match a request to a Markdown file and render it
exports.matchMdRoutes = function (req, res) {
  var docsPath = '/../docs/documentation/'
  if (fs.existsSync(path.join(__dirname, docsPath, req.params[0] + '.md'), 'utf8')) {
    var doc = fs.readFileSync(path.join(__dirname, docsPath, req.params[0] + '.md'), 'utf8')
    var html = marked(doc)
    res.render('documentation_template', {'document': html})
    return true
  }
  return false
}

// Store data from POST body or GET query in session
var storeData = function (input, store) {
  for (var i in input) {
    // any input where the name starts with _ is ignored
    if (i.indexOf('_') === 0) {
      continue
    }

    var val = input[i]

    // Delete values when users unselect checkboxes
    if (val === '_unchecked' || val === ['_unchecked']) {
      delete store.data[i]
      continue
    }

    // Remove _unchecked from arrays of checkboxes
    if (Array.isArray(val)) {
      var index = val.indexOf('_unchecked')
      if (index !== -1) {
        val.splice(index, 1)
      }
    }

    store.data[i] = val
  }
}

// Middleware - store any data sent in session, and pass it to all views
exports.autoStoreData = function (req, res, next) {
  if (!req.session.data) {
    req.session.data = {
      'new-state': 'Draft',
      'new-edition': '1st edition',
      'new-history': [],
      'new-lead-organisation': 'Department for Work & Pensions',

      'draft-title': 'Housing Benefit information, guidance and good practice for local authority staff',
      'draft-summary': 'This information is for local authority staff who process claims and administer Housing Benefit, including Local Housing Allowance.',
      'draft-body': "## Introduction\n\nThis information, guidance and good practice is for local authority staff who process claims and administer Housing Benefit, including Local Housing Allowance. It helps them deliver efficient and effective Housing Benefit services. \n\n## Housing Benefit delivery information, guidance and support\n\n[Housing Benefit Manual](/government/admin/collections/628950) -- this manual is for the administration of the Housing Benefit and Council Tax Benefit schemes by local authorities and housing authorities in Great Britain\n\n[Additional individual DWP guidance and good practice publications](/government/admin/collections/628964) -- Housing Benefit individual guides and good practice\n\n[Housing Benefit adjudication circulars](/government/admin/collections/377426) -- adjudication circulars ('A') circulars provide updates to the Housing Benefit guidance manual for local authority staff\n\n[Housing Benefit subsidy circulars](/government/admin/collections/377719) -- subsidy ('S') circulars provide information about the money the government pays local authorities to administer Housing Benefit and other financial matters\n\n[Urgent and General information bulletins](/government/admin/collections/291051) -- Housing Benefit general information bulletins provide general information, updates and reminders on Housing Benefit and other areas of DWP to local authority staff\n\n[HB Direct newsletter](/government/admin/collections/287044) -- the HB Direct newsletter provides the latest information and updates on policy changes, good practice and initiatives that impact on Housing Benefit\n\n[Right Benefit Initiative (RBI)](/government/admin/collections/732243) -- the RBI provides financial support to ensure local authorities are resourced to action Optional Real Time Information (RTI) referrals in 2017/18 to reduce Housing Benefit fraud and error. \n\n[Housing Benefit expenditure and subsidy data](/government/admin/collections/625824) -- the data tables show the local authority expenditure and subsidy of HB for England, Scotland and Wales\n\n[DWP and local authority consultation groups](https://www.gov.uk/government/groups/dwp-local-authority-welfare-steering-group) -- these are the forums for DWP and local authorities to discuss strategic issues relating to Housing Benefit and local authority funding\n\n \n## Other information for local authorities\n\n[Universal Credit for local authorities](/government/admin/collections/281225) -- this collection brings together documents, information and updates about Universal Credit for local authority staff\n\n[Local Housing Allowance](/government/admin/collections/252843) -- the Local Housing Allowance arrangements apply to people who rent from private landlords\n\n[Fraud and error – loss of benefit penalty regime](/government/admin/collections/252790) – this series brings together information for local authority staff relating to fraud and error and the Loss of Benefit penalty regime\n\n## Housing Benefit statistics\n\nHousing Benefit statistics are published regularly. Information is available about:\n\n* [recoveries on fraud](/government/admin/collections/605692)\n* [caseloads](/government/admin/collections/586799)\n* [speed of processing](/government/admin/collections/587242)\n* [caseload management information](/government/admin/collections/671203)\n\n## Housing information in The National Archives\n\nThis housing information has been archived, but is still available to you in The National Archives:\n\n* [Housing Benefit and Council Tax Benefit Good Practice guide](http://webarchive.nationalarchives.gov.uk/20130107093842/http:/www.dwp.gov.uk/local-authority-staff/housing-benefit/)\n* [Model forms](http://webarchive.nationalarchives.gov.uk/20130703092741/http:/www.dwp.gov.uk/local-authority-staff/housing-benefit/claims-processing/claims-guidance/forms/)\n* [other housing information for local authority staff](http://webarchive.nationalarchives.gov.uk/20130107093842/http:/www.dwp.gov.uk/local-authority-staff/housing-benefit/)\n\n\n## Performance Development Team support\n\nThe Performance Development Team (PDT) is comprised of performance specialists and works with individual and groups of local authorities to help them become more efficient and improve performance.\n\nThe team’s help is paid for by DWP but local authorities have to invest the time and resources needed to achieve improvements. Local authorities are responsible for delivering improvement plans. In return for our investment, the PDT simply asks that authorities keep DWP informed of progress so that it can be sure improvements in the delivery of public services are realised.\n\nThe PDT is available to assist local authorities in areas such as:\n\n* working with councils to eliminate delay and duplication from their processes and increase their effectiveness and efficiency using, for example, Lean principles and reducing the time taken to obtain information in support of a claim \n* helping councils explore the feasibility of sharing Housing Benefit services to generate economies and efficiencies\n* assisting councils that want to improve their management of Housing Benefit overpayments so that loss is minimised through more efficient and effective prevention and recovery action\n* making best use of fraud resources\n* reducing backlogs in preparation for migration to Universal Credit\n* developing partnerships with groups or individual councils to help them plan, implement and manage specific projects\n\nIf you would like more information please email: <hdd.pdtconsultants@dwp.gsi.gov.uk>\n\n##  Local Authority Data Share (LADS) Delivery Team\n\nThe LADS Delivery team are part of the Housing Delivery Division Change Programme, responsible for the delivery of IT and strategic data sharing initiatives, from DWP to local authorities. Automated Transfers to Local Authority Systems (ATLAS) has already increased the amount of information that can be sent automatically to local authorities in a format that allows direct loading into their systems. \n\nThe first phase of ATLAS was successfully rolled out to all authorities on 4 July 2011, providing HM Revenue & Customs with tax credits award data.\n\nThe second phase extended ATLAS to deliver notifications for a range of DWP benefits in 2012, with Personal Independence Payment and benefit cap notifications starting in 2013. Other initiatives to help local authorities address fraud and error include the implementation of Real Time Information data for earnings and occupational pensions.\n\nDWP have continued to build on the ATLAS IT infrastructure to deliver even more citizen data to local authorities, plus introducing new strategic data sharing routes through the new DWP Data Hub. \n\nWe have now started to share data on behalf of Universal Credit (both live and full services) in order to support Council Tax Reduction schemes and continue to build on this. Plus we have delivered the ability for local authorities to make debt recoveries from Universal Credit, as well as seeking to reduce the administrative burden on local authorities by reviewing current data sharing arrangements and ensuring new data is made available to support changes in legislation.\n\nThere is more information for local authorities in the ATLAS Awareness Pack, available on the 'local authority data share (all LAs) workspace' on Glasscubes, as well as other guidance and good practice, especially that relating to 'batch processing' and 'automation advice'.\n\n## Glasscubes\n\nGlasscubes is an online communication tool to share documents about local authority data sharing in a single, secure location. You can find the information in the 'local authority data share (all LAs) workspace'. Glasscubes replaces Huddle.\n\nGlasscubes also provides a forum to start and join in discussions between local authorities, DWP and local authority IT suppliers.\n\nRequest access to Glasscubes by sending your individual secure (GSX/GCSX/GSE) or standard email address to – example@dwp.gsi.gov.uk. Do not use a team email address.\n\n## Council Tax Benefit references\n\nPublications may include references to Council Tax Benefit as this benefit was provided by local authorities alongside Housing Benefit through to March 2013. \n\nIn April 2013 Council Tax Benefit was replaced by local authorities' own council tax support and reduction schemes, removing DWP's involvement. \n\nDWP guidance does not cover these local schemes. \n\nReaders will need to consider references to Council Tax Benefit in the light of this information as it is not possible or appropriate to remove or amend all the references.",
      'draft-state': 'Draft',
      'draft-edition': '4th edition',
      'draft-history': [],
      'draft-lead-organisation': 'Department for Work & Pensions',
      'draft-format': 'Detailed guide',
      'draft-published-before': 'No, this content is new',

      'submitted-title': 'Submitted title',
      'submitted-summary': 'Submitted summary',
      'submitted-body': 'Submitted body',
      'submitted-state': 'Submitted',
      'submitted-edition': '1st edition',
      'submitted-history': [],
      'submitted-lead-organisation': 'Department for Work & Pensions',

      'published-title': 'Published title',
      'published-summary': 'Published summary',
      'published-body': 'Published body',
      'published-state': 'Published',
      'published-edition': '2nd edition',
      'published-history': [],
      'published-lead-organisation': 'Department for Work & Pensions'
    }
  }

  storeData(req.body, req.session)
  storeData(req.query, req.session)

  // Send session data to all views

  res.locals.data = {}

  for (var j in req.session.data) {
    res.locals.data[j] = req.session.data[j]
  }

  next()
}
