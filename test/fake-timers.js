// @ts-nocheck
var fakeTimers = (() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/@sinonjs/commons/lib/global.js
  var require_global = __commonJS({
    "node_modules/@sinonjs/commons/lib/global.js"(exports, module) {
      "use strict";
      var globalObject;
      if (typeof global !== "undefined") {
        globalObject = global;
      } else if (typeof window !== "undefined") {
        globalObject = window;
      } else {
        globalObject = self;
      }
      module.exports = globalObject;
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js
  var require_copy_prototype = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js"(exports, module) {
      "use strict";
      var call = Function.call;
      module.exports = function copyPrototypeMethods(prototype) {
        return Object.getOwnPropertyNames(prototype).reduce(function(result, name) {
          if (name !== "size" && name !== "caller" && name !== "callee" && name !== "arguments" && typeof prototype[name] === "function") {
            result[name] = call.bind(prototype[name]);
          }
          return result;
        }, Object.create(null));
      };
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/array.js
  var require_array = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/array.js"(exports, module) {
      "use strict";
      var copyPrototype = require_copy_prototype();
      module.exports = copyPrototype(Array.prototype);
    }
  });

  // node_modules/@sinonjs/commons/lib/called-in-order.js
  var require_called_in_order = __commonJS({
    "node_modules/@sinonjs/commons/lib/called-in-order.js"(exports, module) {
      "use strict";
      var every = require_array().every;
      function hasCallsLeft(callMap, spy) {
        if (callMap[spy.id] === void 0) {
          callMap[spy.id] = 0;
        }
        return callMap[spy.id] < spy.callCount;
      }
      function checkAdjacentCalls(callMap, spy, index, spies) {
        var calledBeforeNext = true;
        if (index !== spies.length - 1) {
          calledBeforeNext = spy.calledBefore(spies[index + 1]);
        }
        if (hasCallsLeft(callMap, spy) && calledBeforeNext) {
          callMap[spy.id] += 1;
          return true;
        }
        return false;
      }
      function calledInOrder(spies) {
        var callMap = {};
        var _spies = arguments.length > 1 ? arguments : spies;
        return every(_spies, checkAdjacentCalls.bind(null, callMap));
      }
      module.exports = calledInOrder;
    }
  });

  // node_modules/@sinonjs/commons/lib/function-name.js
  var require_function_name = __commonJS({
    "node_modules/@sinonjs/commons/lib/function-name.js"(exports, module) {
      "use strict";
      module.exports = function functionName(func) {
        if (!func) {
          return "";
        }
        try {
          return func.displayName || func.name || (String(func).match(/function ([^\s(]+)/) || [])[1];
        } catch (e) {
          return "";
        }
      };
    }
  });

  // node_modules/@sinonjs/commons/lib/class-name.js
  var require_class_name = __commonJS({
    "node_modules/@sinonjs/commons/lib/class-name.js"(exports, module) {
      "use strict";
      var functionName = require_function_name();
      function className(value) {
        return value.constructor && value.constructor.name || typeof value.constructor === "function" && functionName(value.constructor) || null;
      }
      module.exports = className;
    }
  });

  // node_modules/@sinonjs/commons/lib/deprecated.js
  var require_deprecated = __commonJS({
    "node_modules/@sinonjs/commons/lib/deprecated.js"(exports) {
      "use strict";
      exports.wrap = function(func, msg) {
        var wrapped = function() {
          exports.printWarning(msg);
          return func.apply(this, arguments);
        };
        if (func.prototype) {
          wrapped.prototype = func.prototype;
        }
        return wrapped;
      };
      exports.defaultMsg = function(packageName, funcName) {
        return packageName + "." + funcName + " is deprecated and will be removed from the public API in a future version of " + packageName + ".";
      };
      exports.printWarning = function(msg) {
        if (typeof process === "object" && process.emitWarning) {
          process.emitWarning(msg);
        } else if (console.info) {
          console.info(msg);
        } else {
          console.log(msg);
        }
      };
    }
  });

  // node_modules/@sinonjs/commons/lib/every.js
  var require_every = __commonJS({
    "node_modules/@sinonjs/commons/lib/every.js"(exports, module) {
      "use strict";
      module.exports = function every(obj, fn) {
        var pass = true;
        try {
          obj.forEach(function() {
            if (!fn.apply(this, arguments)) {
              throw new Error();
            }
          });
        } catch (e) {
          pass = false;
        }
        return pass;
      };
    }
  });

  // node_modules/@sinonjs/commons/lib/order-by-first-call.js
  var require_order_by_first_call = __commonJS({
    "node_modules/@sinonjs/commons/lib/order-by-first-call.js"(exports, module) {
      "use strict";
      var sort = require_array().sort;
      var slice = require_array().slice;
      function comparator(a, b) {
        var aCall = a.getCall(0);
        var bCall = b.getCall(0);
        var aId = aCall && aCall.callId || -1;
        var bId = bCall && bCall.callId || -1;
        return aId < bId ? -1 : 1;
      }
      function orderByFirstCall(spies) {
        return sort(slice(spies), comparator);
      }
      module.exports = orderByFirstCall;
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/function.js
  var require_function = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/function.js"(exports, module) {
      "use strict";
      var copyPrototype = require_copy_prototype();
      module.exports = copyPrototype(Function.prototype);
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/map.js
  var require_map = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/map.js"(exports, module) {
      "use strict";
      var copyPrototype = require_copy_prototype();
      module.exports = copyPrototype(Map.prototype);
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/object.js
  var require_object = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/object.js"(exports, module) {
      "use strict";
      var copyPrototype = require_copy_prototype();
      module.exports = copyPrototype(Object.prototype);
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/set.js
  var require_set = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/set.js"(exports, module) {
      "use strict";
      var copyPrototype = require_copy_prototype();
      module.exports = copyPrototype(Set.prototype);
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/string.js
  var require_string = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/string.js"(exports, module) {
      "use strict";
      var copyPrototype = require_copy_prototype();
      module.exports = copyPrototype(String.prototype);
    }
  });

  // node_modules/@sinonjs/commons/lib/prototypes/index.js
  var require_prototypes = __commonJS({
    "node_modules/@sinonjs/commons/lib/prototypes/index.js"(exports, module) {
      "use strict";
      module.exports = {
        array: require_array(),
        function: require_function(),
        map: require_map(),
        object: require_object(),
        set: require_set(),
        string: require_string()
      };
    }
  });

  // node_modules/type-detect/type-detect.js
  var require_type_detect = __commonJS({
    "node_modules/type-detect/type-detect.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.typeDetect = factory();
      })(exports, function() {
        "use strict";
        var promiseExists = typeof Promise === "function";
        var globalObject = typeof self === "object" ? self : global;
        var symbolExists = typeof Symbol !== "undefined";
        var mapExists = typeof Map !== "undefined";
        var setExists = typeof Set !== "undefined";
        var weakMapExists = typeof WeakMap !== "undefined";
        var weakSetExists = typeof WeakSet !== "undefined";
        var dataViewExists = typeof DataView !== "undefined";
        var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
        var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
        var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
        var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
        var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
        var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
        var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
        var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
        var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
        var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
        var toStringLeftSliceLength = 8;
        var toStringRightSliceLength = -1;
        function typeDetect(obj) {
          var typeofObj = typeof obj;
          if (typeofObj !== "object") {
            return typeofObj;
          }
          if (obj === null) {
            return "null";
          }
          if (obj === globalObject) {
            return "global";
          }
          if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
            return "Array";
          }
          if (typeof window === "object" && window !== null) {
            if (typeof window.location === "object" && obj === window.location) {
              return "Location";
            }
            if (typeof window.document === "object" && obj === window.document) {
              return "Document";
            }
            if (typeof window.navigator === "object") {
              if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
                return "MimeTypeArray";
              }
              if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
                return "PluginArray";
              }
            }
            if ((typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") && obj instanceof window.HTMLElement) {
              if (obj.tagName === "BLOCKQUOTE") {
                return "HTMLQuoteElement";
              }
              if (obj.tagName === "TD") {
                return "HTMLTableDataCellElement";
              }
              if (obj.tagName === "TH") {
                return "HTMLTableHeaderCellElement";
              }
            }
          }
          var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
          if (typeof stringTag === "string") {
            return stringTag;
          }
          var objPrototype = Object.getPrototypeOf(obj);
          if (objPrototype === RegExp.prototype) {
            return "RegExp";
          }
          if (objPrototype === Date.prototype) {
            return "Date";
          }
          if (promiseExists && objPrototype === Promise.prototype) {
            return "Promise";
          }
          if (setExists && objPrototype === Set.prototype) {
            return "Set";
          }
          if (mapExists && objPrototype === Map.prototype) {
            return "Map";
          }
          if (weakSetExists && objPrototype === WeakSet.prototype) {
            return "WeakSet";
          }
          if (weakMapExists && objPrototype === WeakMap.prototype) {
            return "WeakMap";
          }
          if (dataViewExists && objPrototype === DataView.prototype) {
            return "DataView";
          }
          if (mapExists && objPrototype === mapIteratorPrototype) {
            return "Map Iterator";
          }
          if (setExists && objPrototype === setIteratorPrototype) {
            return "Set Iterator";
          }
          if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
            return "Array Iterator";
          }
          if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
            return "String Iterator";
          }
          if (objPrototype === null) {
            return "Object";
          }
          return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
        }
        return typeDetect;
      });
    }
  });

  // node_modules/@sinonjs/commons/lib/type-of.js
  var require_type_of = __commonJS({
    "node_modules/@sinonjs/commons/lib/type-of.js"(exports, module) {
      "use strict";
      var type = require_type_detect();
      module.exports = function typeOf(value) {
        return type(value).toLowerCase();
      };
    }
  });

  // node_modules/@sinonjs/commons/lib/value-to-string.js
  var require_value_to_string = __commonJS({
    "node_modules/@sinonjs/commons/lib/value-to-string.js"(exports, module) {
      "use strict";
      function valueToString(value) {
        if (value && value.toString) {
          return value.toString();
        }
        return String(value);
      }
      module.exports = valueToString;
    }
  });

  // node_modules/@sinonjs/commons/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@sinonjs/commons/lib/index.js"(exports, module) {
      "use strict";
      module.exports = {
        global: require_global(),
        calledInOrder: require_called_in_order(),
        className: require_class_name(),
        deprecated: require_deprecated(),
        every: require_every(),
        functionName: require_function_name(),
        orderByFirstCall: require_order_by_first_call(),
        prototypes: require_prototypes(),
        typeOf: require_type_of(),
        valueToString: require_value_to_string()
      };
    }
  });

  // node_modules/@sinonjs/fake-timers/src/fake-timers-src.js
  var require_fake_timers_src = __commonJS({
    "node_modules/@sinonjs/fake-timers/src/fake-timers-src.js"(exports) {
      "use strict";
      var globalObject = require_lib().global;
      function withGlobal(_global) {
        var userAgent = _global.navigator && _global.navigator.userAgent;
        var isRunningInIE = userAgent && userAgent.indexOf("MSIE ") > -1;
        var maxTimeout = Math.pow(2, 31) - 1;
        var NOOP = function() {
          return void 0;
        };
        var NOOP_ARRAY = function() {
          return [];
        };
        var timeoutResult = _global.setTimeout(NOOP, 0);
        var addTimerReturnsObject = typeof timeoutResult === "object";
        var hrtimePresent = _global.process && typeof _global.process.hrtime === "function";
        var hrtimeBigintPresent = hrtimePresent && typeof _global.process.hrtime.bigint === "function";
        var nextTickPresent = _global.process && typeof _global.process.nextTick === "function";
        var utilPromisify = _global.process && __require("util").promisify;
        var performancePresent = _global.performance && typeof _global.performance.now === "function";
        var hasPerformancePrototype = _global.Performance && (typeof _global.Performance).match(/^(function|object)$/);
        var queueMicrotaskPresent = _global.hasOwnProperty("queueMicrotask");
        var requestAnimationFramePresent = _global.requestAnimationFrame && typeof _global.requestAnimationFrame === "function";
        var cancelAnimationFramePresent = _global.cancelAnimationFrame && typeof _global.cancelAnimationFrame === "function";
        var requestIdleCallbackPresent = _global.requestIdleCallback && typeof _global.requestIdleCallback === "function";
        var cancelIdleCallbackPresent = _global.cancelIdleCallback && typeof _global.cancelIdleCallback === "function";
        var setImmediatePresent = _global.setImmediate && typeof _global.setImmediate === "function";
        if (isRunningInIE) {
          _global.setTimeout = _global.setTimeout;
          _global.clearTimeout = _global.clearTimeout;
          _global.setInterval = _global.setInterval;
          _global.clearInterval = _global.clearInterval;
          _global.Date = _global.Date;
        }
        if (setImmediatePresent) {
          _global.setImmediate = _global.setImmediate;
          _global.clearImmediate = _global.clearImmediate;
        }
        _global.clearTimeout(timeoutResult);
        var NativeDate = _global.Date;
        var uniqueTimerId = 1;
        function isNumberFinite(num) {
          if (Number.isFinite) {
            return Number.isFinite(num);
          }
          return isFinite(num);
        }
        function parseTime(str) {
          if (!str) {
            return 0;
          }
          var strings = str.split(":");
          var l = strings.length;
          var i = l;
          var ms = 0;
          var parsed;
          if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
            throw new Error("tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits");
          }
          while (i--) {
            parsed = parseInt(strings[i], 10);
            if (parsed >= 60) {
              throw new Error("Invalid time " + str);
            }
            ms += parsed * Math.pow(60, l - i - 1);
          }
          return ms * 1e3;
        }
        function nanoRemainder(msFloat) {
          var modulo = 1e6;
          var remainder = msFloat * 1e6 % modulo;
          var positiveRemainder = remainder < 0 ? remainder + modulo : remainder;
          return Math.floor(positiveRemainder);
        }
        function getEpoch(epoch) {
          if (!epoch) {
            return 0;
          }
          if (typeof epoch.getTime === "function") {
            return epoch.getTime();
          }
          if (typeof epoch === "number") {
            return epoch;
          }
          throw new TypeError("now should be milliseconds since UNIX epoch");
        }
        function inRange(from, to, timer) {
          return timer && timer.callAt >= from && timer.callAt <= to;
        }
        function mirrorDateProperties(target, source) {
          var prop;
          for (prop in source) {
            if (source.hasOwnProperty(prop)) {
              target[prop] = source[prop];
            }
          }
          if (source.now) {
            target.now = function now() {
              return target.clock.now;
            };
          } else {
            delete target.now;
          }
          if (source.toSource) {
            target.toSource = function toSource() {
              return source.toSource();
            };
          } else {
            delete target.toSource;
          }
          target.toString = function toString() {
            return source.toString();
          };
          target.prototype = source.prototype;
          target.parse = source.parse;
          target.UTC = source.UTC;
          target.prototype.toUTCString = source.prototype.toUTCString;
          return target;
        }
        function createDate() {
          function ClockDate(year, month, date, hour, minute, second, ms) {
            if (!(this instanceof ClockDate)) {
              return new NativeDate(ClockDate.clock.now).toString();
            }
            switch (arguments.length) {
              case 0:
                return new NativeDate(ClockDate.clock.now);
              case 1:
                return new NativeDate(year);
              case 2:
                return new NativeDate(year, month);
              case 3:
                return new NativeDate(year, month, date);
              case 4:
                return new NativeDate(year, month, date, hour);
              case 5:
                return new NativeDate(year, month, date, hour, minute);
              case 6:
                return new NativeDate(year, month, date, hour, minute, second);
              default:
                return new NativeDate(year, month, date, hour, minute, second, ms);
            }
          }
          return mirrorDateProperties(ClockDate, NativeDate);
        }
        function enqueueJob(clock, job) {
          if (!clock.jobs) {
            clock.jobs = [];
          }
          clock.jobs.push(job);
        }
        function runJobs(clock) {
          if (!clock.jobs) {
            return;
          }
          for (var i = 0; i < clock.jobs.length; i++) {
            var job = clock.jobs[i];
            job.func.apply(null, job.args);
            if (clock.loopLimit && i > clock.loopLimit) {
              throw new Error("Aborting after running " + clock.loopLimit + " timers, assuming an infinite loop!");
            }
          }
          clock.jobs = [];
        }
        function addTimer(clock, timer) {
          if (timer.func === void 0) {
            throw new Error("Callback must be provided to timer calls");
          }
          if (addTimerReturnsObject) {
            if (typeof timer.func !== "function") {
              throw new TypeError("[ERR_INVALID_CALLBACK]: Callback must be a function. Received " + timer.func + " of type " + typeof timer.func);
            }
          }
          timer.type = timer.immediate ? "Immediate" : "Timeout";
          if (timer.hasOwnProperty("delay")) {
            if (typeof timer.delay !== "number") {
              timer.delay = parseInt(timer.delay, 10);
            }
            if (!isNumberFinite(timer.delay)) {
              timer.delay = 0;
            }
            timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;
            timer.delay = Math.max(0, timer.delay);
          }
          if (timer.hasOwnProperty("interval")) {
            timer.type = "Interval";
            timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;
          }
          if (timer.hasOwnProperty("animation")) {
            timer.type = "AnimationFrame";
            timer.animation = true;
          }
          if (!clock.timers) {
            clock.timers = {};
          }
          timer.id = uniqueTimerId++;
          timer.createdAt = clock.now;
          timer.callAt = clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));
          clock.timers[timer.id] = timer;
          if (addTimerReturnsObject) {
            var res = {
              id: timer.id,
              ref: function() {
                return res;
              },
              unref: function() {
                return res;
              },
              refresh: function() {
                clearTimeout(timer.id);
                var args = [timer.func, timer.delay].concat(timer.args);
                return setTimeout.apply(null, args);
              }
            };
            return res;
          }
          return timer.id;
        }
        function compareTimers(a, b) {
          if (a.callAt < b.callAt) {
            return -1;
          }
          if (a.callAt > b.callAt) {
            return 1;
          }
          if (a.immediate && !b.immediate) {
            return -1;
          }
          if (!a.immediate && b.immediate) {
            return 1;
          }
          if (a.createdAt < b.createdAt) {
            return -1;
          }
          if (a.createdAt > b.createdAt) {
            return 1;
          }
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
        }
        function firstTimerInRange(clock, from, to) {
          var timers2 = clock.timers;
          var timer = null;
          var id, isInRange;
          for (id in timers2) {
            if (timers2.hasOwnProperty(id)) {
              isInRange = inRange(from, to, timers2[id]);
              if (isInRange && (!timer || compareTimers(timer, timers2[id]) === 1)) {
                timer = timers2[id];
              }
            }
          }
          return timer;
        }
        function firstTimer(clock) {
          var timers2 = clock.timers;
          var timer = null;
          var id;
          for (id in timers2) {
            if (timers2.hasOwnProperty(id)) {
              if (!timer || compareTimers(timer, timers2[id]) === 1) {
                timer = timers2[id];
              }
            }
          }
          return timer;
        }
        function lastTimer(clock) {
          var timers2 = clock.timers;
          var timer = null;
          var id;
          for (id in timers2) {
            if (timers2.hasOwnProperty(id)) {
              if (!timer || compareTimers(timer, timers2[id]) === -1) {
                timer = timers2[id];
              }
            }
          }
          return timer;
        }
        function callTimer(clock, timer) {
          if (typeof timer.interval === "number") {
            clock.timers[timer.id].callAt += timer.interval;
          } else {
            delete clock.timers[timer.id];
          }
          if (typeof timer.func === "function") {
            timer.func.apply(null, timer.args);
          } else {
            var eval2 = eval;
            (function() {
              eval2(timer.func);
            })();
          }
        }
        function clearTimer(clock, timerId, ttype) {
          if (!timerId) {
            return;
          }
          if (!clock.timers) {
            clock.timers = {};
          }
          var id = typeof timerId === "object" ? timerId.id : timerId;
          if (clock.timers.hasOwnProperty(id)) {
            var timer = clock.timers[id];
            if (timer.type === ttype || timer.type === "Timeout" && ttype === "Interval" || timer.type === "Interval" && ttype === "Timeout") {
              delete clock.timers[id];
            } else {
              var clear = ttype === "AnimationFrame" ? "cancelAnimationFrame" : "clear" + ttype;
              var schedule = timer.type === "AnimationFrame" ? "requestAnimationFrame" : "set" + timer.type;
              throw new Error("Cannot clear timer: timer created with " + schedule + "() but cleared with " + clear + "()");
            }
          }
        }
        function uninstall(clock, config) {
          var method, i, l;
          var installedHrTime = "_hrtime";
          var installedNextTick = "_nextTick";
          for (i = 0, l = clock.methods.length; i < l; i++) {
            method = clock.methods[i];
            if (method === "hrtime" && _global.process) {
              _global.process.hrtime = clock[installedHrTime];
            } else if (method === "nextTick" && _global.process) {
              _global.process.nextTick = clock[installedNextTick];
            } else if (method === "performance") {
              var originalPerfDescriptor = Object.getOwnPropertyDescriptor(clock, "_" + method);
              if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {
                Object.defineProperty(_global, method, originalPerfDescriptor);
              } else if (originalPerfDescriptor.configurable) {
                _global[method] = clock["_" + method];
              }
            } else {
              if (_global[method] && _global[method].hadOwnProperty) {
                _global[method] = clock["_" + method];
                if (method === "clearInterval" && config.shouldAdvanceTime === true) {
                  _global[method](clock.attachedInterval);
                }
              } else {
                try {
                  delete _global[method];
                } catch (ignore) {
                }
              }
            }
          }
          clock.methods = [];
          if (!clock.timers) {
            return [];
          }
          return Object.keys(clock.timers).map(function mapper(key) {
            return clock.timers[key];
          });
        }
        function hijackMethod(target, method, clock) {
          clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(target, method);
          clock["_" + method] = target[method];
          if (method === "Date") {
            var date = mirrorDateProperties(clock[method], target[method]);
            target[method] = date;
          } else if (method === "performance") {
            var originalPerfDescriptor = Object.getOwnPropertyDescriptor(target, method);
            if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {
              Object.defineProperty(clock, "_" + method, originalPerfDescriptor);
              var perfDescriptor = Object.getOwnPropertyDescriptor(clock, method);
              Object.defineProperty(target, method, perfDescriptor);
            } else {
              target[method] = clock[method];
            }
          } else {
            target[method] = function() {
              return clock[method].apply(clock, arguments);
            };
            Object.defineProperties(target[method], Object.getOwnPropertyDescriptors(clock[method]));
          }
          target[method].clock = clock;
        }
        function doIntervalTick(clock, advanceTimeDelta) {
          clock.tick(advanceTimeDelta);
        }
        var timers = {
          setTimeout: _global.setTimeout,
          clearTimeout: _global.clearTimeout,
          setInterval: _global.setInterval,
          clearInterval: _global.clearInterval,
          Date: _global.Date
        };
        if (setImmediatePresent) {
          timers.setImmediate = _global.setImmediate;
          timers.clearImmediate = _global.clearImmediate;
        }
        if (hrtimePresent) {
          timers.hrtime = _global.process.hrtime;
        }
        if (nextTickPresent) {
          timers.nextTick = _global.process.nextTick;
        }
        if (performancePresent) {
          timers.performance = _global.performance;
        }
        if (requestAnimationFramePresent) {
          timers.requestAnimationFrame = _global.requestAnimationFrame;
        }
        if (queueMicrotaskPresent) {
          timers.queueMicrotask = true;
        }
        if (cancelAnimationFramePresent) {
          timers.cancelAnimationFrame = _global.cancelAnimationFrame;
        }
        if (requestIdleCallbackPresent) {
          timers.requestIdleCallback = _global.requestIdleCallback;
        }
        if (cancelIdleCallbackPresent) {
          timers.cancelIdleCallback = _global.cancelIdleCallback;
        }
        var originalSetTimeout = _global.setImmediate || _global.setTimeout;
        function createClock(start, loopLimit) {
          start = Math.floor(getEpoch(start));
          loopLimit = loopLimit || 1e3;
          var nanos = 0;
          var adjustedSystemTime = [0, 0];
          if (NativeDate === void 0) {
            throw new Error("The global scope doesn't have a `Date` object (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)");
          }
          var clock = {
            now: start,
            timeouts: {},
            Date: createDate(),
            loopLimit
          };
          clock.Date.clock = clock;
          function getTimeToNextFrame() {
            return 16 - (clock.now - start) % 16;
          }
          function hrtime(prev) {
            var millisSinceStart = clock.now - adjustedSystemTime[0] - start;
            var secsSinceStart = Math.floor(millisSinceStart / 1e3);
            var remainderInNanos = (millisSinceStart - secsSinceStart * 1e3) * 1e6 + nanos - adjustedSystemTime[1];
            if (Array.isArray(prev)) {
              if (prev[1] > 1e9) {
                throw new TypeError("Number of nanoseconds can't exceed a billion");
              }
              var oldSecs = prev[0];
              var nanoDiff = remainderInNanos - prev[1];
              var secDiff = secsSinceStart - oldSecs;
              if (nanoDiff < 0) {
                nanoDiff += 1e9;
                secDiff -= 1;
              }
              return [secDiff, nanoDiff];
            }
            return [secsSinceStart, remainderInNanos];
          }
          if (hrtimeBigintPresent) {
            hrtime.bigint = function() {
              var parts = hrtime();
              return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]);
            };
          }
          clock.requestIdleCallback = function requestIdleCallback(func, timeout) {
            var timeToNextIdlePeriod = 0;
            if (clock.countTimers() > 0) {
              timeToNextIdlePeriod = 50;
            }
            var result = addTimer(clock, {
              func,
              args: Array.prototype.slice.call(arguments, 2),
              delay: typeof timeout === "undefined" ? timeToNextIdlePeriod : Math.min(timeout, timeToNextIdlePeriod)
            });
            return result.id || result;
          };
          clock.cancelIdleCallback = function cancelIdleCallback(timerId) {
            return clearTimer(clock, timerId, "Timeout");
          };
          clock.setTimeout = function setTimeout2(func, timeout) {
            return addTimer(clock, {
              func,
              args: Array.prototype.slice.call(arguments, 2),
              delay: timeout
            });
          };
          if (typeof _global.Promise !== "undefined" && utilPromisify) {
            clock.setTimeout[utilPromisify.custom] = function promisifiedSetTimeout(timeout, arg) {
              return new _global.Promise(function setTimeoutExecutor(resolve) {
                addTimer(clock, {
                  func: resolve,
                  args: [arg],
                  delay: timeout
                });
              });
            };
          }
          clock.clearTimeout = function clearTimeout2(timerId) {
            return clearTimer(clock, timerId, "Timeout");
          };
          clock.nextTick = function nextTick(func) {
            return enqueueJob(clock, {
              func,
              args: Array.prototype.slice.call(arguments, 1)
            });
          };
          clock.queueMicrotask = function queueMicrotask(func) {
            return clock.nextTick(func);
          };
          clock.setInterval = function setInterval(func, timeout) {
            timeout = parseInt(timeout, 10);
            return addTimer(clock, {
              func,
              args: Array.prototype.slice.call(arguments, 2),
              delay: timeout,
              interval: timeout
            });
          };
          clock.clearInterval = function clearInterval(timerId) {
            return clearTimer(clock, timerId, "Interval");
          };
          if (setImmediatePresent) {
            clock.setImmediate = function setImmediate(func) {
              return addTimer(clock, {
                func,
                args: Array.prototype.slice.call(arguments, 1),
                immediate: true
              });
            };
            if (typeof _global.Promise !== "undefined" && utilPromisify) {
              clock.setImmediate[utilPromisify.custom] = function promisifiedSetImmediate(arg) {
                return new _global.Promise(function setImmediateExecutor(resolve) {
                  addTimer(clock, {
                    func: resolve,
                    args: [arg],
                    immediate: true
                  });
                });
              };
            }
            clock.clearImmediate = function clearImmediate(timerId) {
              return clearTimer(clock, timerId, "Immediate");
            };
          }
          clock.countTimers = function countTimers() {
            return Object.keys(clock.timers || {}).length + (clock.jobs || []).length;
          };
          clock.requestAnimationFrame = function requestAnimationFrame(func) {
            var result = addTimer(clock, {
              func,
              delay: getTimeToNextFrame(),
              args: [clock.now + getTimeToNextFrame()],
              animation: true
            });
            return result.id || result;
          };
          clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {
            return clearTimer(clock, timerId, "AnimationFrame");
          };
          clock.runMicrotasks = function runMicrotasks() {
            runJobs(clock);
          };
          function doTick(tickValue, isAsync, resolve, reject) {
            var msFloat = typeof tickValue === "number" ? tickValue : parseTime(tickValue);
            var ms = Math.floor(msFloat);
            var remainder = nanoRemainder(msFloat);
            var nanosTotal = nanos + remainder;
            var tickTo = clock.now + ms;
            if (msFloat < 0) {
              throw new TypeError("Negative ticks are not supported");
            }
            if (nanosTotal >= 1e6) {
              tickTo += 1;
              nanosTotal -= 1e6;
            }
            nanos = nanosTotal;
            var tickFrom = clock.now;
            var previous = clock.now;
            var timer, firstException, oldNow, nextPromiseTick, compensationCheck, postTimerCall;
            clock.duringTick = true;
            oldNow = clock.now;
            runJobs(clock);
            if (oldNow !== clock.now) {
              tickFrom += clock.now - oldNow;
              tickTo += clock.now - oldNow;
            }
            function doTickInner() {
              timer = firstTimerInRange(clock, tickFrom, tickTo);
              while (timer && tickFrom <= tickTo) {
                if (clock.timers[timer.id]) {
                  tickFrom = timer.callAt;
                  clock.now = timer.callAt;
                  oldNow = clock.now;
                  try {
                    runJobs(clock);
                    callTimer(clock, timer);
                  } catch (e) {
                    firstException = firstException || e;
                  }
                  if (isAsync) {
                    originalSetTimeout(nextPromiseTick);
                    return;
                  }
                  compensationCheck();
                }
                postTimerCall();
              }
              oldNow = clock.now;
              runJobs(clock);
              if (oldNow !== clock.now) {
                tickFrom += clock.now - oldNow;
                tickTo += clock.now - oldNow;
              }
              clock.duringTick = false;
              timer = firstTimerInRange(clock, tickFrom, tickTo);
              if (timer) {
                try {
                  clock.tick(tickTo - clock.now);
                } catch (e) {
                  firstException = firstException || e;
                }
              } else {
                clock.now = tickTo;
                nanos = nanosTotal;
              }
              if (firstException) {
                throw firstException;
              }
              if (isAsync) {
                resolve(clock.now);
              } else {
                return clock.now;
              }
            }
            nextPromiseTick = isAsync && function() {
              try {
                compensationCheck();
                postTimerCall();
                doTickInner();
              } catch (e) {
                reject(e);
              }
            };
            compensationCheck = function() {
              if (oldNow !== clock.now) {
                tickFrom += clock.now - oldNow;
                tickTo += clock.now - oldNow;
                previous += clock.now - oldNow;
              }
            };
            postTimerCall = function() {
              timer = firstTimerInRange(clock, previous, tickTo);
              previous = tickFrom;
            };
            return doTickInner();
          }
          clock.tick = function tick(tickValue) {
            return doTick(tickValue, false);
          };
          if (typeof _global.Promise !== "undefined") {
            clock.tickAsync = function tickAsync(ms) {
              return new _global.Promise(function(resolve, reject) {
                originalSetTimeout(function() {
                  try {
                    doTick(ms, true, resolve, reject);
                  } catch (e) {
                    reject(e);
                  }
                });
              });
            };
          }
          clock.next = function next() {
            runJobs(clock);
            var timer = firstTimer(clock);
            if (!timer) {
              return clock.now;
            }
            clock.duringTick = true;
            try {
              clock.now = timer.callAt;
              callTimer(clock, timer);
              runJobs(clock);
              return clock.now;
            } finally {
              clock.duringTick = false;
            }
          };
          if (typeof _global.Promise !== "undefined") {
            clock.nextAsync = function nextAsync() {
              return new _global.Promise(function(resolve, reject) {
                originalSetTimeout(function() {
                  try {
                    var timer = firstTimer(clock);
                    if (!timer) {
                      resolve(clock.now);
                      return;
                    }
                    var err;
                    clock.duringTick = true;
                    clock.now = timer.callAt;
                    try {
                      callTimer(clock, timer);
                    } catch (e) {
                      err = e;
                    }
                    clock.duringTick = false;
                    originalSetTimeout(function() {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(clock.now);
                      }
                    });
                  } catch (e) {
                    reject(e);
                  }
                });
              });
            };
          }
          clock.runAll = function runAll() {
            var numTimers, i;
            runJobs(clock);
            for (i = 0; i < clock.loopLimit; i++) {
              if (!clock.timers) {
                return clock.now;
              }
              numTimers = Object.keys(clock.timers).length;
              if (numTimers === 0) {
                return clock.now;
              }
              clock.next();
            }
            throw new Error("Aborting after running " + clock.loopLimit + " timers, assuming an infinite loop!");
          };
          clock.runToFrame = function runToFrame() {
            return clock.tick(getTimeToNextFrame());
          };
          if (typeof _global.Promise !== "undefined") {
            clock.runAllAsync = function runAllAsync() {
              return new _global.Promise(function(resolve, reject) {
                var i = 0;
                function doRun() {
                  originalSetTimeout(function() {
                    try {
                      var numTimers;
                      if (i < clock.loopLimit) {
                        if (!clock.timers) {
                          resolve(clock.now);
                          return;
                        }
                        numTimers = Object.keys(clock.timers).length;
                        if (numTimers === 0) {
                          resolve(clock.now);
                          return;
                        }
                        clock.next();
                        i++;
                        doRun();
                        return;
                      }
                      reject(new Error("Aborting after running " + clock.loopLimit + " timers, assuming an infinite loop!"));
                    } catch (e) {
                      reject(e);
                    }
                  });
                }
                doRun();
              });
            };
          }
          clock.runToLast = function runToLast() {
            var timer = lastTimer(clock);
            if (!timer) {
              runJobs(clock);
              return clock.now;
            }
            return clock.tick(timer.callAt - clock.now);
          };
          if (typeof _global.Promise !== "undefined") {
            clock.runToLastAsync = function runToLastAsync() {
              return new _global.Promise(function(resolve, reject) {
                originalSetTimeout(function() {
                  try {
                    var timer = lastTimer(clock);
                    if (!timer) {
                      resolve(clock.now);
                    }
                    resolve(clock.tickAsync(timer.callAt));
                  } catch (e) {
                    reject(e);
                  }
                });
              });
            };
          }
          clock.reset = function reset() {
            nanos = 0;
            clock.timers = {};
            clock.jobs = [];
            clock.now = start;
          };
          clock.setSystemTime = function setSystemTime(systemTime) {
            var newNow = getEpoch(systemTime);
            var difference = newNow - clock.now;
            var id, timer;
            adjustedSystemTime[0] = adjustedSystemTime[0] + difference;
            adjustedSystemTime[1] = adjustedSystemTime[1] + nanos;
            clock.now = newNow;
            nanos = 0;
            for (id in clock.timers) {
              if (clock.timers.hasOwnProperty(id)) {
                timer = clock.timers[id];
                timer.createdAt += difference;
                timer.callAt += difference;
              }
            }
          };
          if (performancePresent) {
            clock.performance = Object.create(null);
            if (hasPerformancePrototype) {
              var proto = _global.Performance.prototype;
              Object.getOwnPropertyNames(proto).forEach(function(name) {
                if (name.indexOf("getEntries") === 0) {
                  clock.performance[name] = NOOP_ARRAY;
                } else {
                  clock.performance[name] = NOOP;
                }
              });
            }
            clock.performance.now = function FakeTimersNow() {
              var hrt = hrtime();
              var millis = hrt[0] * 1e3 + hrt[1] / 1e6;
              return millis;
            };
          }
          if (hrtimePresent) {
            clock.hrtime = hrtime;
          }
          return clock;
        }
        function install(config) {
          if (arguments.length > 1 || config instanceof Date || Array.isArray(config) || typeof config === "number") {
            throw new TypeError("FakeTimers.install called with " + String(config) + " install requires an object parameter");
          }
          config = typeof config !== "undefined" ? config : {};
          config.shouldAdvanceTime = config.shouldAdvanceTime || false;
          config.advanceTimeDelta = config.advanceTimeDelta || 20;
          if (config.target) {
            throw new TypeError("config.target is no longer supported. Use `withGlobal(target)` instead.");
          }
          var i, l;
          var clock = createClock(config.now, config.loopLimit);
          clock.uninstall = function() {
            return uninstall(clock, config);
          };
          clock.methods = config.toFake || [];
          if (clock.methods.length === 0) {
            clock.methods = Object.keys(timers).filter(function(key) {
              return key !== "nextTick" && key !== "queueMicrotask";
            });
          }
          for (i = 0, l = clock.methods.length; i < l; i++) {
            if (clock.methods[i] === "hrtime") {
              if (_global.process && typeof _global.process.hrtime === "function") {
                hijackMethod(_global.process, clock.methods[i], clock);
              }
            } else if (clock.methods[i] === "nextTick") {
              if (_global.process && typeof _global.process.nextTick === "function") {
                hijackMethod(_global.process, clock.methods[i], clock);
              }
            } else {
              if (clock.methods[i] === "setInterval" && config.shouldAdvanceTime === true) {
                var intervalTick = doIntervalTick.bind(null, clock, config.advanceTimeDelta);
                var intervalId = _global[clock.methods[i]](intervalTick, config.advanceTimeDelta);
                clock.attachedInterval = intervalId;
              }
              hijackMethod(_global, clock.methods[i], clock);
            }
          }
          return clock;
        }
        return {
          timers,
          createClock,
          install,
          withGlobal
        };
      }
      var defaultImplementation = withGlobal(globalObject);
      exports.timers = defaultImplementation.timers;
      exports.createClock = defaultImplementation.createClock;
      exports.install = defaultImplementation.install;
      exports.withGlobal = withGlobal;
    }
  });
  return require_fake_timers_src();
})();
