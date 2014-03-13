(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
var app;

app = angular.module('cachedResource', ['ngResource']);

app.factory('cachedResource', [
  '$resource', '$timeout', '$q', function($resource, $timeout, $q) {
    var defaultActions, localStorageKey, readCache, writeCache;
    localStorageKey = function(url, parameters) {
      var name, value;
      for (name in parameters) {
        value = parameters[name];
        url = url.replace(":" + name, value);
      }
      return url;
    };
    readCache = function(action, url) {
      return function(parameters) {
        var cached, deferred, item, key, resource, _i, _len;
        resource = action.apply(null, arguments);
        resource.$httpPromise = resource.$promise;
        if (window.localStorage == null) {
          return resource;
        }
        if (angular.isFunction(parameters)) {
          parameters = null;
        }
        key = localStorageKey(url, parameters);
        resource.$httpPromise.then(function(response) {
          return localStorage.setItem(key, angular.toJson(response));
        });
        cached = angular.fromJson(localStorage.getItem(key));
        if (cached) {
          if (angular.isArray(cached)) {
            for (_i = 0, _len = cached.length; _i < _len; _i++) {
              item = cached[_i];
              resource.push(item);
            }
          } else {
            angular.extend(resource, cached);
          }
          deferred = $q.defer();
          resource.$promise = deferred.promise;
          deferred.resolve(resource);
        }
        return resource;
      };
    };
    writeCache = function(action, url) {
      return function(parameters) {
        var resource, writeArgs;
        writeArgs = arguments;
        resource = action.apply(null, writeArgs);
        if (window.localStorage == null) {
          return resource;
        }
        return resource;
      };
    };
    defaultActions = {
      get: {
        method: 'GET'
      },
      query: {
        method: 'GET',
        isArray: true
      },
      save: {
        method: 'POST'
      },
      remove: {
        method: 'DELETE'
      },
      "delete": {
        method: 'DELETE'
      }
    };
    return function() {
      var CachedResource, Resource, action, actions, arg, args, name, paramDefaults, url, _ref;
      args = Array.prototype.slice.call(arguments);
      url = args.shift();
      while (args.length) {
        arg = args.pop();
        if (typeof arg[Object.keys(arg)[0]] === 'object') {
          actions = arg;
        } else {
          paramDefaults = arg;
        }
      }
      if (actions == null) {
        actions = defaultActions;
      }
      if (paramDefaults == null) {
        paramDefaults = {};
      }
      Resource = $resource.call(null, url, paramDefaults, actions);
      CachedResource = {};
      for (name in actions) {
        action = actions[name];
        if (action.method === 'GET') {
          CachedResource[name] = readCache(Resource[name].bind(Resource), url);
        } else if ((_ref = action.method) === 'POST' || _ref === 'PUT' || _ref === 'DELETE') {
          CachedResource[name] = writeCache(Resource[name].bind(Resource), url);
        } else {
          CachedResource[name] = Resource[name];
        }
      }
      return CachedResource;
    };
  }
]);

app;

},{}]},{},[1])