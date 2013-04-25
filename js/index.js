var __render__, __template__, __templates__,
  __hasProp = {}.hasOwnProperty,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

Object.forEach = function(object, fn) {
  var key, value, _results;

  _results = [];
  for (key in object) {
    if (!__hasProp.call(object, key)) continue;
    value = object[key];
    _results.push(fn.call(object, key, value));
  }
  return _results;
};

Object.merge = function(to, from) {
  var key, value, _results;

  _results = [];
  for (key in from) {
    value = from[key];
    _results.push(to[key] = value);
  }
  return _results;
};

Object.defineProperties(Object.prototype, {
  toFormData: {
    value: function() {
      var key, ret, value;

      ret = new FormData();
      for (key in this) {
        if (!__hasProp.call(this, key)) continue;
        value = this[key];
        ret.append(key, value);
      }
      return ret;
    }
  },
  toQueryString: {
    value: function() {
      var key, value;

      return ((function() {
        var _results;

        _results = [];
        for (key in this) {
          if (!__hasProp.call(this, key)) continue;
          value = this[key];
          _results.push("" + key + "=" + (value.toString()));
        }
        return _results;
      }).call(this)).join("&");
    }
  }
});

Object.pluck = function(object, prop) {
  var key, value, _results;

  _results = [];
  for (key in object) {
    if (!__hasProp.call(object, key)) continue;
    value = object[key];
    _results.push(value[prop]);
  }
  return _results;
};

Object.each = function(object, fn) {
  var key, value, _results;

  _results = [];
  for (key in object) {
    if (!__hasProp.call(object, key)) continue;
    value = object[key];
    _results.push(fn.call(object, key, value));
  }
  return _results;
};

Array.prototype.compact = function() {
  return this.filter(function(item) {
    return !!item;
  });
};

(function() {
  return window.__for__ = function(base, method) {
    var i, item, key, value, _i, _len, _results, _results1;

    if (!base) {
      return;
    }
    if (base instanceof Selector) {
      base = base.getAll();
    }
    if (base instanceof Array || base.length || base.hasOwnProperty('length')) {
      _results = [];
      for (i = _i = 0, _len = base.length; _i < _len; i = ++_i) {
        item = base[i];
        if (item) {
          _results.push(method.call(item, i));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else if (base instanceof Object) {
      _results1 = [];
      for (key in base) {
        if (!__hasProp.call(base, key)) continue;
        value = base[key];
        _results1.push(method.call({
          key: key,
          value: value
        }));
      }
      return _results1;
    }
  };
})();

Function.prototype.get = function(obj) {
  var _this = this;

  return Object.forEach(obj, function(key, value) {
    if (!_this.prototype.__lookupSetter__(key)) {
      _this.prototype.__defineSetter__(key, function(val) {
        return this["__" + key] = val;
      });
    }
    return _this.prototype.__defineGetter__(key, function() {
      return value.call(this, this["__" + key]);
    });
  });
};

Function.prototype.set = function(obj) {
  var _this = this;

  return Object.forEach(obj, function(key, value) {
    _this.prototype.__defineSetter__(key, function(val) {
      return this["__" + key] = value.call(this, val);
    });
    if (!_this.prototype.__lookupGetter__(key)) {
      return _this.prototype.__defineGetter__(key, function() {
        return this["__" + key];
      });
    }
  });
};

Function.prototype.prop = function(key, val) {
  this.prototype.__defineSetter__(key, function(value) {
    return this["__" + key] = value;
  });
  return this.prototype.__defineGetter__(key, function() {
    return this["__" + key] || val;
  });
};

Function.prototype.accessor = function(obj) {
  var key, value, _results;

  _results = [];
  for (key in obj) {
    value = obj[key];
    this.prototype.__defineSetter__(key, value);
    _results.push(this.prototype.__defineGetter__(key, value));
  }
  return _results;
};

Function.prototype.mixin = function(obj) {
  var desc, key, pprop, _i, _len, _ref;

  if (obj.prototype) {
    obj = obj.prototype;
  }
  _ref = Object.getOwnPropertyNames(obj);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc) {
      Object.defineProperty(this.prototype, key, desc);
    } else {
      this.prototype[key] = obj[key];
    }
  }
  if (pprop = Object.getPrototypeOf(obj)) {
    if (pprop !== Object.prototype) {
      return this.mixin(pprop);
    }
  }
};

(function() {
  var Attributes, prefixes, _parseName;

  Attributes = {
    title: {
      prefix: "!",
      unique: true
    },
    name: {
      prefix: "&",
      unique: true
    },
    type: {
      prefix: "%",
      unique: true
    },
    id: {
      prefix: "#",
      unique: true
    },
    "class": {
      prefix: "\\.",
      unique: false
    },
    role: {
      prefix: "~",
      unique: true
    }
  };
  prefixes = Object.pluck(Attributes, 'prefix').concat("$").join("|");
  Object.each(Attributes, function(key, value) {
    return value.regexp = new RegExp(value.prefix + ("(.*?)(?=" + prefixes + ")"), "g");
  });
  _parseName = function(name, atts) {
    var ret;

    if (atts == null) {
      atts = {};
    }
    ret = {
      tag: name.match(new RegExp("^.*?(?=" + prefixes + ")"))[0] || 'div',
      attributes: atts
    };
    Object.each(Attributes, function(key, value) {
      var m, map;

      if ((m = name.match(value.regexp)) !== null) {
        name = name.replace(value.regexp, "");
        if (value.unique) {
          if (atts[key]) {
            if (atts[key] !== null && atts[key] !== void 0) {
              return ret.attributes[key] = atts[key];
            }
          } else {
            return ret.attributes[key] = m.pop().slice(1);
          }
        } else {
          map = m.map(function(item) {
            return item.slice(1);
          });
          if (atts[key]) {
            if (typeof atts[key] === 'string') {
              map = map.concat(atts[key].split(" "));
            } else {
              map = map.concat(atts[key]);
            }
          }
          return ret.attributes[key] = map.compact().join(" ");
        }
      } else {
        if (atts[key] !== null && atts[key] !== void 0) {
          return ret.attributes[key] = atts[key];
        }
      }
    });
    return ret;
  };
  return window.__element__ = function(node, atts, text, els) {
    var attributes, el, key, tag, value, _i, _len, _ref;

    switch (typeof node) {
      case 'string':
        _ref = _parseName(node, atts), tag = _ref.tag, attributes = _ref.attributes;
        node = document.createElement(tag.trim().replace(/[^A-Za-z_\-0-9]/, ''));
        for (key in attributes) {
          value = attributes[key];
          if (!(value instanceof Function)) {
            node.setAttribute(key, value);
          }
        }
        if (text) {
          node.textContent = text;
        }
        break;
      default:
        node = document.createElement('div');
    }
    for (_i = 0, _len = els.length; _i < _len; _i++) {
      el = els[_i];
      node.appendChild(el);
    }
    return node;
  };
})();

(function() {
  var classList, match, matches;

  matches = null;
  classList = (function() {
    function classList(sel) {
      this.sel = sel;
    }

    classList.prototype.toggle = function(name) {
      var el, _i, _len, _ref, _results;

      _ref = this.sel.getAll();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.classList.toggle(name));
      }
      return _results;
    };

    classList.prototype.add = function(name) {
      var el, _i, _len, _ref, _results;

      _ref = this.sel.getAll();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.classList.add(name));
      }
      return _results;
    };

    classList.prototype.remove = function(name) {
      var el, _i, _len, _ref, _results;

      _ref = this.sel.getAll();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.classList.remove(name));
      }
      return _results;
    };

    return classList;

  })();
  window.Selector = (function() {
    Selector.warp = function(name) {
      return function(value) {
        var item, ret, _i, _j, _len, _len1, _ref, _ref1, _results;

        if (value !== void 0) {
          _ref = this.getAll();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(item[name] = value);
          }
          return _results;
        } else {
          ret = [];
          _ref1 = this.getAll();
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            ret.push(item[name]);
          }
          if (ret.length > 1) {
            return ret;
          } else {
            return ret[0];
          }
        }
      };
    };

    Selector.warpStyle = function(name) {
      return function(value) {
        var item, ret, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;

        if (value) {
          _ref = this.getAll();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(item.style[name] = value);
          }
          return _results;
        } else {
          _ref1 = this.getAll();
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            _results1.push(ret = item.style[name]);
          }
          return _results1;
        }
      };
    };

    Selector.get({
      "scope": function() {
        return this._scope || document;
      }
    });

    Selector.get({
      'classList': function() {
        if (!!this._classList) {
          return this._classList;
        }
        return this._classList = new classList(this);
      }
    });

    function Selector(selector, _scope) {
      this.selector = selector;
      this._scope = _scope;
      this.styles = {};
    }

    Selector.prototype.style = function(name) {
      var Accessor, ac;

      if (this.styles[name]) {
        return this.styles[name];
      }
      ac = Accessor = (function() {
        function Accessor() {}

        return Accessor;

      })();
      this.styles[name] = new ac;
      ac.accessor({
        value: Selector.warpStyle(name).bind(this)
      });
      return this.styles[name];
    };

    Selector.prototype.getAll = function() {
      return Array.prototype.slice.call(this.scope.querySelectorAll(this.selector));
    };

    Selector.prototype.querySelector = function(selector) {
      return this.scope.querySelector(selector);
    };

    Selector.prototype.appendChild = function(el) {
      var _ref;

      return (_ref = this.scope.querySelector(this.selector)) != null ? _ref.appendChild(el) : void 0;
    };

    Selector.prototype.getAttribute = function(name) {
      var el, _i, _len, _ref, _results;

      _ref = this.getAll();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(typeof el.getAttribute === "function" ? el.getAttribute(name) : void 0);
      }
      return _results;
    };

    Selector.prototype.setAttribute = function(name, value) {
      var el, _i, _len, _ref, _results;

      _ref = this.getAll();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(typeof el.setAttribute === "function" ? el.setAttribute(name, value) : void 0);
      }
      return _results;
    };

    Selector.prototype.addEventListener = function(type, fn) {
      var _this = this;

      return this.scope.addEventListener(type, function(e) {
        var n;

        if ((n = match(_this.selector, e.target))) {
          e.target = n;
          return fn.call(n, e);
        }
      }, true);
    };

    return Selector;

  })();
  match = function(selector, node) {
    if (matches == null) {
      matches = node.matchesSelector || node.mozMatchesSelector || node.webkitMatchesSelector || node.oMatchesSelector || node.msMatchesSelector;
    }
    if (node === document) {
      return;
    }
    if (matches.call(node, selector)) {
      return node;
    } else if (node.parentNode) {
      return match(selector, node.parentNode);
    } else {
      return false;
    }
  };
  return window.__selector__ = function(s, sc) {
    return new Selector(s, sc);
  };
})();

(function() {
  return window.__json__ = function(arg) {
    if (arg instanceof Object) {
      return JSON.stringify(arg);
    } else {
      return JSON.parse(arg);
    }
  };
})();

(function() {
  var Request, Response;

  Response = Response = (function() {
    function Response(headers, body, status) {
      this.headers = headers;
      this.raw = body;
      this.status = status;
    }

    Response.prototype.isScript = function() {
      return this.headers['Content-Type'] === 'text/javascript';
    };

    Response.prototype.isHtml = function() {
      return this.headers['Content-Type'] === 'text/html';
    };

    Response.prototype.isXML = function() {
      return this.headers['Content-Type'] === 'text/xml';
    };

    Response.prototype.isJSON = function() {
      var contentType;

      contentType = this.headers['Content-Type'];
      return contentType === 'text/json' || contentType === 'application/json';
    };

    Response.get('body', function() {
      var df, div, e, node, p, _i, _len, _ref;

      switch (this.headers['Content-Type']) {
        case "text/html":
          div = document.createElement('div');
          div.innerHTML = this.raw;
          df = document.createDocumentFragment();
          _ref = Array.prototype.slice.call(div.childNodes);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            df.appendChild(node);
          }
          return df;
        case "text/json":
        case "application/json":
          try {
            return JSON.parse(this.raw);
          } catch (_error) {
            e = _error;
            return this.raw;
          }
          break;
        case "text/xml":
          p = new DOMParser();
          return p.parseFromString(this.raw, "text/xml");
        default:
          return this.raw;
      }
    });

    return Response;

  })();
  Request = Request = (function() {
    function Request(url, headers) {
      if (headers == null) {
        headers = {};
      }
      this.handleStateChange = __bind(this.handleStateChange, this);
      this.uri = url;
      this.headers = headers;
      this._request = new XMLHttpRequest();
      this._request.onreadystatechange = this.handleStateChange;
    }

    Request.prototype.request = function() {
      var args, callback, data, key, method, value, _ref;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (method == null) {
        method = 'GET';
      }
      args = args.compact();
      if (args.length === 2) {
        data = args[0], callback = args[1];
      }
      if (args.length === 1) {
        callback = args[0];
      }
      if ((this._request.readyState === 4) || (this._request.readyState === 0)) {
        if (method.toUpperCase() === 'GET' && data !== void 0 && data !== null) {
          this._request.open(method, this.uri + "?" + data.toQueryString());
        } else {
          this._request.open(method, this.uri);
        }
        _ref = this.headers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this._request.setRequestHeader(key.toString(), value.toString());
        }
        this._request.setRequestHeader('Content-Type', 'application/json');
        this._callback = callback;
        if (typeof data !== 'string') {
          data = data != null ? data.toFormData() : void 0;
        }
        return this._request.send(data);
      }
    };

    Request.prototype.parseResponseHeaders = function() {
      var r;

      r = {};
      this._request.getAllResponseHeaders().split(/\n/).compact().forEach(function(header) {
        var key, value, _ref;

        _ref = header.split(/:\s/), key = _ref[0], value = _ref[1];
        return r[key.trim()] = value.trim();
      });
      return r;
    };

    Request.prototype.handleStateChange = function() {
      var body, headers, status;

      if (this._request.readyState === 4) {
        headers = this.parseResponseHeaders();
        body = this._request.response;
        status = this._request.status;
        this._callback.call(new Response(headers, body, status));
        return this._request.responseText;
      }
    };

    Request.prototype.get = function(data, callback) {
      return this.request('GET', data, callback);
    };

    Request.prototype.post = function(data, callback) {
      return this.request('POST', data, callback);
    };

    Request.prototype.put = function(data, callback) {
      return this.request('PUT', data, callback);
    };

    Request.prototype["delete"] = function(data, callback) {
      return this.request('DELETE', data, callback);
    };

    Request.prototype.patch = function(data, callback) {
      return this.request('PATCH', data, callback);
    };

    return Request;

  })();
  return window.__request__ = function() {
    var args, r, url;

    url = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    r = new Request(url);
    return r.request.apply(r, args);
  };
})();

__templates__ = {};

__template__ = function(name, els) {
  var el, _i, _len, _results;

  __templates__[name] = "";
  _results = [];
  for (_i = 0, _len = els.length; _i < _len; _i++) {
    el = els[_i];
    _results.push(__templates__[name] += el.outerHTML);
  }
  return _results;
};

__render__ = function(name, data) {
  var child, df, el, key, temp, value, x, _i, _len, _ref;

  el = document.createElement('div');
  temp = __templates__[name];
  for (key in data) {
    value = data[key];
    temp = temp.replace(new RegExp("{{" + key + "}}", 'g'), value);
  }
  el.innerHTML = temp;
  df = document.createDocumentFragment();
  if (el.childNodes.length === 1) {
    x = el.firstElementChild;
    el.removeChild(x);
    return x;
  }
  _ref = Array.prototype.slice.call(el.childNodes);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    child = _ref[_i];
    df.appendChild(child);
  }
  return df;
};

(function() {
  var AttributeDescriptor;

  AttributeDescriptor = (function() {
    function AttributeDescriptor(el, name) {
      this.el = el;
      this.name = name;
    }

    AttributeDescriptor.get({
      value: function() {
        var val;

        val = this.el.getAttribute(this.name);
        if (val === 'true') {
          return true;
        }
        if (val === 'false') {
          return false;
        }
        if (val === void 0) {
          return "";
        }
        return val;
      }
    });

    AttributeDescriptor.set({
      value: function(value) {
        if (value === false) {
          value = 'false';
        }
        return this.el.setAttribute(this.name, value);
      }
    });

    return AttributeDescriptor;

  })();
  return window.__attribute__ = function(el, name) {
    var descriptor, _ref;

    if ((_ref = el.__attributes__) == null) {
      el.__attributes__ = [];
    }
    descriptor = el.__attributes__[name];
    if (descriptor == null) {
      descriptor = el.__attributes__[name] = new AttributeDescriptor(el, name);
    }
    return descriptor;
  };
})();

(function() {
  var CSSDescriptor;

  CSSDescriptor = (function() {
    function CSSDescriptor(el, name) {
      this.el = el;
      this.name = name;
    }

    CSSDescriptor.get({
      value: function() {
        if (this.currentStyle) {
          return this.el.currentStyle[this.name];
        } else {
          return window.getComputedStyle(this.el)[this.name];
        }
      }
    });

    CSSDescriptor.set({
      value: function(value) {
        return this.el.style[this.name] = value;
      }
    });

    return CSSDescriptor;

  })();
  return window.__css__ = function(el, name) {
    var descriptor, _ref;

    if ((_ref = el.__cssdescriptors__) == null) {
      el.__cssdescriptors__ = [];
    }
    descriptor = el.__cssdescriptors__[name];
    if (descriptor == null) {
      descriptor = el.__cssdescriptors__[name] = new CSSDescriptor(el, name);
    }
    return descriptor;
  };
})();
Selector.accessor({"textContent": Selector.warp('textContent'), "value": Selector.warp('value')})

var Input, Item, NumberInput, Spendy, load, numberInput, proto, toCurrency,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

proto = typeof Element !== "undefined" && Element !== null ? Element.prototype : void 0;

if (proto != null) {
  proto.qs = proto != null ? proto.querySelector : void 0;
}

proto = typeof Number !== "undefined" && Number !== null ? Number.prototype : void 0;

toCurrency = function() {
  var regexp, _ref;

  regexp = new RegExp("(\\d)(?=(\\d{3})+\\b)", "g");
  return (_ref = this.toFixed(0)) != null ? _ref.replace(regexp, "$1 ") : void 0;
};

if (proto != null) {
  proto.toCurrency = toCurrency;
}

numberInput = function(el) {
  var _this = this;

  return el.addEventListener('keypress', function(e) {
    var charCode, event;

    event = e;
    charCode = (event != null ? event.which : void 0) ? event != null ? event.which : void 0 : event != null ? event.keyCode : void 0;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return event != null ? event.preventDefault() : void 0;
    }
  }, true);
};

Input = (function() {
  Input.set({
    'value': function(value) {
      var _ref;

      return (_ref = this.input) != null ? _ref.value = value : void 0;
    }
  });

  Input.get({
    'value': function() {
      var _ref;

      return (_ref = this.input) != null ? _ref.value : void 0;
    }
  });

  function Input(input, ref) {
    var _this = this;

    this.input = input;
    this.ref = ref;
    this.input.addEventListener('change', function(e) {
      var event, _ref;

      event = e;
      return (_ref = _this.ref) != null ? _ref.set(_this.value) : void 0;
    }, true);
  }

  return Input;

})();

NumberInput = (function(_super) {
  __extends(NumberInput, _super);

  NumberInput.set({
    'value': function(value) {
      var _ref;

      return (_ref = this.input) != null ? _ref.value = parseInt(value) : void 0;
    }
  });

  NumberInput.get({
    'value': function() {
      var _ref;

      return parseInt((_ref = this.input) != null ? _ref.value : void 0);
    }
  });

  function NumberInput() {
    NumberInput.__super__.constructor.apply(this, arguments);
    numberInput(this.input);
  }

  return NumberInput;

})(Input);

Item = (function() {
  Item.set({
    'price': function(value) {
      var _ref;

      return (_ref = this.priceInput) != null ? _ref.value = value : void 0;
    }
  });

  Item.set({
    'name': function(value) {
      var _ref;

      return (_ref = this.nameInput) != null ? _ref.value = value : void 0;
    }
  });

  Item.get({
    'price': function() {
      var _ref;

      return (_ref = this.priceInput) != null ? _ref.value : void 0;
    }
  });

  function Item(ref, data) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
      _this = this;

    this.ref = ref;
    this.base = __render__('item');
    this.nameInput = new Input((_ref = this.base) != null ? _ref.qs("[name=name]") : void 0, (_ref1 = this.ref) != null ? _ref1.child("name") : void 0);
    this.priceInput = new NumberInput((_ref2 = this.base) != null ? _ref2.qs("[name=price]") : void 0, (_ref3 = this.ref) != null ? _ref3.child("price") : void 0);
    this.icon = (_ref4 = this.base) != null ? _ref4.qs("i") : void 0;
    this.icon.addEventListener('click', function(e) {
      var event, _ref5;

      event = e;
      return (_ref5 = _this.ref) != null ? _ref5.set(null) : void 0;
    }, true);
    this.icon.addEventListener('touchend', function(e) {
      var event, _ref5;

      event = e;
      return (_ref5 = _this.ref) != null ? _ref5.set(null) : void 0;
    }, true);
    if ((_ref5 = this.ref) != null) {
      _ref5.on("value", (_ref6 = this.update) != null ? _ref6.bind(this) : void 0);
    }
    Object.merge(this, data);
  }

  Item.prototype.update = function(snapshot) {
    return Object.merge(this, snapshot != null ? snapshot.val() : void 0);
  };

  return Item;

})();

Spendy = (function() {
  function Spendy(body, baseRef, auth) {
    var before, form, _ref, _ref1, _ref2;

    this.baseRef = baseRef;
    this.auth = auth;
    this.items = {};
    this.loading = body != null ? body.qs(".loading") : void 0;
    this.ul = body != null ? body.qs("ul") : void 0;
    form = body != null ? body.qs("form") : void 0;
    this.name = form != null ? form.qs("[name=name]") : void 0;
    this.price = form != null ? form.qs("[name=price]") : void 0;
    before = function(event) {
      var target;

      target = event != null ? event.target : void 0;
      if ((target != null ? target.tagName : void 0) !== "INPUT") {
        return event != null ? event.preventDefault() : void 0;
      }
    };
    this.iScroll = new IScroll("scroller", {
      onBeforeScrollStart: before
    });
    this.onValue = (_ref = this.onValue) != null ? _ref.bind(this) : void 0;
    this.onChildRemoved = (_ref1 = this.onChildRemoved) != null ? _ref1.bind(this) : void 0;
    this.onChildAdded = (_ref2 = this.onChildAdded) != null ? _ref2.bind(this) : void 0;
    numberInput(this.price);
  }

  Spendy.prototype.remove = function(el) {
    var _ref,
      _this = this;

    if (el != null) {
      if ((_ref = el.classList) != null) {
        _ref.add("remove");
      }
    }
    el.addEventListener('webkitAnimationEnd', function(e) {
      var event;

      event = e;
      el.parentNode.removeChild(el);
      return _this.overAllSpending();
    }, true);
    return el.addEventListener('animationend', function(e) {
      var event;

      event = e;
      el.parentNode.removeChild(el);
      return _this.overAllSpending();
    }, true);
  };

  Spendy.prototype.add = function() {
    var obj, ref, _ref, _ref1, _ref2, _ref3, _ref4;

    obj = {
      name: (_ref = this.name) != null ? _ref.value : void 0,
      price: parseInt((_ref1 = this.price) != null ? _ref1.value : void 0)
    };
    ref = (_ref2 = this.ref) != null ? _ref2.child(typeof Date !== "undefined" && Date !== null ? Date.now() : void 0) : void 0;
    if (ref != null) {
      ref.set(obj);
    }
    if ((_ref3 = this.price) != null) {
      _ref3.value = "";
    }
    return (_ref4 = this.name) != null ? _ref4.value = "" : void 0;
  };

  Spendy.prototype.logout = function() {
    var _ref, _ref1, _ref2, _ref3,
      _this = this;

    if ((_ref = this.auth) != null) {
      _ref.logout();
    }
    if ((_ref1 = this.ref) != null) {
      _ref1.off("value", this.onValue);
    }
    if ((_ref2 = this.ref) != null) {
      _ref2.off("child_removed", this.onChildRemoved);
    }
    if ((_ref3 = this.ref) != null) {
      _ref3.off("child_added", this.onChildAdded);
    }
    return setTimeout((function() {
      var items;

      items = _this.items;
      return __for__(_this.items, function() {
        var _ref4, _ref5;

        delete items[this.key];
        return (_ref4 = this.value) != null ? _ref4.base.parentNode.removeChild((_ref5 = this.value) != null ? _ref5.base : void 0) : void 0;
      });
    }), 1000);
  };

  Spendy.prototype.overAllSpending = function() {
    var children, spending, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

    spending = 0;
    __for__(this.items, function() {
      var _ref;

      return spending += (_ref = this.value) != null ? _ref.price : void 0;
    });
    if ((_ref = __selector__('strong')) != null) {
      _ref.textContent = spending != null ? spending.toCurrency() : void 0;
    }
    children = (_ref1 = this.ul) != null ? _ref1.childNodes : void 0;
    if ((children != null ? children.length : void 0) > 0) {
      return (_ref2 = this.ul) != null ? (_ref3 = _ref2.classList) != null ? _ref3.remove("empty") : void 0 : void 0;
    } else {
      return (_ref4 = this.ul) != null ? (_ref5 = _ref4.classList) != null ? _ref5.add("empty") : void 0 : void 0;
    }
  };

  Spendy.prototype.onValue = function() {
    var _ref, _ref1;

    if ((_ref = this.loading) != null) {
      if ((_ref1 = _ref.classList) != null) {
        _ref1.add("hide");
      }
    }
    return this.overAllSpending();
  };

  Spendy.prototype.onChildAdded = function(snap) {
    var item, _ref, _ref1;

    item = new Item(snap != null ? snap.ref() : void 0, snap != null ? snap.val() : void 0);
    this.items[snap != null ? snap.name() : void 0] = item;
    if ((_ref = this.ul) != null) {
      _ref.appendChild(item != null ? item.base : void 0);
    }
    if ((_ref1 = this.iScroll) != null) {
      _ref1.refresh();
    }
    return this.overAllSpending();
  };

  Spendy.prototype.onChildRemoved = function(snap) {
    var item, _ref;

    item = this.items[snap != null ? snap.name() : void 0];
    this.remove(item != null ? item.base : void 0);
    delete this.items[snap != null ? snap.name() : void 0];
    return (_ref = this.iScroll) != null ? _ref.refresh() : void 0;
  };

  Spendy.prototype.init = function(id) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
      _this = this;

    if ((_ref = this.price) != null) {
      _ref.value = "";
    }
    if ((_ref1 = this.name) != null) {
      _ref1.value = "";
    }
    if ((_ref2 = this.loading) != null) {
      if ((_ref3 = _ref2.classList) != null) {
        _ref3.remove("hide");
      }
    }
    if ((_ref4 = __selector__('#landing')) != null) {
      if ((_ref5 = _ref4.classList) != null) {
        _ref5.add("hide");
      }
    }
    if ((_ref6 = __selector__('#app')) != null) {
      if ((_ref7 = _ref6.classList) != null) {
        _ref7.remove("hide");
      }
    }
    return setTimeout((function() {
      var _ref10, _ref11, _ref8, _ref9;

      _this.ref = (_ref8 = _this.baseRef) != null ? _ref8.child(id) : void 0;
      if ((_ref9 = _this.ref) != null) {
        _ref9.on("child_removed", _this.onChildRemoved);
      }
      if ((_ref10 = _this.ref) != null) {
        _ref10.on("child_added", _this.onChildAdded);
      }
      return (_ref11 = _this.ref) != null ? _ref11.on("value", _this.onValue) : void 0;
    }), 1000);
  };

  return Spendy;

})();

__template__('item', [__element__("li", {}, "", [__element__("input&name", {}, "", []), __element__("input&price", {}, "", []), __element__("i.icon-remove", {}, "", [])])]);

__template__('layout', [
  __element__("article", {}, "", [
    __element__("section#landing.hide.hidden", {}, "", [
      __element__(".center", {}, "", [
        __element__("img", {
          "src": "images/icon.png",
          "width": "100px"
        }, "", []), __element__("h1", {}, "Spendy", []), __element__("input&email", {
          "placeholder": "E-Mail"
        }, "", []), __element__("input%password&password", {
          "placeholder": "Password"
        }, "", []), __element__(".row", {}, "", [__element__("a.persona-button#login", {}, "", [__element__("i.icon-user", {}, "", []), __element__("span", {}, "Sign in!", [])]), __element__("a.persona-button#register", {}, "", [__element__("i.icon-user", {}, "", []), __element__("span", {}, "Register!", [])])]), __element__("a.persona-button#try", {}, "Try!", [])
      ])
    ]), __element__("section#app.hidden", {}, "", [
      __element__("header", {}, "", [
        __element__(".brand", {}, "", [
          __element__("img", {
            "src": "images/icon.png",
            "width": "26px"
          }, "", []), __element__("h2", {}, "Spendy", [])
        ]), __element__("form", {}, "", [
          __element__("input&name", {
            "placeholder": "Name"
          }, "", []), __element__("input&price", {
            "placeholder": "Price"
          }, "", []), __element__("i.icon-signout", {}, "", []), __element__("i.icon-plus", {}, "", [])
        ])
      ]), __element__(".loading", {}, "", [__element__(".icon-spinner.icon-spin", {}, "", [])]), __element__("#scroller", {}, "", [__element__("ul", {}, "", [])]), __element__("footer", {}, "", [__element__("span", {}, "Total Spending:", []), __element__("strong", {}, "", [])])
    ])
  ])
]);

if (typeof window !== "undefined" && window !== null ? window.device : void 0) {
  document.addEventListener('deviceready', function(e) {
    var event;

    event = e;
    return load();
  }, true);
} else {
  window.addEventListener('load', function(e) {
    var event;

    event = e;
    return load();
  }, true);
}

load = function() {
  var auth, baseRef, body, handleAuth, login, register, spendy, _ref, _ref1, _ref2, _ref3,
    _this = this;

  body = typeof document !== "undefined" && document !== null ? document.body : void 0;
  if (body != null) {
    body.appendChild(__render__('layout'));
  }
  if ((_ref = new RegExp("iPhone|iPod|iPad", "i")) != null ? _ref.test(typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) : void 0) {
    if (body != null) {
      if ((_ref1 = body.classList) != null) {
        _ref1.add("ios");
      }
    }
  }
  if ((_ref2 = new RegExp("Android", "i")) != null ? _ref2.test(typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) : void 0) {
    if (body != null) {
      if ((_ref3 = body.classList) != null) {
        _ref3.add("android");
      }
    }
  }
  document.addEventListener('touchmove', function(e) {
    var event;

    event = e;
    return event != null ? event.preventDefault() : void 0;
  }, true);
  document.addEventListener('touchend', function(e) {
    var event, focused;

    event = e;
    focused = body != null ? body.qs("*:focus") : void 0;
    if (focused) {
      return focused != null ? focused.blur() : void 0;
    }
  }, true);
  baseRef = new Firebase("https://spendy.firebaseio.com/");
  handleAuth = function(err, user) {
    var _ref10, _ref11, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;

    if ((_ref4 = __selector__('#app, #landing')) != null) {
      if ((_ref5 = _ref4.classList) != null) {
        _ref5.remove("hidden");
      }
    }
    if (err) {
      return alert(err != null ? err.message : void 0);
    } else {
      if (user) {
        if ((_ref6 = __selector__('[name=email]')) != null) {
          _ref6.value = "";
        }
        if ((_ref7 = __selector__('[name=password]')) != null) {
          _ref7.value = "";
        }
        return typeof spendy !== "undefined" && spendy !== null ? spendy.init(user != null ? user.id : void 0) : void 0;
      } else {
        if ((_ref8 = __selector__('#landing')) != null) {
          if ((_ref9 = _ref8.classList) != null) {
            _ref9.remove("hide");
          }
        }
        return (_ref10 = __selector__('#app')) != null ? (_ref11 = _ref10.classList) != null ? _ref11.add("hide") : void 0 : void 0;
      }
    }
  };
  login = function() {
    var _ref4, _ref5;

    return typeof auth !== "undefined" && auth !== null ? auth.login("password", {
      email: (_ref4 = __selector__('[name=email]')) != null ? _ref4.value : void 0,
      password: (_ref5 = __selector__('[name=password]')) != null ? _ref5.value : void 0
    }) : void 0;
  };
  register = function() {
    var name, password, _ref4, _ref5;

    name = (_ref4 = __selector__('[name=email]')) != null ? _ref4.value : void 0;
    password = (_ref5 = __selector__('[name=password]')) != null ? _ref5.value : void 0;
    return typeof auth !== "undefined" && auth !== null ? auth.createUser(name, password, function(error, user) {
      if (error) {
        return alert(error != null ? error.message : void 0);
      } else {
        return typeof auth !== "undefined" && auth !== null ? auth.login("password", {
          email: name,
          password: password
        }) : void 0;
      }
    }) : void 0;
  };
  auth = new FirebaseAuthClient(baseRef, handleAuth);
  spendy = new Spendy(body, baseRef, auth);
  __selector__('.persona-button#register').addEventListener('touchend', function(e) {
    var event;

    event = e;
    if (event != null) {
      event.stopPropagation();
    }
    return register();
  }, true);
  __selector__('.persona-button#register').addEventListener('click', function(e) {
    var event;

    event = e;
    if (event != null) {
      event.stopPropagation();
    }
    return register();
  }, true);
  __selector__('.persona-button#login').addEventListener('click', function(e) {
    var event;

    event = e;
    if (event != null) {
      event.stopPropagation();
    }
    return login();
  }, true);
  __selector__('.persona-button#login').addEventListener('touchend', function(e) {
    var event;

    event = e;
    if (event != null) {
      event.stopPropagation();
    }
    return login();
  }, true);
  __selector__('.persona-button#try').addEventListener('click', function(e) {
    var event;

    event = e;
    if (event != null) {
      event.stopPropagation();
    }
    return spendy != null ? spendy.init("try") : void 0;
  }, true);
  __selector__('.persona-button#try').addEventListener('touchend', function(e) {
    var event;

    event = e;
    if (event != null) {
      event.stopPropagation();
    }
    return spendy != null ? spendy.init("try") : void 0;
  }, true);
  __selector__('form [name=price]').addEventListener('keypress', function(e) {
    var event;

    event = e;
    if ((event != null ? event.keyCode : void 0) === 13) {
      return spendy != null ? spendy.add() : void 0;
    }
  }, true);
  __selector__('i.icon-plus').addEventListener('click', function(e) {
    var event;

    event = e;
    return spendy != null ? spendy.add() : void 0;
  }, true);
  __selector__('i.icon-plus').addEventListener('touchend', function(e) {
    var event;

    event = e;
    return spendy != null ? spendy.add() : void 0;
  }, true);
  __selector__('i.icon-signout').addEventListener('click', function(e) {
    var event;

    event = e;
    return spendy != null ? spendy.logout() : void 0;
  }, true);
  return __selector__('i.icon-signout').addEventListener('touchend', function(e) {
    var event;

    event = e;
    return spendy != null ? spendy.logout() : void 0;
  }, true);
};
