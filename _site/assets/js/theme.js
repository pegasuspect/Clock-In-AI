/*!
  * Jumpstart Bootstrap Theme
  * Copyright 2018-2020 Medium Rare (undefined)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('aos'), require('jquery'), require('scrollmonitor'), require('smooth-scroll'), require('@tanem/svg-injector')) :
  typeof define === 'function' && define.amd ? define(['exports', 'aos', 'jquery', 'scrollmonitor', 'smooth-scroll', '@tanem/svg-injector'], factory) :
  (global = global || self, factory(global.theme = {}, global.AOS, global.jQuery, global.scrollMonitor, global.SmoothScroll, global.SVGInjector));
}(this, (function (exports, AOS, jQuery$1, scrollMonitor, SmoothScroll, svgInjector) { 'use strict';

  AOS = AOS && AOS.hasOwnProperty('default') ? AOS['default'] : AOS;
  jQuery$1 = jQuery$1 && jQuery$1.hasOwnProperty('default') ? jQuery$1['default'] : jQuery$1;
  scrollMonitor = scrollMonitor && scrollMonitor.hasOwnProperty('default') ? scrollMonitor['default'] : scrollMonitor;
  SmoothScroll = SmoothScroll && SmoothScroll.hasOwnProperty('default') ? SmoothScroll['default'] : SmoothScroll;

  //
  $(window).on('load', function () {
    AOS.init({
      once: true
    });
  });

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  //

  var mrUtil = function ($) {
    var VERSION = '1.2.0';
    var Tagname = {
      SCRIPT: 'script'
    };
    var Selector = {
      RECAPTCHA: '[data-recaptcha]'
    }; // Activate tooltips

    $('body').tooltip({
      selector: '[data-toggle="tooltip"]',
      container: 'body'
    }); // Activate popovers

    $('body').popover({
      selector: '[data-toggle="popover"]',
      container: 'body'
    }); // Activate toasts

    $('.toast').toast();
    var Util = {
      version: VERSION,
      selector: Selector,
      activateIframeSrc: function activateIframeSrc(iframe) {
        var $iframe = $(iframe);

        if ($iframe.attr('data-src')) {
          $iframe.attr('src', $iframe.attr('data-src'));
        }
      },
      idleIframeSrc: function idleIframeSrc(iframe) {
        var $iframe = $(iframe);
        $iframe.attr('data-src', $iframe.attr('src')).attr('src', '');
      },
      forEach: function forEach(array, callback, scope) {
        if (array) {
          if (array.length) {
            for (var i = 0; i < array.length; i += 1) {
              callback.call(scope, i, array[i]); // passes back stuff we need
            }
          } else if (array[0] || mrUtil.isElement(array)) {
            callback.call(scope, 0, array);
          }
        }
      },
      dedupArray: function dedupArray(arr) {
        return arr.reduce(function (p, c) {
          // create an identifying String from the object values
          var id = JSON.stringify(c); // if the JSON string is not found in the temp array
          // add the object to the output array
          // and add the key to the temp array

          if (p.temp.indexOf(id) === -1) {
            p.out.push(c);
            p.temp.push(id);
          }

          return p; // return the deduped array
        }, {
          temp: [],
          out: []
        }).out;
      },
      isElement: function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
      },
      getFuncFromString: function getFuncFromString(funcName, context) {
        var findFunc = funcName || null; // if already a function, return

        if (typeof findFunc === 'function') return funcName; // if string, try to find function or method of object (of "obj.func" format)

        if (typeof findFunc === 'string') {
          if (!findFunc.length) return null;
          var target = context || window;
          var func = findFunc.split('.');

          while (func.length) {
            var ns = func.shift();
            if (typeof target[ns] === 'undefined') return null;
            target = target[ns];
          }

          if (typeof target === 'function') return target;
        } // return null if could not parse


        return null;
      },
      getScript: function getScript(source, callback) {
        var script = document.createElement(Tagname.SCRIPT);
        var prior = document.getElementsByTagName(Tagname.SCRIPT)[0];
        script.async = 1;
        script.defer = 1;

        script.onreadystatechange = function (_, isAbort) {
          if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = null;
            script.onreadystatechange = null;
            script = undefined;

            if (!isAbort && callback && typeof callback === 'function') {
              callback();
            }
          }
        };

        script.onload = script.onreadystatechange;
        script.src = source;
        prior.parentNode.insertBefore(script, prior);
      }
    };
    return Util;
  }(jQuery$1);

  var mrRecaptchav2 = function ($) {
    // Check mrUtil is present and correct version
    if (!(mrUtil && mrUtil.version >= '1.2.0')) {
      throw new Error('mrUtil >= version 1.2.0 is required.');
    }
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */


    var NAME = 'mrRecaptchav2';
    var VERSION = '1.0.0';
    var DATA_KEY = 'mr.recaptchav2'; // const EVENT_KEY = `.${DATA_KEY}`;
    // const DATA_API_KEY = '.data-api';

    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var RECAPTCHA_CALLBACK = 'mrRecaptchav2Init';
    var RemoteScript = {
      RECAPTCHAV2: "https://www.google.com/recaptcha/api.js?onload=" + RECAPTCHA_CALLBACK + "&render=explicit"
    };
    var Selector = {
      DATA_RECAPTCHA: '[data-recaptcha]',
      FORM: 'form'
    };
    var Options = {
      INVISIBLE: 'invisible'
    }; // "static" properties

    var instances = [];
    var apiReady = false;
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Recaptchav2 =
    /*#__PURE__*/
    function () {
      function Recaptchav2(element) {
        this.element = element;
        this.form = this.getForm();
        this.isReady = false;
        this.isValid = false;
        this.options = $(this.element).data();
        this.invisible = this.options.size === Options.INVISIBLE;
        this.id = null; // Save instance into static property array

        instances.push(this);
      } // getters


      var _proto = Recaptchav2.prototype;

      _proto.init = function init() {
        var _this = this;

        if (this.element.innerHTML.replace(/[\s\xA0]+/g, '') === '') {
          this.id = grecaptcha.render(this.element, {
            sitekey: this.options.sitekey,
            theme: this.options.theme,
            size: this.options.size,
            badge: this.options.badge,
            tabindex: this.options.tabindex,
            callback: function callback() {
              _this.validate();
            },
            'expired-callback': function expiredCallback() {
              _this.invalidate();
            }
          });
          this.isReady = true;
        }
      };

      _proto.validate = function validate() {
        this.isValid = true;

        if (this.invisible && this.form) {
          $(this.form).trigger('submit');
        }
      };

      _proto.invalidate = function invalidate() {
        this.isValid = false;
      };

      _proto.checkValidity = function checkValidity() {
        if (this.isReady && this.isValid) {
          return true;
        }

        return false;
      };

      _proto.execute = function execute() {
        if (this.isReady && this.invisible) {
          grecaptcha.execute(this.id);
        }
      };

      _proto.reset = function reset() {
        if (this.isReady) {
          grecaptcha.reset(this.id);
          this.isValid = false;
        }
      };

      _proto.getForm = function getForm() {
        var closestForm = $(this.element).closest(Selector.FORM);
        return closestForm.length ? closestForm.get(0) : null;
      };

      Recaptchav2.getRecaptchaFromForm = function getRecaptchaFromForm(form) {
        if (mrUtil.isElement(form)) {
          var captchaElement = form.querySelector(Selector.DATA_RECAPTCHA);

          if (captchaElement) {
            var data = $(captchaElement).data(DATA_KEY);
            return data || null;
          }

          return null;
        }

        throw new TypeError('Form argument passed to getRecaptchaFromForm is not an element.');
      };

      Recaptchav2.jQueryInterface = function jQueryInterface() {
        return this.each(function jqEachRecaptchav2() {
          var $element = $(this);
          var data = $element.data(DATA_KEY);

          if (!data) {
            data = new Recaptchav2(this);
            $element.data(DATA_KEY, data);
          }
        });
      };

      _createClass(Recaptchav2, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }, {
        key: "ready",
        get: function get() {
          return apiReady;
        }
      }, {
        key: "instances",
        get: function get() {
          return instances;
        }
      }, {
        key: "apiReady",
        set: function set(ready) {
          if (ready === true && apiReady === false) {
            mrUtil.forEach(Recaptchav2.instances, function (index, instance) {
              instance.init();
            });
          }

          apiReady = true;
        }
      }]);

      return Recaptchav2;
    }();

    window.mrRecaptchav2Init = function () {
      mrRecaptchav2.apiReady = true;
    };
    /**
     * ------------------------------------------------------------------------
     * Initialise API javascript if recaptcha widgets are found
     * ------------------------------------------------------------------------
     */


    $(document).ready(function () {
      var Recaptchav2Elements = $.makeArray($(Selector.DATA_RECAPTCHA));

      if (Recaptchav2Elements.length > 0) {
        mrUtil.getScript(RemoteScript.RECAPTCHAV2);
        /* eslint-disable no-plusplus */

        for (var i = Recaptchav2Elements.length; i--;) {
          var $Recaptchav2 = $(Recaptchav2Elements[i]);
          Recaptchav2.jQueryInterface.call($Recaptchav2, $Recaptchav2.data());
        }
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    /* eslint-disable no-param-reassign */

    $.fn[NAME] = Recaptchav2.jQueryInterface;
    $.fn[NAME].Constructor = Recaptchav2;

    $.fn[NAME].noConflict = function Recaptchav2NoConflict() {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Recaptchav2.jQueryInterface;
    };
    /* eslint-enable no-param-reassign */


    return Recaptchav2;
  }(jQuery);

  var mrFormEmail = function ($) {
    // Check mrUtil is present and correct version
    if (!(mrUtil && mrUtil.version >= '1.2.0')) {
      throw new Error('mrUtil >= version 1.2.0 is required.');
    }
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */


    var NAME = 'mrFormEmail';
    var VERSION = '1.0.1';
    var DATA_KEY = 'mr.formEmail';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var ClassName = {
      LOADING: 'btn-loading-animate',
      WAS_VALIDATED: 'was-validated',
      D_NONE: 'd-none'
    };
    var Attribute = {
      ACTION: 'action',
      DISABLED: 'disabled',
      FEEDBACK_DELAY: 'data-feedback-delay',
      SUCCESS_REDIRECT: 'data-success-redirect'
    };
    var Selector = {
      DATA_ATTR: 'form-email',
      DATA_FORM_EMAIL: '[data-form-email]',
      DATA_SUCCESS: '[data-success-message]',
      DATA_ERROR: '[data-error-message]',
      SUBMIT_BUTTON: 'button[type="submit"]',
      SPAN: 'span',
      ALL_INPUTS: 'input,textarea,select',
      INITIALLY_DISABLED: 'initially-disabled'
    };
    var Event = {
      SENT: "sent" + EVENT_KEY,
      LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
      SUBMIT: 'submit'
    };
    var Options = {
      LOADING_TEXT: 'data-loading-text'
    };
    var Default = {
      LOADING_TEXT: 'Sending',
      FORM_ACTION: 'forms/mail.php',
      FEEDBACK_DELAY: 5000,
      ERROR_TEXT: 'Form submission error'
    };
    var Status = {
      SUCCESS: 'success',
      ERROR: 'error'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var FormEmail =
    /*#__PURE__*/
    function () {
      function FormEmail(element) {
        this.form = element;
        this.action = this.form.getAttribute(Attribute.ACTION) || Default.FORM_ACTION; // Returns an object containing the feedback

        this.feedback = this.getFeedbackElements(); // Get any recaptcha instances in the form - returns array of instances or null

        this.getRecaptcha(); // Get submit button, inner span and loading text.

        this.initSubmitButton(); // const $element = $(element);

        this.setSubmitEvent();
      } // getters


      var _proto = FormEmail.prototype;

      _proto.submitForm = function submitForm() {
        // Hide feedback messages for fresh submit
        this.hideAllFeedback(); // Submit form if validateForm returns true

        if (this.validateForm()) {
          this.ajaxSubmit();
        }
      };

      _proto.validateForm = function validateForm() {
        var formIsValid = this.form.checkValidity();

        if (this.recaptcha) {
          if (this.recaptcha.invisible) {
            if (formIsValid && !this.recaptcha.checkValidity()) {
              this.recaptcha.execute();
              return false;
            } // invalidate if captcha is found and is not valid, otherwise keep original value

          } else if (this.recaptcha.checkValidity() === false) {
            formIsValid = false;
          }
        }

        if (!formIsValid) {
          // Cancel timeout so error message will stay shown
          clearTimeout(this.feedbackTimeout); // Allow BS validation styles to take effect

          this.form.classList.add(ClassName.WAS_VALIDATED);
          this.showFeedback(Status.ERROR, this.validationErrorMessage);
          return false;
        }

        this.form.classList.remove(ClassName.WAS_VALIDATED);
        return true;
      };

      _proto.ajaxSubmit = function ajaxSubmit() {
        var $form = $(this.form);
        var formData = $form.serializeArray();
        formData.push({
          name: 'url',
          value: window.location.href
        });
        jQuery$1.ajax({
          context: this,
          data: formData,
          dataType: 'json',
          error: this.showFeedback,
          success: this.processResponse,
          type: 'POST',
          url: this.action
        });
        this.toggleFormLoading(true);
      };

      _proto.initSubmitButton = function initSubmitButton() {
        if (!this.submitButton) {
          this.submitButton = this.form.querySelector(Selector.SUBMIT_BUTTON);
        }

        this.submitButtonSpan = this.submitButton.querySelector(Selector.SPAN);
        this.loadingText = this.submitButton.getAttribute(Options.LOADING_TEXT) || Default.LOADING_TEXT;
        this.originalSubmitText = this.submitButtonSpan.textContent;
        return this.submitButton;
      };

      _proto.processResponse = function processResponse(response) {
        var _this = this;

        if (response.ok) {
          response.status = Status.SUCCESS;
          response.message = 'Thanks for your message. A member of our team will be in touch within 2 business days!';
        }

        var success = response.status === Status.SUCCESS; // Form is no longer in a 'loading' state

        this.toggleFormLoading(false); // Recaptcha will need to be solved again

        if (this.recaptcha) {
          this.recaptcha.reset();
        } // Trigger an event so users can fire Analytics scripts upon success


        $(this.form).trigger($.Event(Event.SENT)); // Redirect upon success if data-attribute is set

        var successRedirect = this.form.getAttribute(Attribute.SUCCESS_REDIRECT);

        if (success && successRedirect && successRedirect !== '') {
          window.location = successRedirect;
        } else if (success) {
          this.form.reset(); // Hide all feedback and hold a reference to the timeout
          // to cancel it when necessary.

          this.feedbackTimeout = setTimeout(function () {
            return _this.hideAllFeedback();
          }, this.feedbackDelay);
        } //  Show ERROR feedback message if not redirecting


        if (!successRedirect) {
          this.showFeedback(response.status, response.message);
        } // Detailed error message will be shown in Console if provided


        if (response.errorDetail) {
          /* eslint-disable no-console */
          console.error(response.errorName || Default.ERROR_TEXT, response.errorDetail.indexOf('{') === 0 ? JSON.parse(response.errorDetail) : response.errorDetail);
          /* eslint-enable no-console */
        }
      };

      _proto.showFeedback = function showFeedback(status, text, errorHTTP) {
        // Form is no longer in a 'loading' state
        this.toggleFormLoading(false); // If this is an ajax error from jQuery, 'status' will be
        // an object with statusText property

        if (typeof status === 'object' && status.statusText) {
          clearTimeout(this.feedbackTimeout);
          this.feedback.error.innerHTML = (errorHTTP || text) + ": <em>\"" + this.action + "\"</em> (" + status.status + " " + text + ")";
          this.feedback.error.classList.remove(ClassName.D_NONE);
        } else {
          this.feedback[status].innerHTML = text;
          this.feedback[status].classList.remove(ClassName.D_NONE);
        }
      };

      _proto.hideAllFeedback = function hideAllFeedback() {
        this.feedback.success.classList.add(ClassName.D_NONE);
        this.feedback.error.classList.add(ClassName.D_NONE);
      };

      _proto.getFeedbackElements = function getFeedbackElements() {
        if (!this.feedback) {
          this.feedback = {
            success: this.form.querySelector(Selector.DATA_SUCCESS),
            error: this.form.querySelector(Selector.DATA_ERROR)
          }; // Store the error alert's original text to be used as validation error message

          this.validationErrorMessage = this.feedback.error.innerHTML;
          var feedbackDelay = this.form.getAttribute(Attribute.FEEDBACK_DELAY) || Default.FEEDBACK_DELAY;
          this.feedbackDelay = parseInt(feedbackDelay, 10);
          this.feedbackTimeout = null;
        }

        return this.feedback;
      };

      _proto.getRecaptcha = function getRecaptcha() {
        if (this.form.querySelector(mrUtil.selector.RECAPTCHA)) {
          // Check mrUtil is present and correct version
          if (!mrRecaptchav2) {
            throw new Error('mrRecaptcha.js is required to handle the reCAPTCHA element in this form.');
          } else {
            // Returns an array of mrRecaptcha instances or null
            this.recaptcha = mrRecaptchav2.getRecaptchaFromForm(this.form);
          }
        }
      };

      _proto.toggleFormLoading = function toggleFormLoading(loading) {
        this.toggleSubmitButtonLoading(loading);
        FormEmail.toggleDisabled(this.form.querySelectorAll(Selector.ALL_INPUTS), loading);
      };

      _proto.toggleSubmitButtonLoading = function toggleSubmitButtonLoading(loading) {
        this.toggleSubmitButtonText(loading);
        this.toggleSubmitButtonAnimation(loading);
        FormEmail.toggleDisabled(this.submitButton, loading);
      };

      _proto.toggleSubmitButtonAnimation = function toggleSubmitButtonAnimation(animate) {
        // If animate is true, add the class, else remove it.
        this.submitButton.classList[animate ? 'add' : 'remove'](ClassName.LOADING);
      };

      _proto.toggleSubmitButtonText = function toggleSubmitButtonText(loading) {
        // If loading, set text to loading text, else return to original text.
        this.submitButtonSpan.textContent = loading ? this.loadingText : this.originalSubmitText;
      };

      FormEmail.toggleDisabled = function toggleDisabled(elements, disabled) {
        mrUtil.forEach(elements, function (index, element) {
          if (disabled) {
            // Toggle to disabled
            if (element.getAttribute(Attribute.DISABLED) !== null) {
              element.classList.add(Selector.INITIALLY_DISABLED);
            } else {
              element.setAttribute(Attribute.DISABLED, '');
            }
          } // Toggle to enabled
          // Only enable if input is found not to be deliberately disabled


          if (!disabled && !element.classList.contains(Selector.INITIALLY_DISABLED)) {
            element.removeAttribute(Attribute.DISABLED);
          }
        });
      };

      FormEmail.getInstanceFromForm = function getInstanceFromForm(form) {
        if (mrUtil.isElement(form)) {
          var data = $(form).data(DATA_KEY);
          return data || null;
        }

        throw new TypeError('Form argument passed to getInstanceFromForm is not an element.');
      };

      _proto.setSubmitEvent = function setSubmitEvent() {
        var _this2 = this;

        $(this.form).on(Event.SUBMIT, function (event) {
          event.preventDefault();

          _this2.submitForm();
        });
      };

      FormEmail.jQueryInterface = function jQueryInterface() {
        return this.each(function jqEachFormEmail() {
          var $element = $(this);
          var data = $element.data(DATA_KEY);

          if (!data) {
            data = new FormEmail(this);
            $element.data(DATA_KEY, data);
          }
        });
      };

      _createClass(FormEmail, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);

      return FormEmail;
    }();
    /**
     * ------------------------------------------------------------------------
     * Initialise by data attribute
     * ------------------------------------------------------------------------
     */


    $(window).on(Event.LOAD_DATA_API, function () {
      var FormEmailElements = $.makeArray($(Selector.DATA_FORM_EMAIL));
      /* eslint-disable no-plusplus */

      for (var i = FormEmailElements.length; i--;) {
        var $FormEmail = $(FormEmailElements[i]);
        FormEmail.jQueryInterface.call($FormEmail, $FormEmail.data());
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    /* eslint-disable no-param-reassign */

    $.fn[NAME] = FormEmail.jQueryInterface;
    $.fn[NAME].Constructor = FormEmail;

    $.fn[NAME].noConflict = function FormEmailNoConflict() {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return FormEmail.jQueryInterface;
    };
    /* eslint-enable no-param-reassign */


    return FormEmail;
  }(jQuery$1);

  var mrReadingPosition = function ($) {
    /**
     * Check for scrollMonitor dependency
     * scrollMonitor - https://github.com/stutrek/scrollMonitor
     */
    if (typeof scrollMonitor === 'undefined') {
      throw new Error('mrReadingPosition requires scrollMonitor.js (https://github.com/stutrek/scrollMonitor)');
    }
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */


    var NAME = 'mrReadingPosition';
    var VERSION = '1.0.0';
    var DATA_KEY = 'mr.readingPosition';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var Css = {
      HIDDEN: 'reading-position-hidden'
    };
    var Event = {
      LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
      RESIZE: 'resize',
      SCROLL: 'scroll'
    };
    var Selector = {
      PROGRESS: 'progress.reading-position',
      DATA_ATTR: 'reading-position',
      DATA_READING_POSITION: '[data-reading-position]',
      VALUE: 'value',
      MAX: 'max'
    };
    var Value = {
      BAR_MAX: 100,
      BAR_MIN: 0
    };
    var progressBars = document.querySelectorAll(Selector.PROGRESS); // const $window = $(window);
    // const $document = $(document);

    var getWindowHeight = function getWindowHeight() {
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    };

    var getScrollPosition = function getScrollPosition() {
      return (document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop) || 0;
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */


    var ReadingPosition =
    /*#__PURE__*/
    function () {
      function ReadingPosition(element) {
        this.progressBars = progressBars;
        this.element = element;
        this.top = 0;
        this.bottom = 0;
        this.height = 0;
        this.scrollLength = 0;
        this.articlePositionPercent = 0;
        this.ticking = false;
        this.inView = false;
        this.reading = false;
        this.initWatcher(element);
        this.initBarValues();
        this.setValue(getScrollPosition());
        this.setScrollEvent();
        this.setResizeEvent();
      } // get VERSION


      var _proto = ReadingPosition.prototype;

      _proto.initWatcher = function initWatcher(element) {
        var _this = this;

        var watcher = scrollMonitor.create(element);
        this.watcher = watcher;
        this.recalculateAll();
        watcher.stateChange(function () {
          _this.inView = watcher.isInViewport;
          _this.reading = watcher.isAboveViewport && watcher.isFullyInViewport;

          _this.toggleBars(_this.reading);
        });
      };

      _proto.initBarValues = function initBarValues() {
        mrUtil.forEach(this.progressBars, function (index, bar) {
          bar.setAttribute(Selector.MAX, Value.BAR_MAX);
        });
      };

      _proto.setValue = function setValue(scrollPosition) {
        var _this2 = this;

        this.recalculatePercentage(scrollPosition);
        mrUtil.forEach(this.progressBars, function (index, bar) {
          bar.setAttribute(Selector.VALUE, _this2.articlePositionPercent);
        });
      };

      _proto.toggleBars = function toggleBars(show) {
        mrUtil.forEach(this.progressBars, function (index, bar) {
          if (show) {
            bar.classList.remove(Css.HIDDEN);
          } else {
            bar.classList.add(Css.HIDDEN);
          }
        });
      };

      _proto.setScrollEvent = function setScrollEvent() {
        var _this3 = this;

        window.addEventListener(Event.SCROLL, function () {
          var scrollPosition = getScrollPosition();

          if (!_this3.ticking && _this3.inView && _this3.reading) {
            window.requestAnimationFrame(function () {
              _this3.setValue(scrollPosition);

              _this3.ticking = false;
            });
            _this3.ticking = true;
          }
        });
      };

      _proto.setResizeEvent = function setResizeEvent() {
        var _this4 = this;

        window.addEventListener(Event.RESIZE, function () {
          return _this4.recalculateAll();
        });
      };

      _proto.recalculateAll = function recalculateAll() {
        this.watcher.recalculateLocation();
        this.top = this.watcher.top;
        this.bottom = this.watcher.bottom;
        this.height = this.watcher.height; // Scroll Length is the scrolling viewable area of the article
        // from top of article = top of window to bottom of article = bottom of window.

        this.scrollLength = this.height - getWindowHeight(); // Position percent is how far the view is through the scrollable length in percentage.

        this.recalculatePercentage(getScrollPosition());
      };

      _proto.recalculatePercentage = function recalculatePercentage(scrollPosition) {
        this.articlePositionPercent = !scrollPosition ? 0 : (scrollPosition - this.top) / this.scrollLength * 100;
      };

      ReadingPosition.jQueryInterface = function jQueryInterface() {
        return this.each(function jqEachReadingPosition() {
          var $element = $(this);
          var data = $element.data(DATA_KEY);

          if (!data) {
            data = new ReadingPosition(this);
            $element.data(DATA_KEY, data);
          }
        });
      };

      _createClass(ReadingPosition, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);

      return ReadingPosition;
    }();
    /**
     * ------------------------------------------------------------------------
     * Initialise by data attribute
     * ------------------------------------------------------------------------
     */


    $(window).on(Event.LOAD_DATA_API, function () {
      // Proceed to initialise only if a progress bar is found in the document
      if (progressBars.length === 0) {
        return;
      } // Gather articles and loop over, initialising ReadingPosition instance


      var readingPositionElements = $.makeArray($(Selector.DATA_READING_POSITION));
      /* eslint-disable no-plusplus */

      for (var i = readingPositionElements.length; i--;) {
        var $readingPosition = $(readingPositionElements[i]);
        ReadingPosition.jQueryInterface.call($readingPosition, $readingPosition.data());
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    /* eslint-disable no-param-reassign */

    $.fn[NAME] = ReadingPosition.jQueryInterface;
    $.fn[NAME].Constructor = ReadingPosition;

    $.fn[NAME].noConflict = function ReadingPositionNoConflict() {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return ReadingPosition.jQueryInterface;
    };
    /* eslint-enable no-param-reassign */


    return ReadingPosition;
  }(jQuery);

  //

  var mrSmoothScroll = function ($) {
    var smoothScroll = new SmoothScroll('a[data-smooth-scroll]', {
      speedAsDuration: true,
      offset: $('body').attr('data-smooth-scroll-offset') || 0
    });
    return smoothScroll;
  }(jQuery$1);

  var mrSticky = function ($) {
    /**
     * Check for scrollMonitor dependency
     * scrollMonitor - https://github.com/stutrek/scrollMonitor
     */
    if (typeof scrollMonitor === 'undefined') {
      throw new Error('mrSticky requires scrollMonitor.js (https://github.com/stutrek/scrollMonitor)');
    }
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */


    var NAME = 'mrSticky';
    var VERSION = '1.4.0';
    var DATA_KEY = 'mr.sticky';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var NO_OFFSET = 0;
    var ClassName = {
      FIXED_TOP: 'position-fixed',
      ABSOLUTE_BOTTOM: 'sticky-bottom',
      FIXED_BOTTOM: 'sticky-viewport-bottom',
      SCROLLED: 'scrolled'
    };
    var Css = {
      HEIGHT: 'min-height',
      WIDTH: 'max-width',
      SPACE_TOP: 'top',
      SPACE_BOTTOM: 'bottom'
    };
    var Event = {
      LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
      WINDOW_RESIZE: 'resize',
      ALERT_CLOSED: 'closed.bs.alert',
      TOGGLE_SHOW: 'show.bs.collapse',
      TOGGLE_HIDDEN: 'hidden.bs.collapse'
    };
    var Options = {
      BELOW_NAV: 'below-nav',
      TOP: 'top',
      BOTTOM: 'bottom'
    };
    var Selector = {
      DATA_ATTR: 'sticky',
      DATA_STICKY: '[data-sticky]',
      NAV_STICKY: 'body > div.navbar-container [data-sticky="top"]',
      ALERT: '.alert-dismissible'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Sticky =
    /*#__PURE__*/
    function () {
      function Sticky(element) {
        var $element = $(element);
        var stickyData = $element.data(Selector.DATA_ATTR);
        var stickyUntil = $element.closest('section') || null;
        this.element = element;
        this.stickBelowNav = stickyData === Options.BELOW_NAV;
        this.stickBottom = stickyData === Options.BOTTOM;
        this.stickyUntil = stickyUntil;
        this.navToggled = false;
        this.updateNavProperties();
        this.isNavElement = $element.is(this.navElement);
        this.initWatcher($element);
        this.updateCss();
        this.setResizeEvent(); // Run a calculation immediately to show sticky elements if page starts
        // at a half-scrolled position

        this.onWatcherChange($element);
        this.ticking = false; // for debouncing resize event with RequestAnimationFrame

        if (this.isNavElement) {
          this.setNavToggleEvents();
        }
      } // getters


      var _proto = Sticky.prototype;

      _proto.initWatcher = function initWatcher(element) {
        var _this = this;

        var $element = $(element);
        var notNavElement = !this.isNavElement;
        var offset = this.stickBelowNav && this.navIsSticky && notNavElement ? {
          top: this.navHeight
        } : NO_OFFSET;
        offset = this.stickBottom && notNavElement ? {
          bottom: -$element.outerHeight
        } : offset;
        var watcher = scrollMonitor.create(element, offset); // ensure that we're always watching the place the element originally was

        watcher.lock();
        var untilWatcher = this.stickyUntil !== null ? scrollMonitor.create(this.stickyUntil, {
          bottom: -(watcher.height + offset.top)
        }) : null;
        this.watcher = watcher;
        this.untilWatcher = untilWatcher;
        this.navHeight = this.navHeight; // For navs that start at top, stick them immediately to avoid a jump

        if (this.isNavElement && watcher.top === 0 && !this.navIsAbsolute) {
          $element.addClass(ClassName.FIXED_TOP);
        }

        watcher.stateChange(function () {
          _this.onWatcherChange($element);
        });

        if (untilWatcher !== null) {
          untilWatcher.exitViewport(function () {
            // If the element is in a section, it will scroll up with the section
            $element.addClass(ClassName.ABSOLUTE_BOTTOM);
          });
          untilWatcher.enterViewport(function () {
            $element.removeClass(ClassName.ABSOLUTE_BOTTOM);
          });
        }
      };

      _proto.onWatcherChange = function onWatcherChange($element) {
        // Add fixed when element leaves via top of viewport or if nav is sitting at top
        $element.toggleClass(ClassName.FIXED_TOP, this.watcher.isAboveViewport || !this.navIsAbsolute && !this.stickBottom && this.isNavElement && this.watcher.top === 0); // Used to apply styles to the nav based on "scrolled" class
        // independedly of position-fixed because that class is used for more practical reasons
        // such as avoiding a jump on first scroll etc.

        $element.toggleClass(ClassName.SCROLLED, this.watcher.isAboveViewport && this.isNavElement && !this.stickBottom); // Fix to bottom when element enters via bottom of viewport and has data-sticky="bottom"

        $element.toggleClass(ClassName.FIXED_BOTTOM, (this.watcher.isFullyInViewport || this.watcher.isAboveViewport) && this.stickBottom);

        if (!this.stickBottom) {
          $element.css(Css.SPACE_TOP, this.watcher.isAboveViewport && this.navIsSticky && this.stickBelowNav ? this.navHeight : NO_OFFSET);
        }
      };

      _proto.setResizeEvent = function setResizeEvent() {
        var _this2 = this;

        // Closing any alerts above the nav will mean we need to recalculate position.
        $(Selector.ALERT).on(Event.ALERT_CLOSED, function () {
          // An alert above the nav will cause odd sticky behaviour if
          // the alert is dismissed and nav position is not recalculated,
          // as scrollMonitor has locked the position of the watcher.
          // Unlock and recalculate if the nav is in the viewport during alert close event.
          if (_this2.watcher.isInViewport) {
            _this2.watcher.unlock();

            _this2.watcher.recalculateLocation();

            _this2.watcher.lock();
          }

          _this2.onResize();
        });
        $(window).on(Event.WINDOW_RESIZE, function () {
          _this2.onResize();
        });
      };

      _proto.onResize = function onResize() {
        var _this3 = this;

        if (!this.ticking) {
          window.requestAnimationFrame(function () {
            _this3.updateCss();

            _this3.ticking = false;
          });
          this.ticking = true;
        }
      };

      _proto.setNavToggleEvents = function setNavToggleEvents() {
        var _this4 = this;

        $(this.element).on("" + Event.TOGGLE_SHOW, function () {
          _this4.navToggled = true;
        }); // navHeight should only be recalculated when the nav is not open/toggled
        // Don't allow the navHeight to be recalculated until the nav is fully hidden

        $(this.element).on("" + Event.TOGGLE_HIDDEN, function () {
          _this4.navToggled = false;
        });
      };

      _proto.updateCss = function updateCss() {
        var $element = $(this.element); // Fix width by getting parent's width to avoid element spilling out when pos-fixed

        $element.css(Css.WIDTH, $element.parent().width());
        this.updateNavProperties();
        var elemHeight = $element.outerHeight();
        var notNavElement = !this.isNavElement; // Set a min-height to prevent "jumping" when sticking to top
        // but not applied to the nav element itself unless it is overlay (absolute) nav

        if (!this.navIsAbsolute && this.isNavElement || notNavElement) {
          // navHeight should only be recalculated when the nav is not open/toggled
          // Don't allow the navHeight to be set until the nav is fully hidden
          if (!this.navToggled) {
            $element.parent().css(Css.HEIGHT, elemHeight);
          }
        }

        if (this.navIsSticky && notNavElement) {
          $element.css(Css.HEIGHT, elemHeight);
        }
      };

      _proto.updateNavProperties = function updateNavProperties() {
        var $navElement = this.navElement || $(Selector.NAV_STICKY).first();
        this.navElement = $navElement;
        this.navHeight = $navElement.outerHeight();
        this.navIsAbsolute = $navElement.css('position') === 'absolute';
        this.navIsSticky = $navElement.length > 0;
      };

      Sticky.jQueryInterface = function jQueryInterface() {
        return this.each(function jqEachSticky() {
          var $element = $(this);
          var data = $element.data(DATA_KEY);

          if (!data) {
            data = new Sticky(this);
            $element.data(DATA_KEY, data);
          }
        });
      };

      _createClass(Sticky, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);

      return Sticky;
    }();
    /**
     * ------------------------------------------------------------------------
     * Initialise by data attribute
     * ------------------------------------------------------------------------
     */


    $(window).on(Event.LOAD_DATA_API, function () {
      var stickyElements = $.makeArray($(Selector.DATA_STICKY));
      /* eslint-disable no-plusplus */

      for (var i = stickyElements.length; i--;) {
        var $sticky = $(stickyElements[i]);
        Sticky.jQueryInterface.call($sticky, $sticky.data());
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    /* eslint-disable no-param-reassign */

    $.fn[NAME] = Sticky.jQueryInterface;
    $.fn[NAME].Constructor = Sticky;

    $.fn[NAME].noConflict = function StickyNoConflict() {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Sticky.jQueryInterface;
    };
    /* eslint-enable no-param-reassign */


    return Sticky;
  }(jQuery$1);

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this));
      var position = toInteger(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod(true)
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var O = 'object';
  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
    // eslint-disable-next-line no-undef
    check(typeof globalThis == O && globalThis) ||
    check(typeof window == O && window) ||
    check(typeof self == O && self) ||
    check(typeof commonjsGlobal == O && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var hide = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      hide(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    } return value;
  };

  var shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = global_1[SHARED] || setGlobal(SHARED, {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.2.1',
    mode:  'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var functionToString = shared('native-function-to-string', Function.toString);

  var WeakMap = global_1.WeakMap;

  var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(functionToString.call(WeakMap));

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var keys = shared('keys');

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$1 = global_1.WeakMap;
  var set, get, has$1;

  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store = new WeakMap$1();
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      hide(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$1
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$2
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(functionToString).split('toString');

  shared('inspectSource', function (it) {
    return functionToString.call(it);
  });

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global_1) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else hide(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
  });
  });

  var path = global_1;

  var aFunction = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
      : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$1 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod$1(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$1(false)
  };

  var indexOf = arrayIncludes.indexOf;


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$4
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        hide(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO = sharedKey('IE_PROTO');
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype : null;
  };

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var Symbol$1 = global_1.Symbol;
  var store$1 = shared('wks');

  var wellKnownSymbol = function (name) {
    return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
      || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
  };

  var ITERATOR = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if ( !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  var IE_PROTO$1 = sharedKey('IE_PROTO');

  var PROTOTYPE = 'prototype';
  var Empty = function () { /* empty */ };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var length = enumBugKeys.length;
    var lt = '<';
    var script = 'script';
    var gt = '>';
    var js = 'java' + script + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    iframe.src = String(js);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
    return createDict();
  };

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  hiddenKeys[IE_PROTO$1] = true;

  var defineProperty = objectDefineProperty.f;



  var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
      defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
    }
  };

  var iterators = {};

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var aPossiblePrototype = function (it) {
    if (!isObject(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$1 = wellKnownSymbol('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$1]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
            hide(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
      hide(IterablePrototype, ITERATOR$1, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var charAt = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var aFunction$1 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var bindContext = function (fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$3 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$3]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // `Array.from` method implementation
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iteratorMethod = getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      result = new C();
      for (;!(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping
          ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
          : step.value
        );
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (;length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  };

  var ITERATOR$4 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$4] = function () {
      return this;
    };
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$4] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
    from: arrayFrom
  });

  var from_1 = path.Array.from;

  //
  svgInjector.SVGInjector(document.querySelectorAll('[data-inject-svg]'), {
    afterEach: function afterEach(err, svg) {
      if (typeof jarallax === 'function') {
        svg.dispatchEvent(new CustomEvent('injected.mr.SVGInjector', {
          bubbles: true
        }));
      }
    }
  });

  // import mrTypedText from './typed-text';
  // import mrUtil from './util';

  (function () {
    if (typeof $ === 'undefined') {
      throw new TypeError('Medium Rare JavaScript requires jQuery. jQuery must be included before theme.js.');
    }
  })();

  exports.mrFormEmail = mrFormEmail;
  exports.mrReadingPosition = mrReadingPosition;
  exports.mrSmoothScroll = mrSmoothScroll;
  exports.mrSticky = mrSticky;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=theme.js.map
