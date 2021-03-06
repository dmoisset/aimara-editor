/*!
 * aimaraeditor.js
 *
 * @brief
 * AIMARA editor is a js tool for editing AIMARA values. It is based on
 * JSONEditor by Jos de Jong, but without any affiliation or connection
 * to its author.
 *
 * Supported browsers: Chrome, Firefox, Safari, Opera, Internet Explorer 8+
 *
 * @license
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Copyright (c) 2014 Daniel Moisset, http://machinalis.com/
 * Copyright (c) 2011-2014 Jos de Jong
 *
 * @author  Daniel Moisset, dmoisset@machinalis.com
 * @version 3.1.2
 * @date    2015-03-18
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["JSONEditor"] = factory();
	else
		root["JSONEditor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (treemode, util) {

	  /**
	   * @constructor JSONEditor
	   * @param {Element} container    Container element
	   * @param {Object}  [options]    Object with options. available options:
	   *                               {String} mode      Editor mode. Available values:
	   *                                                  'tree' (default), 'view',
	   *                                                  'form', 'text', and 'code'.
	   *                               {function} change  Callback method, triggered
	   *                                                  on change of contents
	   *                               {function} click  Callback method, triggered
	   *                                                  on click
	   *                               {Boolean} search   Enable search box.
	   *                                                  True by default
	   *                                                  Only applicable for modes
	   *                                                  'tree', 'view', and 'form'
	   *                               {Boolean} history  Enable history (undo/redo).
	   *                                                  True by default
	   *                                                  Only applicable for modes
	   *                                                  'tree', 'view', and 'form'
	   *                               {String} name      Field name for the root node.
	   *                                                  Only applicable for modes
	   *                                                  'tree', 'view', and 'form'
	   *                               {Number} indentation   Number of indentation
	   *                                                      spaces. 4 by default.
	   *                                                      Only applicable for
	   *                                                      modes 'text' and 'code'
	   * @param {Object | undefined} value JSON object
	   */
	  function JSONEditor (container, options, value, type) {
	    if (!(this instanceof JSONEditor)) {
	      throw new Error('JSONEditor constructor called without "new".');
	    }

	    // check for unsupported browser (IE8 and older)
	    var ieVersion = util.getInternetExplorerVersion();
	    if (ieVersion != -1 && ieVersion < 9) {
	      throw new Error('Unsupported browser, IE9 or newer required. ' +
	          'Please install the newest version of your browser.');
	    }
	    if (arguments.length) {
	      this._create(container, options, value, type);
	    }
	  }

	  /**
	   * Configuration for all registered modes. Example:
	   * {
	   *     tree: {
	   *         mixin: TreeEditor,
	   *         data: 'value'
	   *     },
	   *     text: {
	   *         mixin: TextEditor,
	   *         data: 'text'
	   *     }
	   * }
	   *
	   * @type { Object.<String, {mixin: Object, data: String} > }
	   */
	  JSONEditor.modes = {};

	  /**
	   * Create the JSONEditor
	   * @param {Element} container    Container element
	   * @param {Object}  [options]    See description in constructor
	   * @param {Object | undefined} value Value
	   * @param {TypeInfo} type        Type for the value
	   * @private
	   */
	  JSONEditor.prototype._create = function (container, options, value, type) {
	    this.container = container;
	    this.options = options || {};
	    if (this.options.type_trees == undefined ) {
	      throw new Error('The type_trees option is required (reference to the type_trees lib)')
	    }
	    this.options.knownConstructors = this.options.knownConstructors || {};
	    this.options.readOnlyAimaraPaths = this.options.readOnlyAimaraPaths || [];
	    this.options.rootAimaraPath = this.options.rootAimaraPath || [];
	    // a function able to get the values for the read only paths
	    this.options.getReadOnlyValue = this.options.getReadOnlyValue;  
	    this.value = value;
	    this.type = type;
	    var mode = this.options.mode || 'tree';
	    this.setMode(mode);
	  };

	  /**
	   * Detach the editor from the DOM
	   * @private
	   */
	  JSONEditor.prototype._delete = function () {};

	  /**
	   * Set edited object in editor
	   * @param {Object | undefined} value      value
	   */
	  JSONEditor.prototype.set = function (value) {
	    this.value = value;
	  };

	  /**
	   * Get data structure from the editor
	   * @returns {Object} value
	   */
	  JSONEditor.prototype.get = function () {
	    return this.value;
	  };

	  /**
	   * Set a field name for the root node.
	   * @param {String | undefined} name
	   */
	  JSONEditor.prototype.setName = function (name) {
	    if (!this.options) {
	      this.options = {};
	    }
	    this.options.name = name;
	  };

	  /**
	   * Get the field name for the root node.
	   * @return {String | undefined} name
	   */
	  JSONEditor.prototype.getName = function () {
	    return this.options && this.options.name;
	  };

	  /**
	   * Change the mode of the editor.
	   * JSONEditor will be extended with all methods needed for the chosen mode.
	   * @param {String} mode     Available modes: 'tree' (default), 'view', 'form',
	   *                          'text', and 'code'.
	   */
	  JSONEditor.prototype.setMode = function (mode) {
	    var container = this.container,
	        options = util.extend({}, this.options),
	        data,
	        name;

	    options.mode = mode;
	    var config = JSONEditor.modes[mode];
	    if (config) {
	      try {
	        name = this.getName();
	        data = this.get(); // get value

	        this._delete();
	        util.extend(this, config.mixin);
	        this.create(container, options);

	        this.setName(name);
	        this.set(data);

	        if (typeof config.load === 'function') {
	          try {
	            config.load.call(this);
	          }
	          catch (err) {}
	        }
	      }
	      catch (err) {
	        this._onError(err);
	      }
	    }
	    else {
	      throw new Error('Unknown mode "' + options.mode + '"');
	    }
	  };

	  /**
	   * Throw an error. If an error callback is configured in options.error, this
	   * callback will be invoked. Else, a regular error is thrown.
	   * @param {Error} err
	   * @private
	   */
	  JSONEditor.prototype._onError = function(err) {
	    // TODO: onError is deprecated since version 2.2.0. cleanup some day
	    if (typeof this.onError === 'function') {
	      util.log('WARNING: JSONEditor.onError is deprecated. ' +
	          'Use options.error instead.');
	      this.onError(err);
	    }

	    if (this.options && typeof this.options.error === 'function') {
	      this.options.error(err);
	    }
	    else {
	      throw err;
	    }
	  };

	  /**
	   * Register a plugin with one ore multiple modes for the JSON Editor.
	   *
	   * A mode is described as an object with properties:
	   *
	   * - `mode: String`           The name of the mode.
	   * - `mixin: Object`          An object containing the mixin functions which
	   *                            will be added to the JSONEditor. Must contain functions
	   *                            create, get, getText, set. May have
	   *                            additional functions.
	   *                            When the JSONEditor switches to a mixin, all mixin
	   *                            functions are added to the JSONEditor, and then
	   *                            the function `create(container, options)` is executed.
	   * - `[load: function]`       An optional function called after the mixin
	   *                            has been loaded.
	   *
	   * @param {Object | Array} mode  A mode object or an array with multiple mode objects.
	   */
	  JSONEditor.registerMode = function (mode) {
	    var i, prop;

	    if (util.isArray(mode)) {
	      // multiple modes
	      for (i = 0; i < mode.length; i++) {
	        JSONEditor.registerMode(mode[i]);
	      }
	    }
	    else {
	      // validate the new mode
	      if (!('mode' in mode)) throw new Error('Property "mode" missing');
	      if (!('mixin' in mode)) throw new Error('Property "mixin" missing');
	      var name = mode.mode;
	      if (name in JSONEditor.modes) {
	        throw new Error('Mode "' + name + '" already registered');
	      }

	      // validate the mixin
	      if (typeof mode.mixin.create !== 'function') {
	        throw new Error('Required function "create" missing on mixin');
	      }
	      var reserved = ['setMode', 'registerMode', 'modes'];
	      for (i = 0; i < reserved.length; i++) {
	        prop = reserved[i];
	        if (prop in mode.mixin) {
	          throw new Error('Reserved property "' + prop + '" not allowed in mixin');
	        }
	      }

	      JSONEditor.modes[name] = mode;
	    }
	  };

	  // register tree and text modes
	  JSONEditor.registerMode(treemode);

	  return JSONEditor;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3), __webpack_require__(4), __webpack_require__(5), __webpack_require__(6), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Highlighter, History, SearchBox, Node, util) {

	  // create a mixin with the functions for tree mode
	  var treemode = {};
	      
	  /**
	   * Create a tree editor
	   * @param {Element} container    Container element
	   * @param {Object}  [options]    Object with options. available options:
	   *                               {String} mode      Editor mode. Available values:
	   *                                                  'tree' (default), 'view',
	   *                                                  and 'form'.
	   *                               {Boolean} search   Enable search box.
	   *                                                  True by default
	   *                               {Boolean} history  Enable history (undo/redo).
	   *                                                  True by default
	   *                               {function} change  Callback method, triggered
	   *                                                  on change of contents
	   *                               {function} click  Callback method, triggered
	   *                                                  when a node is clicked
	   *                               {String} name      Field name for the root node.
	   * @private
	   */
	  treemode.create = function (container, options) {
	    if (!container) {
	      throw new Error('No container element provided.');
	    }
	    this.container = container;
	    this.dom = {};
	    this.highlighter = new Highlighter();
	    this.selection = undefined; // will hold the last input selection

	    this._setOptions(options);

	    if (this.options.history && this.options.mode !== 'view') {
	      this.history = new History(this);
	    }

	    this._createFrame();
	    this._createTable();
	  };

	  /**
	   * Detach the editor from the DOM
	   * @private
	   */
	  treemode._delete = function () {
	    if (this.frame && this.container && this.frame.parentNode == this.container) {
	      this.container.removeChild(this.frame);
	    }
	  };

	  /**
	   * Initialize and set default options
	   * @param {Object}  [options]    See description in constructor
	   * @private
	   */
	  treemode._setOptions = function (options) {
	    this.options = {
	      search: true,
	      history: true,
	      mode: 'tree',
	      name: undefined   // field name of root node
	    };

	    // copy all options
	    if (options) {
	      for (var prop in options) {
	        if (options.hasOwnProperty(prop)) {
	          this.options[prop] = options[prop];
	        }
	      }
	    }
	  };

	  // node currently being edited
	  var focusNode = undefined;

	  // dom having focus
	  var domFocus = null;

	  /**
	   * Set AIMARA value in editor
	   * @param {Object | undefined} value      value
	   */
	  treemode.set = function (value) {
	    // verify if value is valid value, ignore when a function
	    if (value instanceof Function || (value === undefined)) {
	      this.clear();
	    }
	    else {
	      this.content.removeChild(this.table);  // Take the table offline

	      // replace the root node
	      var params = {
	        'field': this.options.name,
	        'value': value,
	        'type': this.type
	      };
	      var node = new Node(this, params);
	      this._setRoot(node);

	      // expand
	      var recurse = false;
	      this.node.expand(recurse);

	      this.content.appendChild(this.table);  // Put the table online again
	    }

	    // TODO: maintain history, store last state and previous document
	    if (this.history) {
	      this.history.clear();
	    }
	  };

	  /**
	   * Get AIMARA value from editor
	   * @return {Object | undefined} value
	   */
	  treemode.get = function () {
	    // remove focus from currently edited node
	    if (focusNode) {
	      focusNode.blur();
	    }

	    if (this.node) {
	      return this.node.getValue();
	    }
	    else {
	      return undefined;
	    }
	  };

	  /**
	   * Set a field name for the root node.
	   * @param {String | undefined} name
	   */
	  treemode.setName = function (name) {
	    this.options.name = name;
	    if (this.node) {
	      this.node.updateField(this.options.name);
	    }
	  };

	  /**
	   * Get the field name for the root node.
	   * @return {String | undefined} name
	   */
	  treemode.getName = function () {
	    return this.options.name;
	  };

	  /**
	   * Remove the root node from the editor
	   */
	  treemode.clear = function () {
	    if (this.node) {
	      this.node.collapse();
	      this.tbody.removeChild(this.node.getDom());
	      delete this.node;
	    }
	  };

	  /**
	   * Set the root node for the json editor
	   * @param {Node} node
	   * @private
	   */
	  treemode._setRoot = function (node) {
	    this.clear();

	    this.node = node;

	    // append to the dom
	    this.tbody.appendChild(node.getDom());
	  };

	  /**
	   * Search text in all nodes
	   * The nodes will be expanded when the text is found one of its childs,
	   * else it will be collapsed. Searches are case insensitive.
	   * @param {String} text
	   * @return {Object[]} results  Array with nodes containing the search results
	   *                             The result objects contains fields:
	   *                             - {Node} node,
	   *                             - {String} elem  the dom element name where
	   *                                              the result is found ('field' or
	   *                                              'value')
	   */
	  treemode.search = function (text) {
	    var results;
	    if (this.node) {
	      this.content.removeChild(this.table);  // Take the table offline
	      results = this.node.search(text);
	      this.content.appendChild(this.table);  // Put the table online again
	    }
	    else {
	      results = [];
	    }

	    return results;
	  };

	  /**
	   * Expand all nodes
	   */
	  treemode.expandAll = function () {
	    if (this.node) {
	      this.content.removeChild(this.table);  // Take the table offline
	      this.node.expand();
	      this.content.appendChild(this.table);  // Put the table online again
	    }
	  };

	  /**
	   * Collapse all nodes
	   */
	  treemode.collapseAll = function () {
	    if (this.node) {
	      this.content.removeChild(this.table);  // Take the table offline
	      this.node.collapse();
	      this.content.appendChild(this.table);  // Put the table online again
	    }
	  };

	  /**
	   * The method onChange is called whenever a field or value is changed, created,
	   * deleted, duplicated, etc.
	   * @param {String} action  Change action. Available values: "editField",
	   *                         "editValue", "appendNode",
	   *                         "removeNode", "duplicateNode", "moveNode", "expand",
	   *                         "collapse".
	   * @param {Object} params  Object containing parameters describing the change.
	   *                         The parameters in params depend on the action (for
	   *                         example for "editValue" the Node, old value, and new
	   *                         value are provided). params contains all information
	   *                         needed to undo or redo the action.
	   * @private
	   */
	  treemode._onAction = function (action, params) {
	    // add an action to the history
	    if (this.history) {
	      this.history.add(action, params);
	    }

	    // trigger the onChange callback
	    if (this.options.change) {
	      try {
	        this.options.change();
	      }
	      catch (err) {
	        util.log('Error in change callback: ', err);
	      }
	    }
	  };

	  /**
	   * Start autoscrolling when given mouse position is above the top of the
	   * editor contents, or below the bottom.
	   * @param {Number} mouseY  Absolute mouse position in pixels
	   */
	  treemode.startAutoScroll = function (mouseY) {
	    var me = this;
	    var content = this.content;
	    var top = util.getAbsoluteTop(content);
	    var height = content.clientHeight;
	    var bottom = top + height;
	    var margin = 24;
	    var interval = 50; // ms

	    if ((mouseY < top + margin) && content.scrollTop > 0) {
	      this.autoScrollStep = ((top + margin) - mouseY) / 3;
	    }
	    else if (mouseY > bottom - margin &&
	        height + content.scrollTop < content.scrollHeight) {
	      this.autoScrollStep = ((bottom - margin) - mouseY) / 3;
	    }
	    else {
	      this.autoScrollStep = undefined;
	    }

	    if (this.autoScrollStep) {
	      if (!this.autoScrollTimer) {
	        this.autoScrollTimer = setInterval(function () {
	          if (me.autoScrollStep) {
	            content.scrollTop -= me.autoScrollStep;
	          }
	          else {
	            me.stopAutoScroll();
	          }
	        }, interval);
	      }
	    }
	    else {
	      this.stopAutoScroll();
	    }
	  };

	  /**
	   * Stop auto scrolling. Only applicable when scrolling
	   */
	  treemode.stopAutoScroll = function () {
	    if (this.autoScrollTimer) {
	      clearTimeout(this.autoScrollTimer);
	      delete this.autoScrollTimer;
	    }
	    if (this.autoScrollStep) {
	      delete this.autoScrollStep;
	    }
	  };


	  /**
	   * Set the focus to an element in the editor, set text selection, and
	   * set scroll position.
	   * @param {Object} selection  An object containing fields:
	   *                            {Element | undefined} dom     The dom element
	   *                                                          which has focus
	   *                            {Range | TextRange} range     A text selection
	   *                            {Number} scrollTop            Scroll position
	   */
	  treemode.setSelection = function (selection) {
	    if (!selection) {
	      return;
	    }

	    if ('scrollTop' in selection && this.content) {
	      // TODO: animated scroll
	      this.content.scrollTop = selection.scrollTop;
	    }
	    if (selection.range) {
	      util.setSelectionOffset(selection.range);
	    }
	    if (selection.dom) {
	      selection.dom.focus();
	    }
	  };

	  /**
	   * Get the current focus
	   * @return {Object} selection An object containing fields:
	   *                            {Element | undefined} dom     The dom element
	   *                                                          which has focus
	   *                            {Range | TextRange} range     A text selection
	   *                            {Number} scrollTop            Scroll position
	   */
	  treemode.getSelection = function () {
	    return {
	      dom: domFocus,
	      scrollTop: this.content ? this.content.scrollTop : 0,
	      range: util.getSelectionOffset()
	    };
	  };

	  /**
	   * Adjust the scroll position such that given top position is shown at 1/4
	   * of the window height.
	   * @param {Number} top
	   * @param {function(boolean)} [callback]   Callback, executed when animation is
	   *                                         finished. The callback returns true
	   *                                         when animation is finished, or false
	   *                                         when not.
	   */
	  treemode.scrollTo = function (top, callback) {
	    var content = this.content;
	    if (content) {
	      var editor = this;
	      // cancel any running animation
	      if (editor.animateTimeout) {
	        clearTimeout(editor.animateTimeout);
	        delete editor.animateTimeout;
	      }
	      if (editor.animateCallback) {
	        editor.animateCallback(false);
	        delete editor.animateCallback;
	      }

	      // calculate final scroll position
	      var height = content.clientHeight;
	      var bottom = content.scrollHeight - height;
	      var finalScrollTop = Math.min(Math.max(top - height / 4, 0), bottom);

	      // animate towards the new scroll position
	      var animate = function () {
	        var scrollTop = content.scrollTop;
	        var diff = (finalScrollTop - scrollTop);
	        if (Math.abs(diff) > 3) {
	          content.scrollTop += diff / 3;
	          editor.animateCallback = callback;
	          editor.animateTimeout = setTimeout(animate, 50);
	        }
	        else {
	          // finished
	          if (callback) {
	            callback(true);
	          }
	          content.scrollTop = finalScrollTop;
	          delete editor.animateTimeout;
	          delete editor.animateCallback;
	        }
	      };
	      animate();
	    }
	    else {
	      if (callback) {
	        callback(false);
	      }
	    }
	  };

	  /**
	   * Create main frame
	   * @private
	   */
	  treemode._createFrame = function () {
	    // create the frame
	    this.frame = document.createElement('div');
	    this.frame.className = 'jsoneditor';
	    this.container.appendChild(this.frame);

	    // create one global event listener to handle all events from all nodes
	    var editor = this;
	    function onEvent(event) {
	      editor._onEvent(event);
	    }
	    this.frame.onclick = function (event) {
	      var target = event.target;// || event.srcElement;

	      onEvent(event);

	      // prevent default submit action of buttons when editor is located
	      // inside a form
	      if (target.nodeName == 'BUTTON') {
	        event.preventDefault();
	      }
	    };
	    this.frame.oninput = onEvent;
	    this.frame.onchange = onEvent;
	    this.frame.onkeydown = onEvent;
	    this.frame.onkeyup = onEvent;
	    this.frame.oncut = onEvent;
	    this.frame.onpaste = onEvent;
	    this.frame.onmousedown = onEvent;
	    this.frame.onmouseup = onEvent;
	    this.frame.onmouseover = onEvent;
	    this.frame.onmouseout = onEvent;
	    // Note: focus and blur events do not propagate, therefore they defined
	    // using an eventListener with useCapture=true
	    // see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
	    util.addEventListener(this.frame, 'focus', onEvent, true);
	    util.addEventListener(this.frame, 'blur', onEvent, true);
	    this.frame.onfocusin = onEvent;  // for IE
	    this.frame.onfocusout = onEvent; // for IE

	    // create menu
	    this.menu = document.createElement('div');
	    this.menu.className = 'menu';
	    this.frame.appendChild(this.menu);

	    // create expand all button
	    var expandAll = document.createElement('button');
	    expandAll.className = 'expand-all';
	    expandAll.title = 'Expand all fields';
	    expandAll.onclick = function () {
	      editor.expandAll();
	    };
	    this.menu.appendChild(expandAll);

	    // create expand all button
	    var collapseAll = document.createElement('button');
	    collapseAll.title = 'Collapse all fields';
	    collapseAll.className = 'collapse-all';
	    collapseAll.onclick = function () {
	      editor.collapseAll();
	    };
	    this.menu.appendChild(collapseAll);

	    // create undo/redo buttons
	    if (this.history) {
	      // create undo button
	      var undo = document.createElement('button');
	      undo.className = 'undo separator';
	      undo.title = 'Undo last action (Ctrl+Z)';
	      undo.onclick = function () {
	        editor._onUndo();
	      };
	      this.menu.appendChild(undo);
	      this.dom.undo = undo;

	      // create redo button
	      var redo = document.createElement('button');
	      redo.className = 'redo';
	      redo.title = 'Redo (Ctrl+Shift+Z)';
	      redo.onclick = function () {
	        editor._onRedo();
	      };
	      this.menu.appendChild(redo);
	      this.dom.redo = redo;

	      // register handler for onchange of history
	      this.history.onChange = function () {
	        undo.disabled = !editor.history.canUndo();
	        redo.disabled = !editor.history.canRedo();
	      };
	      this.history.onChange();
	    }

	    // create search box
	    if (this.options.search) {
	      this.searchBox = new SearchBox(this, this.menu);
	    }
	  };

	  /**
	   * Perform an undo action
	   * @private
	   */
	  treemode._onUndo = function () {
	    if (this.history) {
	      // undo last action
	      this.history.undo();

	      // trigger change callback
	      if (this.options.change) {
	        this.options.change();
	      }
	    }
	  };

	  /**
	   * Perform a redo action
	   * @private
	   */
	  treemode._onRedo = function () {
	    if (this.history) {
	      // redo last action
	      this.history.redo();

	      // trigger change callback
	      if (this.options.change) {
	        this.options.change();
	      }
	    }
	  };

	  /**
	   * Event handler
	   * @param event
	   * @private
	   */
	  treemode._onEvent = function (event) {
	    var target = event.target;

	    if (event.type == 'keydown') {
	      this._onKeyDown(event);
	    }

	    if (event.type == 'focus') {
	      domFocus = target;
	    }

	    var node = Node.getNodeFromTarget(target);
	    if (node) {
	      node.onEvent(event);
	      if (event.type == 'click' && this.options.click) {
	        this.options.click(node)
	      }
	    }
	  };

	  /**
	   * Event handler for keydown. Handles shortcut keys
	   * @param {Event} event
	   * @private
	   */
	  treemode._onKeyDown = function (event) {
	    var keynum = event.which || event.keyCode;
	    var ctrlKey = event.ctrlKey;
	    var shiftKey = event.shiftKey;
	    var handled = false;

	    if (keynum == 9) { // Tab or Shift+Tab
	      setTimeout(function () {
	        // select all text when moving focus to an editable div
	        util.selectContentEditable(domFocus);
	      }, 0);
	    }

	    if (this.searchBox) {
	      if (ctrlKey && keynum == 70) { // Ctrl+F
	        this.searchBox.dom.search.focus();
	        this.searchBox.dom.search.select();
	        handled = true;
	      }
	      else if (keynum == 114 || (ctrlKey && keynum == 71)) { // F3 or Ctrl+G
	        var focus = true;
	        if (!shiftKey) {
	          // select next search result (F3 or Ctrl+G)
	          this.searchBox.next(focus);
	        }
	        else {
	          // select previous search result (Shift+F3 or Ctrl+Shift+G)
	          this.searchBox.previous(focus);
	        }

	        handled = true;
	      }
	    }

	    if (this.history) {
	      if (ctrlKey && !shiftKey && keynum == 90) { // Ctrl+Z
	        // undo
	        this._onUndo();
	        handled = true;
	      }
	      else if (ctrlKey && shiftKey && keynum == 90) { // Ctrl+Shift+Z
	        // redo
	        this._onRedo();
	        handled = true;
	      }
	    }

	    if (handled) {
	      event.preventDefault();
	      event.stopPropagation();
	    }
	  };

	  /**
	   * Create main table
	   * @private
	   */
	  treemode._createTable = function () {
	    var contentOuter = document.createElement('div');
	    contentOuter.className = 'outer';
	    this.contentOuter = contentOuter;

	    this.content = document.createElement('div');
	    this.content.className = 'tree';
	    contentOuter.appendChild(this.content);

	    this.table = document.createElement('table');
	    this.table.className = 'tree';
	    this.content.appendChild(this.table);

	    // create colgroup where the first two columns don't have a fixed
	    // width, and the edit columns do have a fixed width
	    var col;
	    this.colgroupContent = document.createElement('colgroup');
	    col = document.createElement('col');
	    col.width = "24px";
	    this.colgroupContent.appendChild(col);
	    col = document.createElement('col');
	    this.colgroupContent.appendChild(col);
	    this.table.appendChild(this.colgroupContent);

	    this.tbody = document.createElement('tbody');
	    this.table.appendChild(this.tbody);

	    this.frame.appendChild(contentOuter);
	  };

	  // define modes
	  return [
	    {
	      mode: 'tree',
	      mixin: treemode,
	      data: 'value'
	    }
	  ];
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

	  // create namespace
	  var util = {};

	  /**
	   * Parse JSON using the parser built-in in the browser.
	   * On exception, the jsonString is validated and a detailed error is thrown.
	   * @param {String} jsonString
	   * @return {JSON} json
	   */
	  util.parse = function parse(jsonString) {
	    try {
	      return JSON.parse(jsonString);
	    }
	    catch (err) {
	      // try to load as JavaScript instead of JSON (like "{a: 2}" instead of "{"a": 2}"
	      try {
	        return util.parseJS(jsonString);
	      }
	      catch(err2) {
	        // ok no luck loading as JavaScript

	        // try to throw a more detailed error message using validate
	        util.validate(jsonString);

	        // rethrow the original error
	        throw err;
	      }
	    }
	  };

	  /**
	   * Parse a string containing an object in JavaScript notation into a JSON.
	   * Throws an error when not successful. This function can for example parse
	   * a string like "{a: 2, 'b': {c: 'd'}".
	   * @param {string} jsString
	   * @returns {JSON} json
	   */
	  util.parseJS = function (jsString) {
	    // escape all single and double quotes inside strings
	    var chars = [];
	    var inString = false;
	    var i = 0;
	    while(i < jsString.length) {
	      var c = jsString.charAt(i);
	      var isEscaped = jsString.charAt(i - 1) === '\\';

	      if ((c === '"' || c === '\'') && !isEscaped) {
	        if (c === inString) {
	          // end of string
	          inString = false;
	        }
	        else if (!inString) {
	          // start of string
	          inString = c;
	        }
	        else {
	          // add escape character
	          chars.push('\\');
	        }
	      }

	      chars.push(c);
	      i++;
	    }
	    var jsonString = chars.join('');

	    // replace unescaped single quotes with double quotes,
	    // and replace escaped single quotes with unescaped single quotes
	    // TODO: we could do this step immediately in the previous step
	    jsonString = jsonString.replace(/(.?)'/g, function ($0, $1) {
	      return ($1 == '\\') ? '\'' : $1 + '"';
	    });

	    // enclose unquoted object keys with double quotes
	    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, function ($0, $1, $2, $3) {
	      return $1 + '"' + $2 + '"' + $3;
	    });

	    return JSON.parse(jsonString);
	  };

	  /**
	   * Validate a string containing a JSON object
	   * This method uses JSONLint to validate the String. If JSONLint is not
	   * available, the built-in JSON parser of the browser is used.
	   * @param {String} jsonString   String with an (invalid) JSON object
	   * @throws Error
	   */
	  util.validate = function validate(jsonString) {
	    if (typeof(jsonlint) != 'undefined') {
	      jsonlint.parse(jsonString);
	    }
	    else {
	      JSON.parse(jsonString);
	    }
	  };

	  /**
	   * Extend object a with the properties of object b
	   * @param {Object} a
	   * @param {Object} b
	   * @return {Object} a
	   */
	  util.extend = function extend(a, b) {
	    for (var prop in b) {
	      if (b.hasOwnProperty(prop)) {
	        a[prop] = b[prop];
	      }
	    }
	    return a;
	  };

	  /**
	   * Remove all properties from object a
	   * @param {Object} a
	   * @return {Object} a
	   */
	  util.clear = function clear (a) {
	    for (var prop in a) {
	      if (a.hasOwnProperty(prop)) {
	        delete a[prop];
	      }
	    }
	    return a;
	  };

	  /**
	   * Output text to the console, if console is available
	   * @param {...*} args
	   */
	  util.log = function log (args) {
	    if (typeof console !== 'undefined' && typeof console.log === 'function') {
	      console.log.apply(console, arguments);
	    }
	  };

	  /**
	   * Get the type of an object
	   * @param {*} object
	   * @return {String} type
	   */
	  util.type = function type (object) {
	    if (object === null) {
	      return 'null';
	    }
	    if (object === undefined) {
	      return 'undefined';
	    }
	    if ((object instanceof Number) || (typeof object === 'number')) {
	      return 'number';
	    }
	    if ((object instanceof String) || (typeof object === 'string')) {
	      return 'string';
	    }
	    if ((object instanceof Boolean) || (typeof object === 'boolean')) {
	      return 'boolean';
	    }
	    if ((object instanceof RegExp) || (typeof object === 'regexp')) {
	      return 'regexp';
	    }
	    if (util.isArray(object)) {
	      return 'array';
	    }

	    return 'object';
	  };

	  /**
	   * Test whether a text contains a url (matches when a string starts
	   * with 'http://*' or 'https://*' and has no whitespace characters)
	   * @param {String} text
	   */
	  var isUrlRegex = /^https?:\/\/\S+$/;
	  util.isUrl = function isUrl (text) {
	    return (typeof text == 'string' || text instanceof String) &&
	        isUrlRegex.test(text);
	  };

	  /**
	   * Tes whether given object is an Array
	   * @param {*} obj
	   * @returns {boolean} returns true when obj is an array
	   */
	  util.isArray = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	  };

	  /**
	   * Retrieve the absolute left value of a DOM element
	   * @param {Element} elem    A dom element, for example a div
	   * @return {Number} left    The absolute left position of this element
	   *                          in the browser page.
	   */
	  util.getAbsoluteLeft = function getAbsoluteLeft(elem) {
	    var rect = elem.getBoundingClientRect();
	    return rect.left + window.pageXOffset || document.scrollLeft || 0;
	  };

	  /**
	   * Retrieve the absolute top value of a DOM element
	   * @param {Element} elem    A dom element, for example a div
	   * @return {Number} top     The absolute top position of this element
	   *                          in the browser page.
	   */
	  util.getAbsoluteTop = function getAbsoluteTop(elem) {
	    var rect = elem.getBoundingClientRect();
	    return rect.top + window.pageYOffset || document.scrollTop || 0;
	  };

	  /**
	   * add a className to the given elements style
	   * @param {Element} elem
	   * @param {String} className
	   */
	  util.addClassName = function addClassName(elem, className) {
	    var classes = elem.className.split(' ');
	    if (classes.indexOf(className) == -1) {
	      classes.push(className); // add the class to the array
	      elem.className = classes.join(' ');
	    }
	  };

	  /**
	   * add a className to the given elements style
	   * @param {Element} elem
	   * @param {String} className
	   */
	  util.removeClassName = function removeClassName(elem, className) {
	    var classes = elem.className.split(' ');
	    var index = classes.indexOf(className);
	    if (index != -1) {
	      classes.splice(index, 1); // remove the class from the array
	      elem.className = classes.join(' ');
	    }
	  };

	  /**
	   * Strip the formatting from the contents of a div
	   * the formatting from the div itself is not stripped, only from its childs.
	   * @param {Element} divElement
	   */
	  util.stripFormatting = function stripFormatting(divElement) {
	    var childs = divElement.childNodes;
	    for (var i = 0, iMax = childs.length; i < iMax; i++) {
	      var child = childs[i];

	      // remove the style
	      if (child.style) {
	        // TODO: test if child.attributes does contain style
	        child.removeAttribute('style');
	      }

	      // remove all attributes
	      var attributes = child.attributes;
	      if (attributes) {
	        for (var j = attributes.length - 1; j >= 0; j--) {
	          var attribute = attributes[j];
	          if (attribute.specified == true) {
	            child.removeAttribute(attribute.name);
	          }
	        }
	      }

	      // recursively strip childs
	      util.stripFormatting(child);
	    }
	  };

	  /**
	   * Set focus to the end of an editable div
	   * code from Nico Burns
	   * http://stackoverflow.com/users/140293/nico-burns
	   * http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
	   * @param {Element} contentEditableElement   A content editable div
	   */
	  util.setEndOfContentEditable = function setEndOfContentEditable(contentEditableElement) {
	    var range, selection;
	    if(document.createRange) {
	      range = document.createRange();//Create a range (a range is a like the selection but invisible)
	      range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
	      range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
	      selection = window.getSelection();//get the selection object (allows you to change selection)
	      selection.removeAllRanges();//remove any selections already made
	      selection.addRange(range);//make the range you have just created the visible selection
	    }
	  };

	  /**
	   * Select all text of a content editable div.
	   * http://stackoverflow.com/a/3806004/1262753
	   * @param {Element} contentEditableElement   A content editable div
	   */
	  util.selectContentEditable = function selectContentEditable(contentEditableElement) {
	    if (!contentEditableElement || contentEditableElement.nodeName != 'DIV') {
	      return;
	    }

	    var sel, range;
	    if (window.getSelection && document.createRange) {
	      range = document.createRange();
	      range.selectNodeContents(contentEditableElement);
	      sel = window.getSelection();
	      sel.removeAllRanges();
	      sel.addRange(range);
	    }
	  };

	  /**
	   * Get text selection
	   * http://stackoverflow.com/questions/4687808/contenteditable-selected-text-save-and-restore
	   * @return {Range | TextRange | null} range
	   */
	  util.getSelection = function getSelection() {
	    if (window.getSelection) {
	      var sel = window.getSelection();
	      if (sel.getRangeAt && sel.rangeCount) {
	        return sel.getRangeAt(0);
	      }
	    }
	    return null;
	  };

	  /**
	   * Set text selection
	   * http://stackoverflow.com/questions/4687808/contenteditable-selected-text-save-and-restore
	   * @param {Range | TextRange | null} range
	   */
	  util.setSelection = function setSelection(range) {
	    if (range) {
	      if (window.getSelection) {
	        var sel = window.getSelection();
	        sel.removeAllRanges();
	        sel.addRange(range);
	      }
	    }
	  };

	  /**
	   * Get selected text range
	   * @return {Object} params  object containing parameters:
	   *                              {Number}  startOffset
	   *                              {Number}  endOffset
	   *                              {Element} container  HTML element holding the
	   *                                                   selected text element
	   *                          Returns null if no text selection is found
	   */
	  util.getSelectionOffset = function getSelectionOffset() {
	    var range = util.getSelection();

	    if (range && 'startOffset' in range && 'endOffset' in range &&
	        range.startContainer && (range.startContainer == range.endContainer)) {
	      return {
	        startOffset: range.startOffset,
	        endOffset: range.endOffset,
	        container: range.startContainer.parentNode
	      };
	    }

	    return null;
	  };

	  /**
	   * Set selected text range in given element
	   * @param {Object} params   An object containing:
	   *                              {Element} container
	   *                              {Number} startOffset
	   *                              {Number} endOffset
	   */
	  util.setSelectionOffset = function setSelectionOffset(params) {
	    if (document.createRange && window.getSelection) {
	      var selection = window.getSelection();
	      if(selection) {
	        var range = document.createRange();
	        // TODO: do not suppose that the first child of the container is a textnode,
	        //       but recursively find the textnodes
	        range.setStart(params.container.firstChild, params.startOffset);
	        range.setEnd(params.container.firstChild, params.endOffset);

	        util.setSelection(range);
	      }
	    }
	  };

	  /**
	   * Get the inner text of an HTML element (for example a div element)
	   * @param {Element} element
	   * @param {Object} [buffer]
	   * @return {String} innerText
	   */
	  util.getInnerText = function getInnerText(element, buffer) {
	    var first = (buffer == undefined);
	    if (first) {
	      buffer = {
	        'text': '',
	        'flush': function () {
	          var text = this.text;
	          this.text = '';
	          return text;
	        },
	        'set': function (text) {
	          this.text = text;
	        }
	      };
	    }

	    // text node
	    if (element.nodeValue) {
	      return buffer.flush() + element.nodeValue;
	    }

	    // divs or other HTML elements
	    if (element.hasChildNodes()) {
	      var childNodes = element.childNodes;
	      var innerText = '';

	      for (var i = 0, iMax = childNodes.length; i < iMax; i++) {
	        var child = childNodes[i];

	        if (child.nodeName == 'DIV' || child.nodeName == 'P') {
	          var prevChild = childNodes[i - 1];
	          var prevName = prevChild ? prevChild.nodeName : undefined;
	          if (prevName && prevName != 'DIV' && prevName != 'P' && prevName != 'BR') {
	            innerText += '\n';
	            buffer.flush();
	          }
	          innerText += util.getInnerText(child, buffer);
	          buffer.set('\n');
	        }
	        else if (child.nodeName == 'BR') {
	          innerText += buffer.flush();
	          buffer.set('\n');
	        }
	        else {
	          innerText += util.getInnerText(child, buffer);
	        }
	      }

	      return innerText;
	    }
	    else {
	      if (element.nodeName == 'P' && util.getInternetExplorerVersion() != -1) {
	        // On Internet Explorer, a <p> with hasChildNodes()==false is
	        // rendered with a new line. Note that a <p> with
	        // hasChildNodes()==true is rendered without a new line
	        // Other browsers always ensure there is a <br> inside the <p>,
	        // and if not, the <p> does not render a new line
	        return buffer.flush();
	      }
	    }

	    // br or unknown
	    return '';
	  };

	  /**
	   * Returns the version of Internet Explorer or a -1
	   * (indicating the use of another browser).
	   * Source: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
	   * @return {Number} Internet Explorer version, or -1 in case of an other browser
	   */
	  util.getInternetExplorerVersion = function getInternetExplorerVersion() {
	    if (_ieVersion == -1) {
	      var rv = -1; // Return value assumes failure.
	      if (navigator.appName == 'Microsoft Internet Explorer')
	      {
	        var ua = navigator.userAgent;
	        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	        if (re.exec(ua) != null) {
	          rv = parseFloat( RegExp.$1 );
	        }
	      }

	      _ieVersion = rv;
	    }

	    return _ieVersion;
	  };

	  /**
	   * Test whether the current browser is Firefox
	   * @returns {boolean} isFirefox
	   */
	  util.isFirefox = function isFirefox () {
	    return (navigator.userAgent.indexOf("Firefox") != -1);
	  };

	  /**
	   * cached internet explorer version
	   * @type {Number}
	   * @private
	   */
	  var _ieVersion = -1;

	  /**
	   * Add and event listener. Works for all browsers
	   * @param {Element}     element    An html element
	   * @param {string}      action     The action, for example "click",
	   *                                 without the prefix "on"
	   * @param {function}    listener   The callback function to be executed
	   * @param {boolean}     [useCapture] false by default
	   * @return {function}   the created event listener
	   */
	  util.addEventListener = function addEventListener(element, action, listener, useCapture) {
	    if (element.addEventListener) {
	      if (useCapture === undefined)
	        useCapture = false;

	      if (action === "mousewheel" && util.isFirefox()) {
	        action = "DOMMouseScroll";  // For Firefox
	      }

	      element.addEventListener(action, listener, useCapture);
	      return listener;
	    } else if (element.attachEvent) {
	      // Old IE browsers
	      var f = function () {
	        return listener.call(element, window.event);
	      };
	      element.attachEvent("on" + action, f);
	      return f;
	    }
	  };

	  /**
	   * Remove an event listener from an element
	   * @param {Element}  element   An html dom element
	   * @param {string}   action    The name of the event, for example "mousedown"
	   * @param {function} listener  The listener function
	   * @param {boolean}  [useCapture]   false by default
	   */
	  util.removeEventListener = function removeEventListener(element, action, listener, useCapture) {
	    if (element.removeEventListener) {
	      if (useCapture === undefined)
	        useCapture = false;

	      if (action === "mousewheel" && util.isFirefox()) {
	        action = "DOMMouseScroll";  // For Firefox
	      }

	      element.removeEventListener(action, listener, useCapture);
	    } else if (element.detachEvent) {
	      // Old IE browsers
	      element.detachEvent("on" + action, listener);
	    }
	  };

	  return util;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

	  /**
	   * The highlighter can highlight/unhighlight a node, and
	   * animate the visibility of a context menu.
	   * @constructor Highlighter
	   */
	  function Highlighter () {
	    this.locked = false;
	  }

	  /**
	   * Hightlight given node and its childs
	   * @param {Node} node
	   */
	  Highlighter.prototype.highlight = function (node) {
	    if (this.locked) {
	      return;
	    }

	    if (this.node != node) {
	      // unhighlight current node
	      if (this.node) {
	        this.node.setHighlight(false);
	      }

	      // highlight new node
	      this.node = node;
	      this.node.setHighlight(true);
	    }

	    // cancel any current timeout
	    this._cancelUnhighlight();
	  };

	  /**
	   * Unhighlight currently highlighted node.
	   * Will be done after a delay
	   */
	  Highlighter.prototype.unhighlight = function () {
	    if (this.locked) {
	      return;
	    }

	    var me = this;
	    if (this.node) {
	      this._cancelUnhighlight();

	      // do the unhighlighting after a small delay, to prevent re-highlighting
	      // the same node when moving from the drag-icon to the contextmenu-icon
	      // or vice versa.
	      this.unhighlightTimer = setTimeout(function () {
	        me.node.setHighlight(false);
	        me.node = undefined;
	        me.unhighlightTimer = undefined;
	      }, 0);
	    }
	  };

	  /**
	   * Cancel an unhighlight action (if before the timeout of the unhighlight action)
	   * @private
	   */
	  Highlighter.prototype._cancelUnhighlight = function () {
	    if (this.unhighlightTimer) {
	      clearTimeout(this.unhighlightTimer);
	      this.unhighlightTimer = undefined;
	    }
	  };

	  /**
	   * Lock highlighting or unhighlighting nodes.
	   * methods highlight and unhighlight do not work while locked.
	   */
	  Highlighter.prototype.lock = function () {
	    this.locked = true;
	  };

	  /**
	   * Unlock highlighting or unhighlighting nodes
	   */
	  Highlighter.prototype.unlock = function () {
	    this.locked = false;
	  };

	  return Highlighter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (util) {

	  /**
	   * @constructor History
	   * Store action history, enables undo and redo
	   * @param {JSONEditor} editor
	   */
	  function History (editor) {
	    this.editor = editor;
	    this.clear();

	    // map with all supported actions
	    this.actions = {
	      'editField': {
	        'undo': function (params) {
	          params.node.updateField(params.oldValue);
	        },
	        'redo': function (params) {
	          params.node.updateField(params.newValue);
	        }
	      },
	      'editValue': {
	        'undo': function (params) {
	          params.node.updateValue(params.oldValue);
	        },
	        'redo': function (params) {
	          params.node.updateValue(params.newValue);
	        }
	      },
	      'appendNode': {
	        'undo': function (params) {
	          params.parent.removeChild(params.node);
	        },
	        'redo': function (params) {
	          params.parent.appendChild(params.node);
	        }
	      },
	      'insertBeforeNode': {
	        'undo': function (params) {
	          params.parent.removeChild(params.node);
	        },
	        'redo': function (params) {
	          params.parent.insertBefore(params.node, params.beforeNode);
	        }
	      },
	      'insertAfterNode': {
	        'undo': function (params) {
	          params.parent.removeChild(params.node);
	        },
	        'redo': function (params) {
	          params.parent.insertAfter(params.node, params.afterNode);
	        }
	      },
	      'removeNode': {
	        'undo': function (params) {
	          var parent = params.parent;
	          var beforeNode = parent.childs[params.index] || parent.append;
	          parent.insertBefore(params.node, beforeNode);
	        },
	        'redo': function (params) {
	          params.parent.removeChild(params.node);
	        }
	      },
	      'duplicateNode': {
	        'undo': function (params) {
	          params.parent.removeChild(params.clone);
	        },
	        'redo': function (params) {
	          params.parent.insertAfter(params.clone, params.node);
	        }
	      },
	      'moveNode': {
	        'undo': function (params) {
	          params.startParent.moveTo(params.node, params.startIndex);
	        },
	        'redo': function (params) {
	          params.endParent.moveTo(params.node, params.endIndex);
	        }
	      }

	      // TODO: restore the original caret position and selection with each undo
	      // TODO: implement history for actions "expand", "collapse", "scroll", "setDocument"
	    };
	  }

	  /**
	   * The method onChange is executed when the History is changed, and can
	   * be overloaded.
	   */
	  History.prototype.onChange = function () {};

	  /**
	   * Add a new action to the history
	   * @param {String} action  The executed action. Available actions: "editField",
	   *                         "editValue", "appendNode",
	   *                         "removeNode", "duplicateNode", "moveNode"
	   * @param {Object} params  Object containing parameters describing the change.
	   *                         The parameters in params depend on the action (for
	   *                         example for "editValue" the Node, old value, and new
	   *                         value are provided). params contains all information
	   *                         needed to undo or redo the action.
	   */
	  History.prototype.add = function (action, params) {
	    this.index++;
	    this.history[this.index] = {
	      'action': action,
	      'params': params,
	      'timestamp': new Date()
	    };

	    // remove redo actions which are invalid now
	    if (this.index < this.history.length - 1) {
	      this.history.splice(this.index + 1, this.history.length - this.index - 1);
	    }

	    // fire onchange event
	    this.onChange();
	  };

	  /**
	   * Clear history
	   */
	  History.prototype.clear = function () {
	    this.history = [];
	    this.index = -1;

	    // fire onchange event
	    this.onChange();
	  };

	  /**
	   * Check if there is an action available for undo
	   * @return {Boolean} canUndo
	   */
	  History.prototype.canUndo = function () {
	    return (this.index >= 0);
	  };

	  /**
	   * Check if there is an action available for redo
	   * @return {Boolean} canRedo
	   */
	  History.prototype.canRedo = function () {
	    return (this.index < this.history.length - 1);
	  };

	  /**
	   * Undo the last action
	   */
	  History.prototype.undo = function () {
	    if (this.canUndo()) {
	      var obj = this.history[this.index];
	      if (obj) {
	        var action = this.actions[obj.action];
	        if (action && action.undo) {
	          action.undo(obj.params);
	          if (obj.params.oldSelection) {
	            this.editor.setSelection(obj.params.oldSelection);
	          }
	        }
	        else {
	          util.log('Error: unknown action "' + obj.action + '"');
	        }
	      }
	      this.index--;

	      // fire onchange event
	      this.onChange();
	    }
	  };

	  /**
	   * Redo the last action
	   */
	  History.prototype.redo = function () {
	    if (this.canRedo()) {
	      this.index++;

	      var obj = this.history[this.index];
	      if (obj) {
	        var action = this.actions[obj.action];
	        if (action && action.redo) {
	          action.redo(obj.params);
	          if (obj.params.newSelection) {
	            this.editor.setSelection(obj.params.newSelection);
	          }
	        }
	        else {
	          util.log('Error: unknown action "' + obj.action + '"');
	        }
	      }

	      // fire onchange event
	      this.onChange();
	    }
	  };

	  return History;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

	  /**
	   * @constructor SearchBox
	   * Create a search box in given HTML container
	   * @param {JSONEditor} editor    The JSON Editor to attach to
	   * @param {Element} container               HTML container element of where to
	   *                                          create the search box
	   */
	  function SearchBox (editor, container) {
	    var searchBox = this;

	    this.editor = editor;
	    this.timeout = undefined;
	    this.delay = 200; // ms
	    this.lastText = undefined;

	    this.dom = {};
	    this.dom.container = container;

	    var table = document.createElement('table');
	    this.dom.table = table;
	    table.className = 'search';
	    container.appendChild(table);
	    var tbody = document.createElement('tbody');
	    this.dom.tbody = tbody;
	    table.appendChild(tbody);
	    var tr = document.createElement('tr');
	    tbody.appendChild(tr);

	    var td = document.createElement('td');
	    tr.appendChild(td);
	    var results = document.createElement('div');
	    this.dom.results = results;
	    results.className = 'results';
	    td.appendChild(results);

	    td = document.createElement('td');
	    tr.appendChild(td);
	    var divInput = document.createElement('div');
	    this.dom.input = divInput;
	    divInput.className = 'frame';
	    divInput.title = 'Search fields and values';
	    td.appendChild(divInput);

	    // table to contain the text input and search button
	    var tableInput = document.createElement('table');
	    divInput.appendChild(tableInput);
	    var tbodySearch = document.createElement('tbody');
	    tableInput.appendChild(tbodySearch);
	    tr = document.createElement('tr');
	    tbodySearch.appendChild(tr);

	    var refreshSearch = document.createElement('button');
	    refreshSearch.className = 'refresh';
	    td = document.createElement('td');
	    td.appendChild(refreshSearch);
	    tr.appendChild(td);

	    var search = document.createElement('input');
	    this.dom.search = search;
	    search.oninput = function (event) {
	      searchBox._onDelayedSearch(event);
	    };
	    search.onchange = function (event) { // For IE 9
	      searchBox._onSearch(event);
	    };
	    search.onkeydown = function (event) {
	      searchBox._onKeyDown(event);
	    };
	    search.onkeyup = function (event) {
	      searchBox._onKeyUp(event);
	    };
	    refreshSearch.onclick = function (event) {
	      search.select();
	    };

	    // TODO: ESC in FF restores the last input, is a FF bug, https://bugzilla.mozilla.org/show_bug.cgi?id=598819
	    td = document.createElement('td');
	    td.appendChild(search);
	    tr.appendChild(td);

	    var searchNext = document.createElement('button');
	    searchNext.title = 'Next result (Enter)';
	    searchNext.className = 'next';
	    searchNext.onclick = function () {
	      searchBox.next();
	    };
	    td = document.createElement('td');
	    td.appendChild(searchNext);
	    tr.appendChild(td);

	    var searchPrevious = document.createElement('button');
	    searchPrevious.title = 'Previous result (Shift+Enter)';
	    searchPrevious.className = 'previous';
	    searchPrevious.onclick = function () {
	      searchBox.previous();
	    };
	    td = document.createElement('td');
	    td.appendChild(searchPrevious);
	    tr.appendChild(td);
	  }

	  /**
	   * Go to the next search result
	   * @param {boolean} [focus]   If true, focus will be set to the next result
	   *                            focus is false by default.
	   */
	  SearchBox.prototype.next = function(focus) {
	    if (this.results != undefined) {
	      var index = (this.resultIndex != undefined) ? this.resultIndex + 1 : 0;
	      if (index > this.results.length - 1) {
	        index = 0;
	      }
	      this._setActiveResult(index, focus);
	    }
	  };

	  /**
	   * Go to the prevous search result
	   * @param {boolean} [focus]   If true, focus will be set to the next result
	   *                            focus is false by default.
	   */
	  SearchBox.prototype.previous = function(focus) {
	    if (this.results != undefined) {
	      var max = this.results.length - 1;
	      var index = (this.resultIndex != undefined) ? this.resultIndex - 1 : max;
	      if (index < 0) {
	        index = max;
	      }
	      this._setActiveResult(index, focus);
	    }
	  };

	  /**
	   * Set new value for the current active result
	   * @param {Number} index
	   * @param {boolean} [focus]   If true, focus will be set to the next result.
	   *                            focus is false by default.
	   * @private
	   */
	  SearchBox.prototype._setActiveResult = function(index, focus) {
	    // de-activate current active result
	    if (this.activeResult) {
	      var prevNode = this.activeResult.node;
	      var prevElem = this.activeResult.elem;
	      if (prevElem == 'field') {
	        delete prevNode.searchFieldActive;
	      }
	      else {
	        delete prevNode.searchValueActive;
	      }
	      prevNode.updateDom();
	    }

	    if (!this.results || !this.results[index]) {
	      // out of range, set to undefined
	      this.resultIndex = undefined;
	      this.activeResult = undefined;
	      return;
	    }

	    this.resultIndex = index;

	    // set new node active
	    var node = this.results[this.resultIndex].node;
	    var elem = this.results[this.resultIndex].elem;
	    if (elem == 'field') {
	      node.searchFieldActive = true;
	    }
	    else {
	      node.searchValueActive = true;
	    }
	    this.activeResult = this.results[this.resultIndex];
	    node.updateDom();

	    // TODO: not so nice that the focus is only set after the animation is finished
	    node.scrollTo(function () {
	      if (focus) {
	        node.focus(elem);
	      }
	    });
	  };

	  /**
	   * Cancel any running onDelayedSearch.
	   * @private
	   */
	  SearchBox.prototype._clearDelay = function() {
	    if (this.timeout != undefined) {
	      clearTimeout(this.timeout);
	      delete this.timeout;
	    }
	  };

	  /**
	   * Start a timer to execute a search after a short delay.
	   * Used for reducing the number of searches while typing.
	   * @param {Event} event
	   * @private
	   */
	  SearchBox.prototype._onDelayedSearch = function (event) {
	    // execute the search after a short delay (reduces the number of
	    // search actions while typing in the search text box)
	    this._clearDelay();
	    var searchBox = this;
	    this.timeout = setTimeout(function (event) {
	          searchBox._onSearch(event);
	        },
	        this.delay);
	  };

	  /**
	   * Handle onSearch event
	   * @param {Event} event
	   * @param {boolean} [forceSearch]  If true, search will be executed again even
	   *                                 when the search text is not changed.
	   *                                 Default is false.
	   * @private
	   */
	  SearchBox.prototype._onSearch = function (event, forceSearch) {
	    this._clearDelay();

	    var value = this.dom.search.value;
	    var text = (value.length > 0) ? value : undefined;
	    if (text != this.lastText || forceSearch) {
	      // only search again when changed
	      this.lastText = text;
	      this.results = this.editor.search(text);
	      this._setActiveResult(undefined);

	      // display search results
	      if (text != undefined) {
	        var resultCount = this.results.length;
	        switch (resultCount) {
	          case 0: this.dom.results.innerHTML = 'no&nbsp;results'; break;
	          case 1: this.dom.results.innerHTML = '1&nbsp;result'; break;
	          default: this.dom.results.innerHTML = resultCount + '&nbsp;results'; break;
	        }
	      }
	      else {
	        this.dom.results.innerHTML = '';
	      }
	    }
	  };

	  /**
	   * Handle onKeyDown event in the input box
	   * @param {Event} event
	   * @private
	   */
	  SearchBox.prototype._onKeyDown = function (event) {
	    var keynum = event.which;
	    if (keynum == 27) { // ESC
	      this.dom.search.value = '';  // clear search
	      this._onSearch(event);
	      event.preventDefault();
	      event.stopPropagation();
	    }
	    else if (keynum == 13) { // Enter
	      if (event.ctrlKey) {
	        // force to search again
	        this._onSearch(event, true);
	      }
	      else if (event.shiftKey) {
	        // move to the previous search result
	        this.previous();
	      }
	      else {
	        // move to the next search result
	        this.next();
	      }
	      event.preventDefault();
	      event.stopPropagation();
	    }
	  };

	  /**
	   * Handle onKeyUp event in the input box
	   * @param {Event} event
	   * @private
	   */
	  SearchBox.prototype._onKeyUp = function (event) {
	    var keynum = event.keyCode;
	    if (keynum != 27 && keynum != 13) { // !show and !Enter
	      this._onDelayedSearch(event);   // For IE 9
	    }
	  };

	  return SearchBox;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));




/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (appendNodeFactory, util) {
	  function _pathIsInReadOnlyPaths(aimaraPath, readOnlyAimaraPaths) {
	    var currentPath, areEquals;

	    for (var iPaths = 0, lPaths=readOnlyAimaraPaths.length; iPaths < lPaths; iPaths++) {
	      currentPath = readOnlyAimaraPaths[iPaths];
	      if (aimaraPath.join(",") === currentPath.join(",")) {
	        return true;
	      }
	    }
	    return false;
	  }

	  /**
	  * Extract the actual TypeInfo instance from a TypeInfo or a FieldInfo
	  * @param type
	  */
	  function getActualTypeInfo(type) {
	    if (type.typeInfo) {
	        // asume it's a FieldInfo
	        return type.typeInfo;
	    } else {
	        // asume it's a TypeInfo
	        return type;
	    }
	  }

	  /**
	   * @constructor Node
	   * Create a new Node
	   * @param {TreeEditor} editor
	   * @param {Object} [params] Can contain parameters:
	   *                          {string}  field
	   *                          {boolean} fieldEditable
	   *                          {*}       value
	   *                          {Type}     type
	   */
	  function Node (editor, params) {
	    /** @type {TreeEditor} */
	    this.editor = editor;
	    this.dom = {};
	    this.expanded = false;

	    if (params && params.aimaraPath) {
	      this.aimaraPath = params.aimaraPath;
	    } else if (editor) {
	      this.aimaraPath = editor.options.rootAimaraPath;
	    } else {
	      this.aimaraPath = [];
	    }

	    var readOnlyAimaraPaths;
	    if (this.editor) {
	      readOnlyAimaraPaths = editor.options.readOnlyAimaraPaths;
	    } else {
	      readOnlyAimaraPaths = [];
	    }

	    this.isAimaraReadOnly = _pathIsInReadOnlyPaths(this.aimaraPath, readOnlyAimaraPaths);

	    if(params && (params instanceof Object)) {
	      this.setField(params.field, params.fieldEditable);
	      this.setValue(params.value, params.type);
	    }
	    else {
	      this.setField('');
	      this.setValue(null);
	    }
	  }

	  /**
	   * Determine whether the field and/or value of this node are editable
	   * @private
	   */
	  Node.prototype._updateEditability = function () {
	    this.editable = {
	      field: true,
	      value: true
	    };

	    if (this.editor) {
	      this.editable.field = this.editor.options.mode === 'tree';
	      this.editable.value = this.editor.options.mode !== 'view';

	      if (this.editor.options.mode === 'tree' && (typeof this.editor.options.editable === 'function')) {
	        var editable = this.editor.options.editable({
	          field: this.field,
	          value: this.value,
	          path: this.path()
	        });

	        if (typeof editable === 'boolean') {
	          this.editable.field = editable;
	          this.editable.value = editable;
	        }
	        else {
	          if (typeof editable.field === 'boolean') this.editable.field = editable.field;
	          if (typeof editable.value === 'boolean') this.editable.value = editable.value;
	        }
	      }
	    }
	  };

	  /**
	   * Get the path of this node
	   * @return {String[]} Array containing the path to this node
	   */
	  Node.prototype.path = function () {
	    var node = this;
	    var path = [];
	    while (node) {
	      var field = node.field != undefined ? node.field : node.index;
	      if (field !== undefined) {
	        path.unshift(field);
	      }
	      node = node.parent;
	    }
	    return path;
	  };

	  /**
	   * Set parent node
	   * @param {Node} parent
	   */
	  Node.prototype.setParent = function(parent) {
	    this.parent = parent;
	  };

	  /**
	   * Set field
	   * @param {String}  field
	   * @param {boolean} [fieldEditable]
	   */
	  Node.prototype.setField = function(field, fieldEditable) {
	    this.field = field;
	    this.fieldEditable = (fieldEditable == true);
	  };

	  /**
	   * Get field
	   * @return {String}
	   */
	  Node.prototype.getField = function() {
	    if (this.field === undefined) {
	      this._getDomField();
	    }

	    return this.field;
	  };

	  /**
	   * This is used in setValue for constructors inside Choices, 
	   * and plain ol' Constructors 
	   */
	  Node.prototype._addConstructorChildren = function(constructor, value, errors) {
	    var child, childValue, field;
	    constructor = getActualTypeInfo(constructor);
	    var fields = constructor.childTypesWithPaths(this.aimaraPath);
	    for (var i = 0, iMax = fields.length; i < iMax; i++) {
	      field = fields[i];
	      if (value[field.fieldName] === undefined || value[field.fieldName] === null) {
	        errors.push('Missing field: ' + field.fieldName);
	        value[field.fieldName] = field.typeInfo.buildDefaultValue();
	      }
	      childValue = value[field.fieldName];
	      child = new Node(this.editor, {
	        field: field.fieldName,
	        value: childValue,
	        type: field.typeInfo,
	        aimaraPath: field.path,
	      });
	      this.appendChild(child);
	    }
	  }


	  /**
	   * This is used in setValue for normal lists
	   */
	  Node.prototype._addListChildren = function(type, value) {
	    type = getActualTypeInfo(type)
	    var childrenType = type.childTypesWithPaths(this.aimaraPath)[0],
	        child, childValue;
	    for (var i = 0, iMax = value.length; i < iMax; i++) {
	      childValue = value[i];
	      child = new Node(this.editor, {
	        value: childValue,
	        type: childrenType.typeInfo,
	        aimaraPath: childrenType.path,
	      });
	      this.appendChild(child);
	    }
	  }

	  /**
	   * This is used in setValue for normal dicts
	   */
	  Node.prototype._addDictChildren = function(type, value) {
	    type = getActualTypeInfo(type)
	    var childrenType = type.childTypesWithPaths(this.aimaraPath)[0],
	        child, childValue;
	    for (var childField in value) {
	      if (value.hasOwnProperty(childField)) {
	        childValue = value[childField];
	        if (childValue !== undefined && !(childValue instanceof Function)) {
	          // ignore undefined and functions
	          child = new Node(this.editor, {
	            field: childField,
	            value: childValue,
	            type: childrenType.typeInfo,
	            aimaraPath: childrenType.path,
	          });
	          this.appendChild(child);
	        }
	      }
	    }
	  }

	  /**
	   * Set value. Value is an AIMARA value.
	   * @param {*} value
	   * @param {Type} [type]
	   */
	  Node.prototype.setValue = function(value, type) {
	    var child,
	        errors = [];

	    // first clear all current childs (if any)
	    var childs = this.childs;
	    if (childs) {
	      while (childs.length) {
	        this.removeChild(childs[0]);
	      }
	    }

	    // TODO: remove the DOM of this Node

	    this.type = type || this.type;
	    var fields;

	    if (this.isAimaraReadOnly) {
	      // for aimara read onlys, don't build childrens, will just have a place holder
	      this.value = null;
	      return null;
	    }

	    if (!this.type) {
	      this.childs = undefined;
	      this.value = null;
	    } else if (this.type.getType() == 'List') {
	      this.childs = [];
	      this._addListChildren(this.type, value);
	      this.value = value;
	    }
	    else if (this.type.getType() == 'Constructor') {
	      this.childs = [];
	      this._addConstructorChildren(this.type, value, errors);
	      this.value = value;
	    }
	    else if (this.type.getType() == 'Choice') {
	      this.childs = [];
	      var choices = this.type.getChildren();
	      for (var i = 0, iMax = choices.length; i < iMax; i++) {
	        if (choices[i].getLabel() == value.getLabel()) {
	          break;
	        }
	      }
	      var constructor = choices[i];
	      this._addConstructorChildren(constructor, value, errors);
	      this.value = value;
	    }
	    else if (this.type.getType() == 'Anything') {
	      this.childs = [];

	      // get the type for the fake child based on the value type
	      var valueTypeName = this.editor.options.type_trees.classifyAnything(value),
	          itemType;
	      itemType = this.editor.options.type_trees.buildAnythingChildType(
	          valueTypeName,
	          this.editor.options.knownConstructors
	      );

	      child = new Node(this.editor, {
	        field: 'value',
	        value: value,
	        type: itemType,
	        aimaraPath: this.aimaraPath,
	      });
	      this.appendChild(child);

	      this.value = value;
	    }
	    else if (this.type.getType() == 'Dict') {
	      // object
	      this.childs = [];
	      this._addDictChildren(this.type, value);
	      this.value = value;
	    }
	    else {
	      // null, string, number, boolean
	      this.childs = undefined;
	      this.value = value;
	    }

	    if (this.editor && this.editor.options && typeof this.editor.options.error === 'function') {
	      for (var i = 0; i < errors.length; i++) {
	        this.editor.options.error(errors[i]);
	      }
	    }
	  };


	  /**
	   * Get a filled array with children, used in getValue for lists
	   * @return {*} value
	   */
	  Node.prototype._getArrayFromChildren = function() {
	    var arr = [];
	    this.childs.forEach (function (child) {
	      arr.push(child.getValue());
	    });
	    return arr;
	  }

	  /**
	   * Get a filled dict with children, used in getValue for dicts
	   * @return {*} value
	   */
	  Node.prototype._getDictFromChildren = function() {
	    var obj = {};
	    this.childs.forEach (function (child) {
	      obj[child.getField()] = child.getValue();
	    });
	    return obj;
	  }

	  /**
	   * Get a filled value with children, used in getValue for normal aimara and 
	   * constructed values, constructed values in choices, and in anythings.
	   * @return {*} value
	   */
	  Node.prototype._getAimaraValueFromChildren = function() {
	    var v = this.value;
	    this.childs.forEach (function (child) {
	      v[child.getField()] = child.getValue();
	    });
	    return v;
	  }

	  /**
	   * Get value. Value is an AIMARA value
	   * @return {*} value
	   */
	  Node.prototype.getValue = function() {
	    //var childs, i, iMax;
	    
	    if (this.isAimaraReadOnly) {
	      // for aimara read onlys, get the value from the values source
	      if (this.editor.options.getReadOnlyValue == undefined) {
	        throw new Error('Need a source for the aimara read only values');
	      }

	      return this.editor.options.getReadOnlyValue(this.aimaraPath);
	    }

	    if (this.type.getType() == 'List') {
	      return this._getArrayFromChildren();
	    }
	    else if (this.type.getType() == 'Dict') {
	      return this._getDictFromChildren();
	    }
	    else if (this.type.getType() == 'Constructor' || this.type.getType() == 'Choice') {
	      return this._getAimaraValueFromChildren();
	    } 
	    else if (this.type.getType() == 'Anything') {
	      // just look at the value of the only fake child (shame on you child, you are a fake)
	      return this.childs[0].getValue();
	    }

	    // if no value was returned, it's a plain basic value
	    if (this.value === undefined) {
	      this._getDomValue();
	    }

	    return this.value;
	  };

	  /**
	   * Get the nesting level of this node
	   * @return {Number} level
	   */
	  Node.prototype.getLevel = function() {
	    return (this.parent ? this.parent.getLevel() + 1 : 0);
	  };

	  /**
	   * Create a clone of a node
	   * The complete state of a clone is copied, including whether it is expanded or
	   * not. The DOM elements are not cloned.
	   * @return {Node} clone
	   */
	  Node.prototype.clone = function() {
	    var clone = new Node(this.editor);
	    clone.type = this.type;
	    clone.field = this.field;
	    clone.fieldInnerText = this.fieldInnerText;
	    clone.fieldEditable = this.fieldEditable;
	    clone.value = this.value;
	    clone.expanded = this.expanded;
	    clone.aimaraPath = this.aimaraPath;

	    if (this.childs) {
	      // an object or array
	      var cloneChilds = [];
	      this.childs.forEach(function (child) {
	        var childClone = child.clone();
	        childClone.setParent(clone);
	        cloneChilds.push(childClone);
	      });
	      clone.childs = cloneChilds;
	    }
	    else {
	      // a value
	      clone.childs = undefined;
	    }

	    return clone;
	  };

	  /**
	   * Expand this node and optionally its childs.
	   * @param {boolean} [recurse] Optional recursion, true by default. When
	   *                            true, all childs will be expanded recursively
	   */
	  Node.prototype.expand = function(recurse) {
	    if (!this.childs) {
	      return;
	    }

	    // set this node expanded
	    this.expanded = true;
	    if (this.dom.expand) {
	      this.dom.expand.className = 'expanded';
	    }

	    this.showChilds();

	    if (recurse != false) {
	      this.childs.forEach(function (child) {
	        child.expand(recurse);
	      });
	    }
	  };

	  /**
	   * Collapse this node and optionally its childs.
	   * @param {boolean} [recurse] Optional recursion, true by default. When
	   *                            true, all childs will be collapsed recursively
	   */
	  Node.prototype.collapse = function(recurse) {
	    if (!this.childs) {
	      return;
	    }

	    this.hideChilds();

	    // collapse childs in case of recurse
	    if (recurse != false) {
	      this.childs.forEach(function (child) {
	        child.collapse(recurse);
	      });

	    }

	    // make this node collapsed
	    if (this.dom.expand) {
	      this.dom.expand.className = 'collapsed';
	    }
	    this.expanded = false;
	  };

	  /**
	   * Recursively show all childs when they are expanded
	   */
	  Node.prototype.showChilds = function() {
	    var childs = this.childs;
	    if (!childs) {
	      return;
	    }
	    if (!this.expanded) {
	      return;
	    }

	    var tr = this.dom.tr;
	    var table = tr ? tr.parentNode : undefined;
	    if (table) {
	      // show row with append button
	      var append = this.getAppend();
	      var nextTr = tr.nextSibling;
	      if (nextTr) {
	        table.insertBefore(append, nextTr);
	      }
	      else {
	        table.appendChild(append);
	      }

	      // show childs
	      this.childs.forEach(function (child) {
	        table.insertBefore(child.getDom(), append);
	        child.showChilds();
	      });
	    }
	  };

	  /**
	   * Hide the node with all its childs
	   */
	  Node.prototype.hide = function() {
	    var tr = this.dom.tr;
	    var table = tr ? tr.parentNode : undefined;
	    if (table) {
	      table.removeChild(tr);
	    }
	    this.hideChilds();
	  };


	  /**
	   * Recursively hide all childs
	   */
	  Node.prototype.hideChilds = function() {
	    var childs = this.childs;
	    if (!childs) {
	      return;
	    }
	    if (!this.expanded) {
	      return;
	    }

	    // hide append row
	    var append = this.getAppend();
	    if (append.parentNode) {
	      append.parentNode.removeChild(append);
	    }

	    // hide childs
	    this.childs.forEach(function (child) {
	      child.hide();
	    });
	  };


	  /**
	   * Add a new child to the node.
	   * Only applicable when Node value is of type array or object
	   * @param {Node} node
	   */
	  Node.prototype.appendChild = function(node) {
	    if (this._hasChilds()) {
	      // adjust the link to the parent
	      node.setParent(this);
	      node.fieldEditable = (this.type.getType() == 'Dict');
	      if (this.type.getType() == 'List') {
	        node.index = this.childs.length;
	      }
	      this.childs.push(node);

	      if (this.expanded) {
	        // insert into the DOM, before the appendRow
	        var newTr = node.getDom();
	        var appendTr = this.getAppend();
	        var table = appendTr ? appendTr.parentNode : undefined;
	        if (appendTr && table) {
	          table.insertBefore(newTr, appendTr);
	        }

	        node.showChilds();
	      }

	      this.updateDom({'updateIndexes': true});
	      node.updateDom({'recurse': true});
	    }
	  };


	  /**
	   * Move a node from its current parent to this node
	   * Only applicable when Node value is of type List or Dict
	   * @param {Node} node
	   * @param {Node} beforeNode
	   */
	  Node.prototype.moveBefore = function(node, beforeNode) {
	    if (this._hasChilds()) {
	      // create a temporary row, to prevent the scroll position from jumping
	      // when removing the node
	      var tbody = (this.dom.tr) ? this.dom.tr.parentNode : undefined;
	      if (tbody) {
	        var trTemp = document.createElement('tr');
	        trTemp.style.height = tbody.clientHeight + 'px';
	        tbody.appendChild(trTemp);
	      }

	      if (node.parent) {
	        node.parent.removeChild(node);
	      }

	      if (beforeNode instanceof AppendNode) {
	        this.appendChild(node);
	      }
	      else {
	        this.insertBefore(node, beforeNode);
	      }

	      if (tbody) {
	        tbody.removeChild(trTemp);
	      }
	    }
	  };

	  /**
	   * Move a node from its current parent to this node
	   * Only applicable when Node value is of type array or object.
	   * If index is out of range, the node will be appended to the end
	   * @param {Node} node
	   * @param {Number} index
	   */
	  Node.prototype.moveTo = function (node, index) {
	    if (node.parent == this) {
	      // same parent
	      var currentIndex = this.childs.indexOf(node);
	      if (currentIndex < index) {
	        // compensate the index for removal of the node itself
	        index++;
	      }
	    }

	    var beforeNode = this.childs[index] || this.append;
	    this.moveBefore(node, beforeNode);
	  };

	  /**
	   * Insert a new child before a given node
	   * Only applicable when Node value is of type array or object
	   * @param {Node} node
	   * @param {Node} beforeNode
	   */
	  Node.prototype.insertBefore = function(node, beforeNode) {
	    if (this._hasChilds()) {
	      if (beforeNode == this.append) {
	        // append to the child nodes

	        // adjust the link to the parent
	        node.setParent(this);
	        node.fieldEditable = (this.type.getType() == 'Dict');
	        this.childs.push(node);
	      }
	      else {
	        // insert before a child node
	        var index = this.childs.indexOf(beforeNode);
	        if (index == -1) {
	          throw new Error('Node not found');
	        }

	        // adjust the link to the parent
	        node.setParent(this);
	        node.fieldEditable = (this.type.getType() == 'Dict');
	        this.childs.splice(index, 0, node);
	      }

	      if (this.expanded) {
	        // insert into the DOM
	        var newTr = node.getDom();
	        var nextTr = beforeNode.getDom();
	        var table = nextTr ? nextTr.parentNode : undefined;
	        if (nextTr && table) {
	          table.insertBefore(newTr, nextTr);
	        }

	        node.showChilds();
	      }

	      this.updateDom({'updateIndexes': true});
	      node.updateDom({'recurse': true});
	    }
	  };

	  /**
	   * Insert a new child before a given node
	   * Only applicable when Node value is of type array or object
	   * @param {Node} node
	   * @param {Node} afterNode
	   */
	  Node.prototype.insertAfter = function(node, afterNode) {
	    if (this._hasChilds()) {
	      var index = this.childs.indexOf(afterNode);
	      var beforeNode = this.childs[index + 1];
	      if (beforeNode) {
	        this.insertBefore(node, beforeNode);
	      }
	      else {
	        this.appendChild(node);
	      }
	    }
	  };

	  /**
	   * Search in this node
	   * The node will be expanded when the text is found one of its childs, else
	   * it will be collapsed. Searches are case insensitive.
	   * @param {String} text
	   * @return {Node[]} results  Array with nodes containing the search text
	   */
	  Node.prototype.search = function(text) {
	    var results = [];
	    var index;
	    var search = text ? text.toLowerCase() : undefined;

	    // delete old search data
	    delete this.searchField;
	    delete this.searchValue;

	    // search in field
	    if (this.field != undefined) {
	      var field = String(this.field).toLowerCase();
	      index = field.indexOf(search);
	      if (index != -1) {
	        this.searchField = true;
	        results.push({
	          'node': this,
	          'elem': 'field'
	        });
	      }

	      // update dom
	      this._updateDomField();
	    }

	    // search in value
	    if (this._hasChilds()) {
	      // array, object

	      // search the nodes childs
	      if (this.childs) {
	        var childResults = [];
	        this.childs.forEach(function (child) {
	          childResults = childResults.concat(child.search(text));
	        });
	        results = results.concat(childResults);
	      }

	      // update dom
	      if (search != undefined) {
	        var recurse = false;
	        if (childResults.length == 0) {
	          this.collapse(recurse);
	        }
	        else {
	          this.expand(recurse);
	        }
	      }
	    }
	    else {
	      // string, auto
	      if (this.value != undefined ) {
	        var value = String(this.value).toLowerCase();
	        index = value.indexOf(search);
	        if (index != -1) {
	          this.searchValue = true;
	          results.push({
	            'node': this,
	            'elem': 'value'
	          });
	        }
	      }

	      // update dom
	      this._updateDomValue();
	    }

	    return results;
	  };

	  /**
	   * Move the scroll position such that this node is in the visible area.
	   * The node will not get the focus
	   * @param {function(boolean)} [callback]
	   */
	  Node.prototype.scrollTo = function(callback) {
	    if (!this.dom.tr || !this.dom.tr.parentNode) {
	      // if the node is not visible, expand its parents
	      var parent = this.parent;
	      var recurse = false;
	      while (parent) {
	        parent.expand(recurse);
	        parent = parent.parent;
	      }
	    }

	    if (this.dom.tr && this.dom.tr.parentNode) {
	      this.editor.scrollTo(this.dom.tr.offsetTop, callback);
	    }
	  };


	// stores the element name currently having the focus
	  Node.focusElement = undefined;

	  /**
	   * Set focus to this node
	   * @param {String} [elementName]  The field name of the element to get the
	   *                                focus available values: 'drag',
	   *                                'expand', 'field', 'value' (default)
	   */
	  Node.prototype.focus = function(elementName) {
	    Node.focusElement = elementName;

	    if (this.dom.tr && this.dom.tr.parentNode) {
	      var dom = this.dom;

	      switch (elementName) {
	        case 'drag':
	          if (dom.drag) {
	            dom.drag.focus();
	          }
	          break;

	        case 'expand':
	          if (this._hasChilds()) {
	            dom.expand.focus();
	          }
	          else if (dom.field && this.fieldEditable) {
	            dom.field.focus();
	            util.selectContentEditable(dom.field);
	          }
	          else if (dom.value && !this._hasChilds()) {
	            dom.value.focus();
	            util.selectContentEditable(dom.value);
	          }
	          else {
	            dom.drag.focus();
	          }
	          break;

	        case 'field':
	          if (dom.field && this.fieldEditable) {
	            dom.field.focus();
	            util.selectContentEditable(dom.field);
	          }
	          else if (dom.value && !this._hasChilds()) {
	            dom.value.focus();
	            util.selectContentEditable(dom.value);
	          }
	          else if (this._hasChilds()) {
	            dom.expand.focus();
	          }
	          else {
	            dom.drag.focus();
	          }
	          break;

	        case 'value':
	        default:
	          if (dom.value && !this._hasChilds()) {
	            dom.value.focus();
	            util.selectContentEditable(dom.value);
	          }
	          else if (dom.field && this.fieldEditable) {
	            dom.field.focus();
	            util.selectContentEditable(dom.field);
	          }
	          else if (this._hasChilds()) {
	            dom.expand.focus();
	          }
	          else {
	            dom.drag.focus();
	          }
	          break;
	      }
	    }
	  };

	  /**
	   * Select all text in an editable div after a delay of 0 ms
	   * @param {Element} editableDiv
	   */
	  Node.select = function(editableDiv) {
	    setTimeout(function () {
	      util.selectContentEditable(editableDiv);
	    }, 0);
	  };

	  /**
	   * Update the values from the DOM field and value of this node
	   */
	  Node.prototype.blur = function() {
	    // retrieve the actual field and value from the DOM.
	    this._getDomValue(false);
	    this._getDomField(false);
	  };

	  /**
	   * Duplicate given child node
	   * new structure will be added right before the cloned node
	   * @param {Node} node           the childNode to be duplicated
	   * @return {Node} clone         the clone of the node
	   * @private
	   */
	  Node.prototype._duplicate = function(node) {
	    var clone = node.clone();

	    /* TODO: adjust the field name (to prevent equal field names)
	     if (this.type == 'object') {
	     }
	     */

	    this.insertAfter(clone, node);

	    return clone;
	  };

	  /**
	   * Check if given node is a child. The method will check recursively to find
	   * this node.
	   * @param {Node} node
	   * @return {boolean} containsNode
	   */
	  Node.prototype.containsNode = function(node) {
	    if (this == node) {
	      return true;
	    }

	    var childs = this.childs;
	    if (childs) {
	      // TODO: use the js5 Array.some() here?
	      for (var i = 0, iMax = childs.length; i < iMax; i++) {
	        if (childs[i].containsNode(node)) {
	          return true;
	        }
	      }
	    }

	    return false;
	  };

	  /**
	   * Move given node into this node
	   * @param {Node} node           the childNode to be moved
	   * @param {Node} beforeNode     node will be inserted before given
	   *                                         node. If no beforeNode is given,
	   *                                         the node is appended at the end
	   * @private
	   */
	  Node.prototype._move = function(node, beforeNode) {
	    if (node == beforeNode) {
	      // nothing to do...
	      return;
	    }

	    // check if this node is not a child of the node to be moved here
	    if (node.containsNode(this)) {
	      throw new Error('Cannot move a field into a child of itself');
	    }

	    // remove the original node
	    if (node.parent) {
	      node.parent.removeChild(node);
	    }

	    // create a clone of the node
	    var clone = node.clone();
	    node.clearDom();

	    // insert or append the node
	    if (beforeNode) {
	      this.insertBefore(clone, beforeNode);
	    }
	    else {
	      this.appendChild(clone);
	    }

	    /* TODO: adjust the field name (to prevent equal field names)
	     if (this.type == 'object') {
	     }
	     */
	  };

	  /**
	   * Remove a child from the node.
	   * Only applicable when Node value is of type array or object
	   * @param {Node} node   The child node to be removed;
	   * @return {Node | undefined} node  The removed node on success,
	   *                                             else undefined
	   */
	  Node.prototype.removeChild = function(node) {
	    if (this.childs) {
	      var index = this.childs.indexOf(node);

	      if (index != -1) {
	        node.hide();

	        // delete old search results
	        delete node.searchField;
	        delete node.searchValue;

	        var removedNode = this.childs.splice(index, 1)[0];

	        this.updateDom({'updateIndexes': true});

	        return removedNode;
	      }
	    }

	    return undefined;
	  };

	  /**
	   * Remove a child node node from this node
	   * This method is equal to Node.removeChild, except that _remove firex an
	   * onChange event.
	   * @param {Node} node
	   * @private
	   */
	  Node.prototype._remove = function (node) {
	    this.removeChild(node);
	  };

	  /**
	   * Retrieve value from DOM
	   * @param {boolean} [silent]  If true (default), no errors will be thrown in
	   *                            case of invalid data
	   * @private
	   */
	  Node.prototype._getDomValue = function(silent) {
	    // avoid a bugged call to this when the dom is being hidden
	    if (this.hidding) {
	      return;
	    }

	    var valueInnerText, oldValue;

	    if (this.type.getType() === 'Choice' || this.type.getType() === 'Anything') {
	      var oldValue = this.value,
	          newValue = null,
	          option = this.dom.value.options[this.dom.value.selectedIndex].value;

	      if (this.type.getType() === 'Choice') {
	        for (var i = 0; i < this.type.getChildren().length; i++) {
	          if (this.type.getChildren()[i].getLabel() === option) break;
	        }
	        newValue = this.type.getChildren()[i].buildDefaultValue();
	      } else if (this.type.getType() === 'Anything') {
	        if (option !== 'Number' && option !== 'String' && option !== 'Boolean' && option !== 'Null' && option !== '[Anything]' && option !== '{Anything}') {
	          // it's a constructor name
	          newValue = this.editor.options.knownConstructors[option].buildDefaultValue();
	        } else {
	          var itemType = this.editor.options.type_trees.buildAnythingChildType(option, this.editor.options.knownConstructors);
	          newValue = itemType.buildDefaultValue();
	        }
	      } 

	      var table = this.dom.tr ? this.dom.tr.parentNode : undefined;
	      var lastTr;
	      if (this.expanded) {
	        lastTr = this.getAppend();
	      }
	      else {
	        lastTr = this.getDom();
	      }
	      var nextTr = (lastTr && lastTr.parentNode) ? lastTr.nextSibling : undefined;
	      this.hidding = true;
	      this.hide();
	      this.hidding = false;
	      this.clearDom();
	      this.childs.forEach(function (child, index) {
	          child.clearDom();
	        });

	      this.setValue(newValue, this.type);
	      this.editor._onAction('editValue', {
	        'node': this,
	        'oldValue': oldValue,
	        'newValue': newValue,
	        'oldSelection': this.editor.selection,
	        'newSelection': this.editor.getSelection()
	      });


	      if (table) {
	        if (nextTr) {
	          table.insertBefore(this.getDom(), nextTr);
	        }
	        else {
	          table.appendChild(this.getDom());
	        }
	      }
	      this.showChilds();
	      
	      this.updateDom({recurse: true});
	    }

	    if (this.dom.value && this.type.getType() != 'List' && this.type.getType() != 'Dict' && this.type.getType() != 'Choice' && this.type.getType() != 'Anything') {
	      var valueInnerText = util.getInnerText(this.dom.value);
	    }

	    if (valueInnerText != undefined) {
	      try {
	        // retrieve the value
	        var value;
	        if (this.type.getType() == 'String') {
	          value = this._unescapeHTML(valueInnerText);
	        }
	        else {
	          var str = this._unescapeHTML(valueInnerText);
	          value = this._stringCast(str);
	        }
	        if (value !== this.value) {
	          oldValue = this.value;
	          this.value = value;
	          this.editor._onAction('editValue', {
	            'node': this,
	            'oldValue': oldValue,
	            'newValue': value,
	            'oldSelection': this.editor.selection,
	            'newSelection': this.editor.getSelection()
	          });
	        }
	      }
	      catch (err) {
	        this.value = undefined;
	        // TODO: sent an action with the new, invalid value?
	        if (silent != true) {
	          throw err;
	        }
	      }
	    }
	  };

	  /**
	   * Update dom value:
	   * - the text color of the value, depending on the type of the value
	   * - the height of the field, depending on the width
	   * - background color in case it is empty
	   * @private
	   */
	  Node.prototype._updateDomValue = function () {
	    var domValue = this.dom.value;
	    if (domValue) {
	      // set text color depending on value type
	      // TODO: put colors in css
	      var v = this.value;
	      var t = this.type.getType();
	      var isUrl = (t == 'String' && util.isUrl(v));
	      var color = '';
	      if (isUrl && !this.editable.value) { // TODO: when to apply this?
	        color = '';
	      }
	      else if (t == 'String') {
	        color = 'green';
	      }
	      else if (t == 'Number') {
	        color = 'red';
	      }
	      else if (t == 'Boolean') {
	        color = 'darkorange';
	      }
	      else if (this._hasChilds()) {
	        color = '';
	      }
	      else if (v === null) {
	        color = '#004ED0';  // blue
	      }
	      else {
	        // invalid value
	        color = 'black';
	      }
	      domValue.style.color = color;

	      // make background color light-gray when empty
	      var isEmpty = (String(this.value) == '' && this.type.getType() != 'List' && this.type.getType() != 'Dict' && this.type.getType() != 'Constructor' && this.type.getType() != 'Anything');
	      if (isEmpty) {
	        util.addClassName(domValue, 'empty');
	      }
	      else {
	        util.removeClassName(domValue, 'empty');
	      }

	      // underline url
	      if (isUrl) {
	        util.addClassName(domValue, 'url');
	      }
	      else {
	        util.removeClassName(domValue, 'url');
	      }

	      // update title
	      if (t == 'List' || t == 'Dict') {
	        var count = this.childs ? this.childs.length : 0;
	        domValue.title = this.type.getType() + ' containing ' + count + ' items';
	      }
	      else if (t == 'string' && util.isUrl(v)) {
	        if (this.editable.value) {
	          domValue.title = 'Ctrl+Click or Ctrl+Enter to open url in new window';
	        }
	      }
	      else {
	        domValue.title = '';
	      }

	      // highlight when there is a search result
	      if (this.searchValueActive) {
	        util.addClassName(domValue, 'highlight-active');
	      }
	      else {
	        util.removeClassName(domValue, 'highlight-active');
	      }
	      if (this.searchValue) {
	        util.addClassName(domValue, 'highlight');
	      }
	      else {
	        util.removeClassName(domValue, 'highlight');
	      }

	      // strip formatting from the contents of the editable div
	      if (t != 'Choice' && t != 'Anything') {
	        util.stripFormatting(domValue);
	      }
	    }
	  };

	  /**
	   * Update dom field:
	   * - the text color of the field, depending on the text
	   * - the height of the field, depending on the width
	   * - background color in case it is empty
	   * @private
	   */
	  Node.prototype._updateDomField = function () {
	    var domField = this.dom.field;
	    if (domField) {
	      // make backgound color lightgray when empty
	      var isEmpty = (String(this.field) == '' && this.parent.type.getType() != 'List');
	      if (isEmpty) {
	        util.addClassName(domField, 'empty');
	      }
	      else {
	        util.removeClassName(domField, 'empty');
	      }

	      // highlight when there is a search result
	      if (this.searchFieldActive) {
	        util.addClassName(domField, 'highlight-active');
	      }
	      else {
	        util.removeClassName(domField, 'highlight-active');
	      }
	      if (this.searchField) {
	        util.addClassName(domField, 'highlight');
	      }
	      else {
	        util.removeClassName(domField, 'highlight');
	      }

	      // strip formatting from the contents of the editable div
	      util.stripFormatting(domField);
	    }
	  };

	  /**
	   * Retrieve field from DOM
	   * @param {boolean} [silent]  If true (default), no errors will be thrown in
	   *                            case of invalid data
	   * @private
	   */
	  Node.prototype._getDomField = function(silent) {
	    if (this.dom.field && this.fieldEditable) {
	      this.fieldInnerText = util.getInnerText(this.dom.field);
	    }
	    if (this.fieldInnerText != undefined) {
	      try {
	        var field = this._unescapeHTML(this.fieldInnerText);

	        if (field !== this.field) {
	          var oldField = this.field;
	          this.field = field;
	          this.editor._onAction('editField', {
	            'node': this,
	            'oldValue': oldField,
	            'newValue': field,
	            'oldSelection': this.editor.selection,
	            'newSelection': this.editor.getSelection()
	          });
	        }
	      }
	      catch (err) {
	        this.field = undefined;
	        // TODO: sent an action here, with the new, invalid value?
	        if (silent != true) {
	          throw err;
	        }
	      }
	    }
	  };

	  /**
	   * Clear the dom of the node
	   */
	  Node.prototype.clearDom = function() {
	    // TODO: hide the node first?
	    //this.hide();
	    // TODO: recursively clear dom?

	    this.dom = {};
	  };

	  /**
	   * Get the HTML DOM TR element of the node.
	   * The dom will be generated when not yet created
	   * @return {Element} tr    HTML DOM TR Element
	   */
	  Node.prototype.getDom = function() {
	    var dom = this.dom;
	    if (dom.tr) {
	      return dom.tr;
	    }

	    this._updateEditability();

	    // create row
	    dom.tr = document.createElement('tr');
	    dom.tr.node = this;

	    if (this.editor.options.mode === 'tree') { // note: we take here the global setting
	      var tdDrag = document.createElement('td');
	      if (this.editable.field) {
	        // create draggable area
	        if (this._isRemovable()) {  
	          // Note that only removable items are draggable. So we reuse this
	          // check
	          var domDrag = document.createElement('button');
	          dom.drag = domDrag;
	          domDrag.className = 'dragarea';
	          domDrag.title = 'Drag to move this element';
	          tdDrag.appendChild(domDrag);
	        }
	      }
	      dom.tr.appendChild(tdDrag);

	    }

	    // create tree and field
	    var tdField = document.createElement('td');
	    dom.tr.appendChild(tdField);
	    dom.tree = this._createDomTree();
	    tdField.appendChild(dom.tree);

	    this.updateDom({'updateIndexes': true});

	    return dom.tr;
	  };

	  /**
	   * DragStart event, fired on mousedown on the dragarea at the left side of a Node
	   * @param {Event} event
	   * @private
	   */
	  Node.prototype._onDragStart = function (event) {
	    var node = this;
	    if (!this.mousemove) {
	      this.mousemove = util.addEventListener(document, 'mousemove',
	          function (event) {
	            node._onDrag(event);
	          });
	    }

	    if (!this.mouseup) {
	      this.mouseup = util.addEventListener(document, 'mouseup',
	          function (event ) {
	            node._onDragEnd(event);
	          });
	    }

	    this.editor.highlighter.lock();
	    this.drag = {
	      'oldCursor': document.body.style.cursor,
	      'startParent': this.parent,
	      'startIndex': this.parent.childs.indexOf(this),
	      'mouseX': event.pageX,
	      'level': this.getLevel()
	    };
	    document.body.style.cursor = 'move';

	    event.preventDefault();
	  };

	  /**
	   * Drag event, fired when moving the mouse while dragging a Node
	   * @param {Event} event
	   * @private
	   */
	  Node.prototype._onDrag = function (event) {
	    // TODO: this method has grown too large. Split it in a number of methods
	    var mouseY = event.pageY;
	    var mouseX = event.pageX;

	    var trThis, trPrev, trNext, trFirst, trLast, trRoot;
	    var nodePrev, nodeNext;
	    var topThis, topPrev, topFirst, heightThis, bottomNext, heightNext;
	    var moved = false;

	    // TODO: add an ESC option, which resets to the original position

	    // move up/down
	    trThis = this.dom.tr;
	    topThis = util.getAbsoluteTop(trThis);
	    heightThis = trThis.offsetHeight;
	    if (mouseY < topThis) {
	      // move up
	      trPrev = trThis;
	      do {
	        trPrev = trPrev.previousSibling;
	        nodePrev = Node.getNodeFromTarget(trPrev);
	        topPrev = trPrev ? util.getAbsoluteTop(trPrev) : 0;
	      }
	      while (trPrev && mouseY < topPrev);

	      if (nodePrev && !nodePrev.parent) {
	        nodePrev = undefined;
	      }

	      if (!nodePrev) {
	        // move to the first node
	        trRoot = trThis.parentNode.firstChild;
	        trPrev = trRoot ? trRoot.nextSibling : undefined;
	        nodePrev = Node.getNodeFromTarget(trPrev);
	        if (nodePrev == this) {
	          nodePrev = undefined;
	        }
	      }

	      if (nodePrev) {
	        // check if mouseY is really inside the found node
	        trPrev = nodePrev.dom.tr;
	        topPrev = trPrev ? util.getAbsoluteTop(trPrev) : 0;
	        if (mouseY > topPrev + heightThis) {
	          nodePrev = undefined;
	        }
	      }

	      if (nodePrev && nodePrev.parent === this.parent) {
	        nodePrev.parent.moveBefore(this, nodePrev);
	        moved = true;
	      }
	    }
	    else {
	      // move down
	      trLast = (this.expanded && this.append) ? this.append.getDom() : this.dom.tr;
	      trFirst = trLast ? trLast.nextSibling : undefined;
	      if (trFirst) {
	        topFirst = util.getAbsoluteTop(trFirst);
	        trNext = trFirst;
	        do {
	          nodeNext = Node.getNodeFromTarget(trNext);
	          if (trNext) {
	            bottomNext = trNext.nextSibling ?
	                util.getAbsoluteTop(trNext.nextSibling) : 0;
	            heightNext = trNext ? (bottomNext - topFirst) : 0;

	            if (nodeNext.parent.childs.length == 1 && nodeNext.parent.childs[0] == this) {
	              // We are about to remove the last child of this parent,
	              // which will make the parents appendNode visible.
	              topThis += 24 - 1;
	              // TODO: dangerous to suppose the height of the appendNode a constant of 24-1 px.
	            }
	          }

	          trNext = trNext.nextSibling;
	        }
	        while (trNext && mouseY > topThis + heightNext);

	        if (nodeNext && nodeNext.parent) {
	          // calculate the desired level
	          var diffX = (mouseX - this.drag.mouseX);
	          var diffLevel = Math.round(diffX / 24 / 2);
	          var level = this.drag.level + diffLevel; // desired level
	          var levelNext = nodeNext.getLevel();     // level to be

	          // find the best fitting level (move upwards over the append nodes)
	          trPrev = nodeNext.dom.tr.previousSibling;
	          while (levelNext < level && trPrev) {
	            nodePrev = Node.getNodeFromTarget(trPrev);
	            if (nodePrev == this || nodePrev._isChildOf(this)) {
	              // neglect itself and its childs
	            }
	            else if (nodePrev instanceof AppendNode) {
	              var childs = nodePrev.parent.childs;
	              if (childs.length > 1 ||
	                  (childs.length == 1 && childs[0] != this)) {
	                // non-visible append node of a list of childs
	                // consisting of not only this node (else the
	                // append node will change into a visible "empty"
	                // text when removing this node).
	                nodeNext = Node.getNodeFromTarget(trPrev);
	                levelNext = nodeNext.getLevel();
	              }
	              else {
	                break;
	              }
	            }
	            else {
	              break;
	            }

	            trPrev = trPrev.previousSibling;
	          }

	          // move the node when its position is changed
	          if (trLast.nextSibling != nodeNext.dom.tr && nodeNext.parent === this.parent) {
	            nodeNext.parent.moveBefore(this, nodeNext);
	            moved = true;
	          }
	        }
	      }
	    }

	    if (moved) {
	      // update the dragging parameters when moved
	      this.drag.mouseX = mouseX;
	      this.drag.level = this.getLevel();
	    }

	    // auto scroll when hovering around the top of the editor
	    this.editor.startAutoScroll(mouseY);

	    event.preventDefault();
	  };

	  /**
	   * Drag event, fired on mouseup after having dragged a node
	   * @param {Event} event
	   * @private
	   */
	  Node.prototype._onDragEnd = function (event) {
	    var params = {
	      'node': this,
	      'startParent': this.drag.startParent,
	      'startIndex': this.drag.startIndex,
	      'endParent': this.parent,
	      'endIndex': this.parent.childs.indexOf(this)
	    };
	    if ((params.startParent != params.endParent) ||
	        (params.startIndex != params.endIndex)) {
	      // only register this action if the node is actually moved to another place
	      this.editor._onAction('moveNode', params);
	    }

	    document.body.style.cursor = this.drag.oldCursor;
	    this.editor.highlighter.unlock();
	    delete this.drag;

	    if (this.mousemove) {
	      util.removeEventListener(document, 'mousemove', this.mousemove);
	      delete this.mousemove;}
	    if (this.mouseup) {
	      util.removeEventListener(document, 'mouseup', this.mouseup);
	      delete this.mouseup;
	    }

	    // Stop any running auto scroll
	    this.editor.stopAutoScroll();

	    event.preventDefault();
	  };

	  /**
	   * Test if this node is a child of an other node
	   * @param {Node} node
	   * @return {boolean} isChild
	   * @private
	   */
	  Node.prototype._isChildOf = function (node) {
	    var n = this.parent;
	    while (n) {
	      if (n == node) {
	        return true;
	      }
	      n = n.parent;
	    }

	    return false;
	  };

	  /**
	   * Create an editable field
	   * @return {Element} domField
	   * @private
	   */
	  Node.prototype._createDomField = function () {
	    return document.createElement('div');
	  };

	  /**
	   * Set highlighting for this node and all its childs.
	   * Only applied to the currently visible (expanded childs)
	   * @param {boolean} highlight
	   */
	  Node.prototype.setHighlight = function (highlight) {
	    if (this.dom.tr) {
	      this.dom.tr.className = (highlight ? 'highlight' : '');

	      if (this.append) {
	        this.append.setHighlight(highlight);
	      }

	      if (this.childs) {
	        this.childs.forEach(function (child) {
	          child.setHighlight(highlight);
	        });
	      }
	    }
	  };

	  /**
	   * Update the value of the node. Only primitive types are allowed, no Object
	   * or Array is allowed.
	   * @param {String | Number | Boolean | null} value
	   */
	  Node.prototype.updateValue = function (value) {
	    this.value = value;
	    this.updateDom();
	  };

	  /**
	   * Update the field of the node.
	   * @param {String} field
	   */
	  Node.prototype.updateField = function (field) {
	    this.field = field;
	    this.updateDom();
	  };

	  /**
	   * Update the HTML DOM, optionally recursing through the childs
	   * @param {Object} [options] Available parameters:
	   *                          {boolean} [recurse]         If true, the
	   *                          DOM of the childs will be updated recursively.
	   *                          False by default.
	   *                          {boolean} [updateIndexes]   If true, the childs
	   *                          indexes of the node will be updated too. False by
	   *                          default.
	   */
	  Node.prototype.updateDom = function (options) {
	    // update level indentation
	    var domTree = this.dom.tree;
	    if (domTree) {
	      domTree.style.marginLeft = this.getLevel() * 24 + 'px';
	    }

	    // update field
	    var domField = this.dom.field;
	    if (domField) {
	      if (this.fieldEditable) {
	        // parent is an object
	        domField.contentEditable = this.editable.field;
	        domField.spellcheck = false;
	        domField.className = 'field';
	      }
	      else {
	        // parent is an array this is the root node
	        domField.className = 'readonly';
	      }

	      var field;
	      if (this.index != undefined) {
	        field = this.index;
	      }
	      else if (this.field != undefined) {
	        field = this.field;
	      }
	      else if (this._hasChilds()) {
	        field = this.type.getType();
	      }
	      else {
	        field = '';
	      }
	      domField.innerHTML = this._escapeHTML(field);
	    }

	    // update value
	    var childText, domValue = this.dom.value;
	    if (domValue) {
	      var count = this.childs ? this.childs.length : 0;
	      if (this.type.getType() == 'List') {
	        if (this.isAimaraReadOnly) {
	          childText = this.type.getChildren()[0].getType();
	          if (childText === 'Constructor') {
	            childText = this.type.getChildren()[0].getLabel();
	          }
	          domValue.innerHTML = '[' + childText + ']';
	        } else {
	          domValue.innerHTML = '[' + count + ']';
	        }
	      }
	      else if (this.type.getType() == 'Dict') {
	        if (this.isAimaraReadOnly) {
	          childText = this.type.getChildren()[0].getType();
	          if (childText === 'Constructor') {
	            childText = this.type.getChildren()[0].getLabel();
	          }
	          domValue.innerHTML = '{' + childText + '}';
	        } else {
	          domValue.innerHTML = '{' + count + '}';
	        }
	      }
	      else if (this.type.getType() == 'Constructor') {
	        domValue.innerHTML = this.type.getLabel() + '(...)';
	      }
	      else if (this.type.getType() == 'Choice') {
	        domValue.innerHTML = '';
	        var valueLabel = this.value?this.value.getLabel():'';
	        for (var i = 0; i < this.type.getChildren().length; i++) {
	          var option = document.createElement('option');
	          option.innerHTML = this.type.getChildren()[i].getLabel();
	          option.setAttribute('value', this.type.getChildren()[i].getLabel());
	          domValue.appendChild(option);
	        }
	        domValue.value = valueLabel;
	        if (!this.editable.value) {
	            domValue.setAttribute('disabled', true);
	        }
	      }
	      else if (this.type.getType() == 'Anything') {
	        domValue.innerHTML = '';
	        function addOption(optionName) {
	          var option = document.createElement('option');
	          option.innerHTML = optionName;
	          option.setAttribute('value', optionName);
	          domValue.appendChild(option);
	        }
	        addOption('Null');
	        addOption('Number');
	        addOption('String');
	        addOption('Boolean');
	        addOption('[Anything]');
	        addOption('{Anything}');
	        for (var constructorName in this.editor.options.knownConstructors) {
	          addOption(constructorName);
	        }

	        var valueType = this.editor.options.type_trees.classifyAnything(this.value);
	        if (valueType === 'Constructor') {
	          var valueType = this.value?this.value.getLabel():'';
	        }
	        domValue.value = valueType;
	        if (!this.editable.value) {
	          domValue.setAttribute('disabled', true);
	        }
	      }
	      else {
	        domValue.innerHTML = this._escapeHTML(this.value);
	      }
	    }

	    // update field and value
	    this._updateDomField();
	    this._updateDomValue();

	    // update childs indexes
	    if (options && options.updateIndexes == true) {
	      // updateIndexes is true or undefined
	      this._updateDomIndexes();
	    }

	    if (options && options.recurse == true) {
	      // recurse is true or undefined. update childs recursively
	      if (this.childs) {
	        this.childs.forEach(function (child) {
	          child.updateDom(options);
	        });
	      }
	    }

	    // update row with append button
	    if (this.append) {
	      this.append.updateDom();
	    }
	  };

	  /**
	   * Update the DOM of the childs of a node: update indexes and undefined field
	   * names.
	   * Only applicable when structure is an array or object
	   * @private
	   */
	  Node.prototype._updateDomIndexes = function () {
	    var domValue = this.dom.value;
	    var childs = this.childs;
	    if (domValue && childs) {
	      if (this.type.getType() == 'List') {
	        childs.forEach(function (child, index) {
	          child.index = index;
	          var childField = child.dom.field;
	          if (childField) {
	            childField.innerHTML = index;
	          }
	        });
	      }
	      else if (this.type.getType() == 'Dict') {
	        childs.forEach(function (child) {
	          if (child.index != undefined) {
	            delete child.index;

	            if (child.field == undefined) {
	              child.field = '';
	            }
	          }
	        });
	      }
	    }
	  };

	  /**
	   * Create an editable value
	   * @private
	   */
	  Node.prototype._createDomValue = function () {
	    var domValue;

	    if (this.type.getType() == 'List') {
	      domValue = document.createElement('div');
	      domValue.className = 'readonly';
	      domValue.innerHTML = '[...]';
	    }
	    else if (this.type.getType() == 'Dict') {
	      domValue = document.createElement('div');
	      domValue.className = 'readonly';
	      domValue.innerHTML = '{...}';
	    }
	    else if (this.type.getType() == 'Constructor') {
	      domValue = document.createElement('div');
	      domValue.className = 'readonly';
	      domValue.innerHTML = '(...)';
	    }
	    else if (this.type.getType() == 'Choice') {
	      domValue = document.createElement('select');
	    }
	    else if (this.type.getType() == 'Anything') {
	      domValue = document.createElement('select');
	    }
	    else {
	      // create an editable or read-only div
	      domValue = document.createElement('div');
	      domValue.contentEditable = this.editable.value;
	      domValue.spellcheck = false;
	      domValue.className = 'value';
	      domValue.innerHTML = this._escapeHTML(this.value);
	    }

	    return domValue;
	  };

	  /**
	   * Create an expand/collapse button
	   * @return {Element} expand
	   * @private
	   */
	  Node.prototype._createDomExpandButton = function () {
	    // create expand button
	    var expand = document.createElement('button');
	    if (this._hasChilds()) {
	      expand.className = this.expanded ? 'expanded' : 'collapsed';
	      expand.title =
	          'Click to expand/collapse this field (Ctrl+E). \n' +
	          'Ctrl+Click to expand/collapse including all childs.';
	    }
	    else {
	      expand.className = 'invisible';
	      expand.title = '';
	    }

	    return expand;
	  };


	  /**
	   * Create a DOM tree element, containing the expand/collapse button
	   * @return {Element} domTree
	   * @private
	   */
	  Node.prototype._createDomTree = function () {
	    var dom = this.dom;
	    var domTree = document.createElement('table');
	    var tbody = document.createElement('tbody');
	    domTree.style.borderCollapse = 'collapse'; // TODO: put in css
	    domTree.className = 'values';
	    domTree.appendChild(tbody);
	    var tr = document.createElement('tr');
	    tbody.appendChild(tr);

	    // create expand button
	    var tdExpand = document.createElement('td');
	    tdExpand.className = 'tree';
	    tr.appendChild(tdExpand);
	    dom.expand = this._createDomExpandButton();
	    tdExpand.appendChild(dom.expand);
	    dom.tdExpand = tdExpand;

	    // create the field
	    var tdField = document.createElement('td');
	    tdField.className = 'tree';
	    tr.appendChild(tdField);
	    dom.field = this._createDomField();
	    tdField.appendChild(dom.field);
	    dom.tdField = tdField;

	    // create a separator
	    var tdSeparator = document.createElement('td');
	    tdSeparator.className = 'tree';
	    tr.appendChild(tdSeparator);
	    if (this.type.getType() != 'Dict' && this.type.getType() != 'List' && this.type.getType() != 'Constructor') {
	      tdSeparator.appendChild(document.createTextNode(':'));
	      tdSeparator.className = 'separator';
	    }
	    dom.tdSeparator = tdSeparator;

	    // create the value
	    var tdValue = document.createElement('td');
	    tdValue.className = 'tree';
	    tr.appendChild(tdValue);
	    dom.value = this._createDomValue();
	    tdValue.appendChild(dom.value);
	    dom.tdValue = tdValue;

	    // create the remove button
	    if (this._isRemovable()) {
	      var tdValue = document.createElement('td');
	      tdValue.className = 'tree';
	      var button = document.createElement('button');
	      dom.removeButton = button;
	      button.className = 'remove'
	      tr.appendChild(tdValue);
	      tdValue.appendChild(button);
	    }

	    return domTree;
	  };

	  /**
	   * Handle an event. The event is catched centrally by the editor
	   * @param {Event} event
	   */
	  Node.prototype.onEvent = function (event) {
	    var type = event.type,
	        target = event.target || event.srcElement,
	        dom = this.dom,
	        node = this,
	        focusNode,
	        expandable = this._hasChilds();

	    // check if mouse is on dragarea.
	    // If so, highlight current row and its childs
	    if (target == dom.drag) {
	      if (type == 'mouseover') {
	        this.editor.highlighter.highlight(this);
	      }
	      else if (type == 'mouseout') {
	        this.editor.highlighter.unhighlight();
	      }
	    }

	    // drag events
	    if (type == 'mousedown' && target == dom.drag) {
	      this._onDragStart(event);
	    }

	    // expand events
	    if (type == 'click' && target == dom.expand) {
	      if (expandable) {
	        var recurse = event.ctrlKey; // with ctrl-key, expand/collapse all
	        this._onExpand(recurse);
	      }
	    }

	    // remove events
	    if (type == 'click' && target === dom.removeButton) {
	      this._onRemove();
	    }

	    // value events
	    var domValue = dom.value;
	    if (target == domValue) {
	      //noinspection FallthroughInSwitchStatementJS
	      switch (type) {
	        case 'focus':
	          focusNode = this;
	          break;

	        case 'blur':
	        case 'change':
	          this._getDomValue(true);
	          this._updateDomValue();
	          if (this.value && this.type.getType() === "String") {
	            domValue.innerHTML = this._escapeHTML(this.value);
	          }
	          break;

	        case 'input':
	          this._getDomValue(true);
	          this._updateDomValue();
	          break;

	        case 'keydown':
	        case 'mousedown':
	          this.editor.selection = this.editor.getSelection();
	          break;

	        case 'click':
	          if (event.ctrlKey || !this.editable.value) {
	            if (util.isUrl(this.value)) {
	              window.open(this.value, '_blank');
	            }
	          }
	          break;

	        case 'keyup':
	          this._getDomValue(true);
	          this._updateDomValue();
	          break;

	        case 'cut':
	        case 'paste':
	          setTimeout(function () {
	            node._getDomValue(true);
	            node._updateDomValue();
	          }, 1);
	          break;
	      }
	    }

	    // field events
	    var domField = dom.field;
	    if (target == domField) {
	      switch (type) {
	        case 'focus':
	          focusNode = this;
	          break;

	        case 'blur':
	        case 'change':
	          this._getDomField(true);
	          this._updateDomField();
	          if (this.field) {
	            domField.innerHTML = this._escapeHTML(this.field);
	          }
	          break;

	        case 'input':
	          this._getDomField(true);
	          this._updateDomField();
	          break;

	        case 'keydown':
	        case 'mousedown':
	          this.editor.selection = this.editor.getSelection();
	          break;

	        case 'keyup':
	          this._getDomField(true);
	          this._updateDomField();
	          break;

	        case 'cut':
	        case 'paste':
	          setTimeout(function () {
	            node._getDomField(true);
	            node._updateDomField();
	          }, 1);
	          break;
	      }
	    }

	    // focus
	    // when clicked in whitespace left or right from the field or value, set focus
	    var domTree = dom.tree;
	    if (target == domTree.parentNode) {
	      switch (type) {
	        case 'click':
	          var left = (event.offsetX != undefined) ?
	              (event.offsetX < (this.getLevel() + 1) * 24) :
	              (event.pageX < util.getAbsoluteLeft(dom.tdSeparator));// for FF
	          if (left || expandable) {
	            // node is expandable when it is an object or array
	            if (domField) {
	              util.setEndOfContentEditable(domField);
	              domField.focus();
	            }
	          }
	          else {
	            if (domValue) {
	              util.setEndOfContentEditable(domValue);
	              domValue.focus();
	            }
	          }
	          break;
	      }
	    }
	    if ((target == dom.tdExpand && !expandable) || target == dom.tdField ||
	        target == dom.tdSeparator) {
	      switch (type) {
	        case 'click':
	          if (domField) {
	            util.setEndOfContentEditable(domField);
	            domField.focus();
	          }
	          break;
	      }
	    }

	    if (type == 'keydown') {
	      this.onKeyDown(event);
	    }
	  };

	  /**
	   * Key down event handler
	   * @param {Event} event
	   */
	  Node.prototype.onKeyDown = function (event) {
	    var keynum = event.which || event.keyCode;
	    var target = event.target || event.srcElement;
	    var ctrlKey = event.ctrlKey;
	    var shiftKey = event.shiftKey;
	    var altKey = event.altKey;
	    var handled = false;
	    var prevNode, nextNode, nextDom, nextDom2;
	    var editable = this.editor.options.mode === 'tree';

	    // util.log(ctrlKey, keynum, event.charCode); // TODO: cleanup
	    if (keynum == 13) { // Enter
	      if (target == this.dom.value) {
	        if (!this.editable.value || event.ctrlKey) {
	          if (util.isUrl(this.value)) {
	            window.open(this.value, '_blank');
	            handled = true;
	          }
	        }
	      }
	      else if (target == this.dom.expand) {
	        var expandable = this._hasChilds();
	        if (expandable) {
	          var recurse = event.ctrlKey; // with ctrl-key, expand/collapse all
	          this._onExpand(recurse);
	          target.focus();
	          handled = true;
	        }
	      }
	    }
	    else if (keynum == 68) {  // D
	      if (ctrlKey && editable) {   // Ctrl+D
	        this._onDuplicate();
	        handled = true;
	      }
	    }
	    else if (keynum == 69) { // E
	      if (ctrlKey) {       // Ctrl+E and Ctrl+Shift+E
	        this._onExpand(shiftKey);  // recurse = shiftKey
	        target.focus(); // TODO: should restore focus in case of recursing expand (which takes DOM offline)
	        handled = true;
	      }
	    }
	    else if (keynum == 46 && editable) { // Del
	      if (ctrlKey) {       // Ctrl+Del
	        this._onRemove();
	        handled = true;
	      }
	    }
	    else if (keynum == 45 && editable) { // Ins
	      if (ctrlKey && !shiftKey) {       // Ctrl+Ins
	        this._onInsertBefore();
	        handled = true;
	      }
	      else if (ctrlKey && shiftKey) {   // Ctrl+Shift+Ins
	        this._onInsertAfter();
	        handled = true;
	      }
	    }
	    else if (keynum == 35) { // End
	      if (altKey) { // Alt+End
	        // find the last node
	        var lastNode = this._lastNode();
	        if (lastNode) {
	          lastNode.focus(Node.focusElement || this._getElementName(target));
	        }
	        handled = true;
	      }
	    }
	    else if (keynum == 36) { // Home
	      if (altKey) { // Alt+Home
	        // find the first node
	        var firstNode = this._firstNode();
	        if (firstNode) {
	          firstNode.focus(Node.focusElement || this._getElementName(target));
	        }
	        handled = true;
	      }
	    }
	    else if (keynum == 37) {        // Arrow Left
	      if (altKey && !shiftKey) {  // Alt + Arrow Left
	        // move to left element
	        var prevElement = this._previousElement(target);
	        if (prevElement) {
	          this.focus(this._getElementName(prevElement));
	        }
	        handled = true;
	      }
	      else if (altKey && shiftKey && editable) { // Alt + Shift Arrow left
	        if (this.expanded) {
	          var appendDom = this.getAppend();
	          nextDom = appendDom ? appendDom.nextSibling : undefined;
	        }
	        else {
	          var dom = this.getDom();
	          nextDom = dom.nextSibling;
	        }
	        if (nextDom) {
	          nextNode = Node.getNodeFromTarget(nextDom);
	          nextDom2 = nextDom.nextSibling;
	          nextNode2 = Node.getNodeFromTarget(nextDom2);
	          if (nextNode && nextNode instanceof AppendNode &&
	              !(this.parent.childs.length == 1) &&
	              nextNode2 && nextNode2.parent) {
	            nextNode2.parent.moveBefore(this, nextNode2);
	            this.focus(Node.focusElement || this._getElementName(target));
	          }
	        }
	      }
	    }
	    else if (keynum == 38) {        // Arrow Up
	      if (altKey && !shiftKey) {  // Alt + Arrow Up
	        // find the previous node
	        prevNode = this._previousNode();
	        if (prevNode) {
	          prevNode.focus(Node.focusElement || this._getElementName(target));
	        }
	        handled = true;
	      }
	      else if (altKey && shiftKey) { // Alt + Shift + Arrow Up
	        // find the previous node
	        prevNode = this._previousNode();
	        if (prevNode && prevNode.parent) {
	          prevNode.parent.moveBefore(this, prevNode);
	          this.focus(Node.focusElement || this._getElementName(target));
	        }
	        handled = true;
	      }
	    }
	    else if (keynum == 39) {        // Arrow Right
	      if (altKey && !shiftKey) {  // Alt + Arrow Right
	        // move to right element
	        var nextElement = this._nextElement(target);
	        if (nextElement) {
	          this.focus(this._getElementName(nextElement));
	        }
	        handled = true;
	      }
	      else if (altKey && shiftKey) { // Alt + Shift Arrow Right
	        dom = this.getDom();
	        var prevDom = dom.previousSibling;
	        if (prevDom) {
	          prevNode = Node.getNodeFromTarget(prevDom);
	          if (prevNode && prevNode.parent &&
	              (prevNode instanceof AppendNode)
	              && !prevNode.isVisible()) {
	            prevNode.parent.moveBefore(this, prevNode);
	            this.focus(Node.focusElement || this._getElementName(target));
	          }
	        }
	      }
	    }
	    else if (keynum == 40) {        // Arrow Down
	      if (altKey && !shiftKey) {  // Alt + Arrow Down
	        // find the next node
	        nextNode = this._nextNode();
	        if (nextNode) {
	          nextNode.focus(Node.focusElement || this._getElementName(target));
	        }
	        handled = true;
	      }
	      else if (altKey && shiftKey && editable) { // Alt + Shift + Arrow Down
	        // find the 2nd next node and move before that one
	        if (this.expanded) {
	          nextNode = this.append ? this.append._nextNode() : undefined;
	        }
	        else {
	          nextNode = this._nextNode();
	        }
	        nextDom = nextNode ? nextNode.getDom() : undefined;
	        if (this.parent.childs.length == 1) {
	          nextDom2 = nextDom;
	        }
	        else {
	          nextDom2 = nextDom ? nextDom.nextSibling : undefined;
	        }
	        var nextNode2 = Node.getNodeFromTarget(nextDom2);
	        if (nextNode2 && nextNode2.parent) {
	          nextNode2.parent.moveBefore(this, nextNode2);
	          this.focus(Node.focusElement || this._getElementName(target));
	        }
	        handled = true;
	      }
	    }

	    if (handled) {
	      event.preventDefault();
	      event.stopPropagation();
	    }
	  };

	  /**
	   * Handle the expand event, when clicked on the expand button
	   * @param {boolean} recurse   If true, child nodes will be expanded too
	   * @private
	   */
	  Node.prototype._onExpand = function (recurse) {
	    if (recurse) {
	      // Take the table offline
	      var table = this.dom.tr.parentNode; // TODO: not nice to access the main table like this
	      var frame = table.parentNode;
	      var scrollTop = frame.scrollTop;
	      frame.removeChild(table);
	    }

	    if (this.expanded) {
	      this.collapse(recurse);
	    }
	    else {
	      this.expand(recurse);
	    }

	    if (recurse) {
	      // Put the table online again
	      frame.appendChild(table);
	      frame.scrollTop = scrollTop;
	    }
	  };

	  /**
	   * Remove this node
	   * @private
	   */
	  Node.prototype._onRemove = function() {
	    this.editor.highlighter.unhighlight();
	    var childs = this.parent.childs;
	    var index = childs.indexOf(this);

	    // adjust the focus
	    var oldSelection = this.editor.getSelection();
	    if (childs[index + 1]) {
	      childs[index + 1].focus();
	    }
	    else if (childs[index - 1]) {
	      childs[index - 1].focus();
	    }
	    else {
	      this.parent.focus();
	    }
	    var newSelection = this.editor.getSelection();

	    // remove the node
	    this.parent._remove(this);

	    // store history action
	    this.editor._onAction('removeNode', {
	      node: this,
	      parent: this.parent,
	      index: index,
	      oldSelection: oldSelection,
	      newSelection: newSelection
	    });
	  };

	  /**
	   * Duplicate this node
	   * @private
	   */
	  Node.prototype._onDuplicate = function() {
	    var oldSelection = this.editor.getSelection();
	    var clone = this.parent._duplicate(this);
	    clone.focus();
	    var newSelection = this.editor.getSelection();

	    this.editor._onAction('duplicateNode', {
	      node: this,
	      clone: clone,
	      parent: this.parent,
	      oldSelection: oldSelection,
	      newSelection: newSelection
	    });
	  };

	  /**
	   * Handle insert before event
	   * @param {String} [field]
	   * @param {*} [value]
	   * @param {Type} [type]
	   * @private
	   */
	  Node.prototype._onInsertBefore = function (field, value, type) {
	    var oldSelection = this.editor.getSelection();

	    var newNode = new Node(this.editor, {
	      field: (field != undefined) ? field : '',
	      value: (value != undefined) ? value : '',
	      type: type
	    });
	    newNode.expand(true);
	    this.parent.insertBefore(newNode, this);
	    this.editor.highlighter.unhighlight();
	    newNode.focus('field');
	    var newSelection = this.editor.getSelection();

	    this.editor._onAction('insertBeforeNode', {
	      node: newNode,
	      beforeNode: this,
	      parent: this.parent,
	      oldSelection: oldSelection,
	      newSelection: newSelection
	    });
	  };

	  /**
	   * Handle insert after event
	   * @param {String} [field]
	   * @param {*} [value]
	   * @param {Type} [type]
	   * @private
	   */
	  Node.prototype._onInsertAfter = function (field, value, type) {
	    var oldSelection = this.editor.getSelection();

	    var newNode = new Node(this.editor, {
	      field: (field != undefined) ? field : '',
	      value: (value != undefined) ? value : '',
	      type: type
	    });
	    newNode.expand(true);
	    this.parent.insertAfter(newNode, this);
	    this.editor.highlighter.unhighlight();
	    newNode.focus('field');
	    var newSelection = this.editor.getSelection();

	    this.editor._onAction('insertAfterNode', {
	      node: newNode,
	      afterNode: this,
	      parent: this.parent,
	      oldSelection: oldSelection,
	      newSelection: newSelection
	    });
	  };

	  /**
	   * Handle append event
	   * @param {String} [field]
	   * @param {*} [value]
	   * @param {Type} [type]
	   * @private
	   */
	  Node.prototype._onAppend = function (field, value, type) {
	    var oldSelection = this.editor.getSelection();

	    var newNode = new Node(this.editor, {
	      field: (field != undefined) ? field : '',
	      value: (value != undefined) ? value : '',
	      type: type
	    });
	    newNode.expand(true);
	    this.parent.appendChild(newNode);
	    this.editor.highlighter.unhighlight();
	    newNode.focus('field');
	    var newSelection = this.editor.getSelection();

	    this.editor._onAction('appendNode', {
	      node: newNode,
	      parent: this.parent,
	      oldSelection: oldSelection,
	      newSelection: newSelection
	    });
	  };

	  /**
	   * Create a table row with an append button.
	   * @return {HTMLElement | undefined} buttonAppend or undefined when inapplicable
	   */
	  Node.prototype.getAppend = function () {
	    if (!this.append) {
	      this.append = new AppendNode(this.editor);
	      this.append.setParent(this);
	    }
	    return this.append.getDom();
	  };

	  /**
	   * Find the node from an event target
	   * @param {Node} target
	   * @return {Node | undefined} node  or undefined when not found
	   * @static
	   */
	  Node.getNodeFromTarget = function (target) {
	    while (target) {
	      if (target.node) {
	        return target.node;
	      }
	      target = target.parentNode;
	    }

	    return undefined;
	  };

	  /**
	   * Get the previously rendered node
	   * @return {Node | null} previousNode
	   * @private
	   */
	  Node.prototype._previousNode = function () {
	    var prevNode = null;
	    var dom = this.getDom();
	    if (dom && dom.parentNode) {
	      // find the previous field
	      var prevDom = dom;
	      do {
	        prevDom = prevDom.previousSibling;
	        prevNode = Node.getNodeFromTarget(prevDom);
	      }
	      while (prevDom && (prevNode instanceof AppendNode && !prevNode.isVisible()));
	    }
	    return prevNode;
	  };

	  /**
	   * Get the next rendered node
	   * @return {Node | null} nextNode
	   * @private
	   */
	  Node.prototype._nextNode = function () {
	    var nextNode = null;
	    var dom = this.getDom();
	    if (dom && dom.parentNode) {
	      // find the previous field
	      var nextDom = dom;
	      do {
	        nextDom = nextDom.nextSibling;
	        nextNode = Node.getNodeFromTarget(nextDom);
	      }
	      while (nextDom && (nextNode instanceof AppendNode && !nextNode.isVisible()));
	    }

	    return nextNode;
	  };

	  /**
	   * Get the first rendered node
	   * @return {Node | null} firstNode
	   * @private
	   */
	  Node.prototype._firstNode = function () {
	    var firstNode = null;
	    var dom = this.getDom();
	    if (dom && dom.parentNode) {
	      var firstDom = dom.parentNode.firstChild;
	      firstNode = Node.getNodeFromTarget(firstDom);
	    }

	    return firstNode;
	  };

	  /**
	   * Get the last rendered node
	   * @return {Node | null} lastNode
	   * @private
	   */
	  Node.prototype._lastNode = function () {
	    var lastNode = null;
	    var dom = this.getDom();
	    if (dom && dom.parentNode) {
	      var lastDom = dom.parentNode.lastChild;
	      lastNode =  Node.getNodeFromTarget(lastDom);
	      while (lastDom && (lastNode instanceof AppendNode && !lastNode.isVisible())) {
	        lastDom = lastDom.previousSibling;
	        lastNode =  Node.getNodeFromTarget(lastDom);
	      }
	    }
	    return lastNode;
	  };

	  /**
	   * Get the next element which can have focus.
	   * @param {Element} elem
	   * @return {Element | null} nextElem
	   * @private
	   */
	  Node.prototype._previousElement = function (elem) {
	    var dom = this.dom;
	    // noinspection FallthroughInSwitchStatementJS
	    switch (elem) {
	      case dom.value:
	        if (this.fieldEditable) {
	          return dom.field;
	        }
	      // intentional fall through
	      case dom.field:
	        if (this._hasChilds()) {
	          return dom.expand;
	        }
	      // intentional fall through
	      case dom.expand:
	        if (dom.drag) {
	          return dom.drag;
	        }
	      // intentional fall through
	      default:
	        return null;
	    }
	  };

	  /**
	   * Get the next element which can have focus.
	   * @param {Element} elem
	   * @return {Element | null} nextElem
	   * @private
	   */
	  Node.prototype._nextElement = function (elem) {
	    var dom = this.dom;
	    // noinspection FallthroughInSwitchStatementJS
	    switch (elem) {
	      case dom.drag:
	        if (this._hasChilds()) {
	          return dom.expand;
	        }
	      // intentional fall through
	      case dom.expand:
	        if (this.fieldEditable) {
	          return dom.field;
	        }
	      // intentional fall through
	      case dom.field:
	        if (!this._hasChilds()) {
	          return dom.value;
	        }
	      default:
	        return null;
	    }
	  };

	  /**
	   * Get the dom name of given element. returns null if not found.
	   * For example when element == dom.field, "field" is returned.
	   * @param {Element} element
	   * @return {String | null} elementName  Available elements with name: 'drag',
	   *                                      'expand', 'field', 'value'
	   * @private
	   */
	  Node.prototype._getElementName = function (element) {
	    var dom = this.dom;
	    for (var name in dom) {
	      if (dom.hasOwnProperty(name)) {
	        if (dom[name] == element) {
	          return name;
	        }
	      }
	    }
	    return null;
	  };

	  /**
	   * Test if this node has childs. This is the case when the node is an object
	   * or array.
	   * @return {boolean} hasChilds
	   * @private
	   */
	  Node.prototype._hasChilds = function () {
	    if (this.isAimaraReadOnly) {
	      // for aimara read onlys, hide any kind of child nodes
	      return false;
	    }

	    if (this.type.getType() === 'Choice') {
	      for (var i = 0; i < this.type.getChildren().length; i++) {
	        if (this.type.getChildren()[i].getChildren().length > 0) return true;
	      }
	      return false;

	      // FIXME: only if THE CURRENT VALUE has children
	      /*
	      for (var i = 0; i < this.type.getChildren().length; i++)
	        if (this.type.getChildren()[i].getLabel() === this.value.getLabel()) {
	          return this.type.getChildren()[i].getChildren().length > 0;
	        }
	      return false;
	      */
	    } else if (this.type.getType() === 'Anything') {
	      // anything type allways has a fake child for the value of the chosen type
	      return true;
	    } else {
	      return this.type.getChildren().length > 0;
	    }
	  };

	  /**
	   * True for nodes that can be removed by user (list or dictionary elements)
	   * @return {boolean} is removable
	   * @private
	   */
	  Node.prototype._isRemovable = function () {
	    if (this.parent) {
	      var ptype = this.parent.type.getType();
	      return this.editable.value && (ptype === "List") || (ptype === "Dict");
	    }
	    return false
	  };

	  /**
	   * cast contents of a string to the correct type. This can be a string,
	   * a number, a boolean, etc
	   * @param {String} str
	   * @return {*} castedStr
	   * @private
	   */
	  Node.prototype._stringCast = function(str) {
	    var lower = str.toLowerCase(),
	        num = Number(str),          // will nicely fail with '123ab'
	        numFloat = parseFloat(str); // will nicely fail with '  '

	    if (str == '') {
	      return '';
	    }
	    else if (lower == 'null') {
	      return null;
	    }
	    else if (lower == 'true') {
	      return true;
	    }
	    else if (lower == 'false') {
	      return false;
	    }
	    else if (!isNaN(num) && !isNaN(numFloat)) {
	      return num;
	    }
	    else {
	      return str;
	    }
	  };

	  /**
	   * escape a text, such that it can be displayed safely in an HTML element
	   * @param {String} text
	   * @return {String} escapedText
	   * @private
	   */
	  Node.prototype._escapeHTML = function (text) {
	    var htmlEscaped = String(text)
	        .replace(/</g, '&lt;')
	        .replace(/>/g, '&gt;')
	        .replace(/  /g, ' &nbsp;') // replace double space with an nbsp and space
	        .replace(/^ /, '&nbsp;')   // space at start
	        .replace(/ $/, '&nbsp;');  // space at end

	    var json = JSON.stringify(htmlEscaped);
	    return json.substring(1, json.length - 1);
	  };

	  /**
	   * unescape a string.
	   * @param {String} escapedText
	   * @return {String} text
	   * @private
	   */
	  Node.prototype._unescapeHTML = function (escapedText) {
	    var json = '"' + this._escapeJSON(escapedText) + '"';
	    var htmlEscaped = util.parse(json);
	    return htmlEscaped
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&nbsp;|\u00A0/g, ' ');
	  };

	  /**
	   * escape a text to make it a valid JSON string. The method will:
	   *   - replace unescaped double quotes with '\"'
	   *   - replace unescaped backslash with '\\'
	   *   - replace returns with '\n'
	   * @param {String} text
	   * @return {String} escapedText
	   * @private
	   */
	  Node.prototype._escapeJSON = function (text) {
	    // TODO: replace with some smart regex (only when a new solution is faster!)
	    var escaped = '';
	    var i = 0, iMax = text.length;
	    while (i < iMax) {
	      var c = text.charAt(i);
	      if (c == '\n') {
	        escaped += '\\n';
	      }
	      else if (c == '\\') {
	        escaped += c;
	        i++;

	        c = text.charAt(i);
	        if ('"\\/bfnrtu'.indexOf(c) == -1) {
	          escaped += '\\';  // no valid escape character
	        }
	        escaped += c;
	      }
	      else if (c == '"') {
	        escaped += '\\"';
	      }
	      else {
	        escaped += c;
	      }
	      i++;
	    }

	    return escaped;
	  };

	  // TODO: find a nicer solution to resolve this circular dependency between Node and AppendNode
	  var AppendNode = appendNodeFactory(Node);

	  return Node;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (util) {

	  /**
	   * A factory function to create an AppendNode, which depends on a Node
	   * @param {Node} Node
	   */
	  function appendNodeFactory(Node) {
	    /**
	     * @constructor AppendNode
	     * @extends Node
	     * @param {TreeEditor} editor
	     * Create a new AppendNode. This is a special node which is created at the
	     * end of the list with childs for an object or array
	     */
	    function AppendNode (editor) {
	      /** @type {TreeEditor} */
	      this.editor = editor;
	      this.dom = {};
	    }

	    AppendNode.prototype = new Node();

	    /**
	     * Return a table row with an append button.
	     * @return {Element} dom   TR element
	     */
	    AppendNode.prototype.getDom = function () {
	      // TODO: implement a new solution for the append node
	      var dom = this.dom;

	      if (dom.tr) {
	        return dom.tr;
	      }

	      this._updateEditability();

	      // a row for the append button
	      var trAppend = document.createElement('tr');
	      trAppend.node = this;
	      dom.tr = trAppend;

	      // TODO: consistent naming

	      if (this.editable.field) {
	        // a cell for the dragarea column
	        dom.tdDrag = document.createElement('td');

	      }

	      // a cell for the contents (showing text 'empty')
	      var tdAppend = document.createElement('td');
	      tdAppend.className = 'appenditem';
	      var domText = document.createElement('div');
	      domText.innerHTML = '(empty)';
	      domText.className = 'readonly';
	      var icon = document.createElement('div');
	      icon.className = 'icon';
	      tdAppend.appendChild(icon);
	      tdAppend.appendChild(domText);
	      dom.td = tdAppend;
	      dom.text = domText;

	      this.updateDom();

	      return trAppend;
	    };

	    /**
	     * Update the HTML dom of the Node
	     */
	    AppendNode.prototype.updateDom = function () {
	      var dom = this.dom;
	      var tdAppend = dom.td;
	      if (tdAppend) {
	        tdAppend.style.paddingLeft = (this.getLevel() * 24 + 26) + 'px';
	        // TODO: not so nice hard coded offset
	      }

	      var domText = dom.text;
	      if (domText) {
	        domText.innerHTML = 'Extend ' + this.parent.type.getType();
	      }

	      // attach or detach the contents of the append node:
	      // hide when the parent has childs, show when the parent has no childs
	      var trAppend = dom.tr;
	      if (!this.isVisible()) {
	        if (dom.tr.firstChild) {
	          if (dom.tdDrag) {
	            trAppend.removeChild(dom.tdDrag);
	          }
	          trAppend.removeChild(tdAppend);
	        }
	      }
	      else {
	        if (!dom.tr.firstChild) {
	          if (dom.tdDrag) {
	            trAppend.appendChild(dom.tdDrag);
	          }
	          trAppend.appendChild(tdAppend);
	        }
	      }
	    };

	    /**
	     * Check whether the AppendNode is currently visible.
	     * the AppendNode is visible when its parent has no childs (i.e. is empty).
	     * @return {boolean} isVisible
	     */
	    AppendNode.prototype.isVisible = function () {
	      return this.editable.value &&
	             (this.parent.type.getType() == 'List' || this.parent.type.getType() == 'Dict');
	    };

	    /**
	     * Handle an event. The event is catched centrally by the editor
	     * @param {Event} event
	     */
	    AppendNode.prototype.onEvent = function (event) {
	      var etype = event.type;
	      var target = event.target || event.srcElement;
	      var dom = this.dom;

	      if (etype == 'click') {
	        var type = this.parent.type.getChildren()[0];
	        var value = type.buildDefaultValue();
	        this._onAppend('', value, type);
	      } else  if (etype == 'keydown') {
	        this.onKeyDown(event);
	      }
	    };

	    return AppendNode;
	  }

	  // return the factory function
	  return appendNodeFactory;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});
