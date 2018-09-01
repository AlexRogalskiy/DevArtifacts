// https://github.com/hannalaakso/accessible-timeout-warning
// https://github.com/hannalaakso/accessible-timeout-warning/blob/master/app/assets/javascripts/modal-dialog.js
;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  var $ = global.jQuery

  // Modal dialog prototype
  GOVUK.modalDialog = {
    el: document.getElementById('js-modal-dialog'),
    $el: $('#js-modal-dialog'),
    $lastFocusedEl: null,
    $openButton: $('#openModal'),
    $closeButton: $('.modal-dialog .js-dialog-close'),
    $cancelButton: $('.modal-dialog .js-dialog-cancel'),
    dialogIsOpenClass: 'dialog-is-open',

    bindUIElements: function () {
      GOVUK.modalDialog.$openButton.on('click', function (e) {
        GOVUK.modalDialog.openDialog()
        return false
      })

      GOVUK.modalDialog.$closeButton.on('click', function (e) {
        e.preventDefault()
        GOVUK.modalDialog.closeDialog()
      })

      GOVUK.modalDialog.$cancelButton.on('click', function (e) {
        e.preventDefault()
      })
    },
    isDialogOpen: function () {
      return GOVUK.modalDialog.el['open']
    },
    openDialog: function () {
      if (!GOVUK.modalDialog.isDialogOpen()) {
        $('html, body').addClass(GOVUK.modalDialog.dialogIsOpenClass)
        GOVUK.modalDialog.saveLastFocusedEl()
        GOVUK.modalDialog.makePageContentInert()
        GOVUK.modalDialog.el.showModal()
      }
    },
    closeDialog: function () {
      if (GOVUK.modalDialog.isDialogOpen()) {
        $('html, body').removeClass(GOVUK.modalDialog.dialogIsOpenClass)
        GOVUK.modalDialog.el.close()
        GOVUK.modalDialog.setFocusOnLastFocusedEl()
        GOVUK.modalDialog.removeInertFromPageContent()
      }
    },
    saveLastFocusedEl: function () {
      GOVUK.modalDialog.$lastFocusedEl = document.activeElement
      if (!GOVUK.modalDialog.$lastFocusedEl || GOVUK.modalDialog.$lastFocusedEl === document.body) {
        GOVUK.modalDialog.$lastFocusedEl = null
      } else if (document.querySelector) {
        GOVUK.modalDialog.$lastFocusedEl = document.querySelector(':focus')
      }
    },
    // Set focus back on last focused el when modal closed
    setFocusOnLastFocusedEl: function () {
      if (GOVUK.modalDialog.$lastFocusedEl) {
        window.setTimeout(function () {
          //GOVUK.modalDialog.$lastFocusedEl.focus()
        }, 0)
      }
    },
    // Set page content to inert to indicate to screenreaders it's inactive
    // NB: This will look for #content for toggling inert state
    makePageContentInert: function () {
      if (document.querySelector('#content')) {
        document.querySelector('#content').inert = true
        document.querySelector('#content').setAttribute('aria-hidden', 'true')
      }
    },
    // Make page content active when modal is not open
    // NB: This will look for #content for toggling inert state
    removeInertFromPageContent: function () {
      if (document.querySelector('#content')) {
        document.querySelector('#content').inert = false
        document.querySelector('#content').setAttribute('aria-hidden', 'false')
      }
    },
    // Close modal when ESC pressed
    escClose: function () {
      $(document).keydown(function (e) {
        if (GOVUK.modalDialog.isDialogOpen() && e.keyCode === 27) {
          GOVUK.modalDialog.closeDialog()
        }
      })
    },
    init: function () {
      if (GOVUK.modalDialog.el) {
        // Native dialog is not supported by browser so use polyfill
        if (typeof HTMLDialogElement !== 'function') {
          window.dialogPolyfill.registerDialog(GOVUK.modalDialog.el)
        }
        GOVUK.modalDialog.bindUIElements()
        GOVUK.modalDialog.escClose()
      }
    }
  }
  global.GOVUK = GOVUK
})(window); // eslint-disable-line semi
