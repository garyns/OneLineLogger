/**
 * A simple, no fuss logging library for Node.
 * 
 * Web Browser Note - this library is untested and unexpected to work in a Web Browser.
 *                    it was designed specifically for Node applications.
 * 
 * Examples:
 * 
 *   // Default Logger
 *   const logger = require('onelinelogger')
 *   logger.info("My text to log")
 * 
 *   // Named Logger
 *   const logger = require('onelinelogger').create("Database")
 *   // ... some code ...
 *   logger.error("Failed to connect", err)
 * 
 *   // Names Logger - creating multiple
 *   const logger = require('onelinelogger')
 *   const dbLogger = logger.create("Database")
 *   const apiLogger = logger.create("API")
 * 
 *  // Enable or disable global debug logging (on by default)
 *  // Debug logging is enabled or disabled for ALL logger instances
 *  // (Different logger instances cannot have different debug logging settings)
 *  const logger = require('onelinelogger')
 *  const dbLogger = logger.create("Database")
 *  const apiLogger = logger.create("API")
 * 
 *  // Disable global debug logging
 *  logger.setGlobalDebugging(false) 
 *
 *  // The following would also disable global debug logging
 *  // dbLogger.setGlobalDebugging(false) 
 *  // apiLogger.setGlobalDebugging(false)
 * 
 *  concole.log(logger.isDebug())    // false
 *  concole.log(dbLogger.isDebug())  // false
 *  concole.log(apiLogger.isDebug()) // false
 * 
 *  dbLogger.debug("Some debug text")  // will not be logged
 *  apiLogger.debug("Some debug text") // will not be logged
 * 
 * // Logging to a file (all logger instances will log to this file)
 * // Logging still occurs to the console.
 * const logger = require('onelinelogger')
 * logger.setGlobalFile("./logs/log.txt")
 * logger.warn("Something is not quite right...", data) // logged to file and console
 * 
 * // Replace console.log(), info(), warn(), error() and debug()
 * // This is a quick way to upgrade a program using console logging functions
 * // to the onelinelogger library.
 * const logger = require('onelinelogger')
 * logger.replaceConsole()
 * console.warn("Something is not quite right...", data) // Now mapped to logger.warn()
 */
var fs = require("fs");
var os = require("os");
var colors = require("colors");
var util = require('util')

console._log = console.log;

// Global settings that affect ALL instances of Logger.
var prefixLen = 0;
var logLevel = 3 // Logger.INFO
var file = null;

function Logger() {
    this.prefix = "";
}

// Log Levels
Logger.DEBUG = 3
Logger.INFO = 2
Logger.WARN = 1
Logger.ERROR = 0

// Log Levels as Strings
const logLevelStrings = ['ERROR', 'WARN', 'INFO', 'DEBUG']

/**
 * Create a custom Logger instance.
 */
Logger.create = function(prefix) {
    var logger = new Logger();
    logger.setPrefix(prefix);
    return logger;
}

/**
 * Set min width of prefix text. Eg 0 -> [MON], 5 -> [MON  ].
 * Tweaking this helps keep text lining up in your log output.
 */
Logger.prototype.setGlobalPrefixLength = function(len) {
    
    if (len === undefined) {
        len = 0;
    }
    
    prefixLen = parseInt(len);
    return this;
}

/**
 * Set logging level.
 * @param {(Number|String)} level logging level 3 (DEBUG), 2 (INFO), 1 (WARN), 0 (ERROR)
 *   or use Logger.DEBUG, Logger.INFO, Logger.WARN or Logger.ERROR
 */
 Logger.prototype.setLevel = function(level) {

    if (typeof(level) === 'string' && logLevelStrings.includes(level.toUpperCase())) {
        level = logLevelStrings.indexOf(level.toUpperCase())
    } else {
        level = parseInt(level)
    }

    if (isNaN(level) || level < Logger.ERROR || level > Logger.DEBUG) {
        throw new Error("Log level must be between 0 and 3, or a one of the strings ERROR, WARN, INFO or DEBUG. Constants available are Logger.DEBUG, Logger.INFO, Logger.WARN, Logger.ERROR")
    }    

    logLevel = level
    return this;
}

/**
 * Get logging level
 */
 Logger.prototype.getLevel = function() {
    return logLevel
 }

/**
 * Get logging level name
 * @returns {String} ERROR, WARN, INFO or DEBUG
 */
 Logger.prototype.getLevelName = function() {
    return logLevelStrings[logLevel]
 } 

 /**
 * Is debug logging level.
 */
 Logger.prototype.isDebug = function() {
    return logLevel === Logger.DEBUG
 }

/**
 * Set weather .debug() calls are logged or not.
 * @deprecated Use setLevel(Logger.DEBUG)
 */
Logger.prototype.setGlobalDebugging = function(on) {
    Logger.warn('setGlobalDebugging() is deprecated. Please use setLevel(Logger.DEBUG)')
    logLevel = Logger.DEBUG
    return this;
}

/**
 * Set prefix.
 */
Logger.prototype.setPrefix = function(p) {
    
    if (p === undefined || p === null) {
        this.prefix = "";
    } else {
        this.prefix = p;
    }
 
    return this;
}

/**
 * Specify output file for logging. Null to disable.
 */
Logger.prototype.setGlobalFile = function(f) {
    file = f;
}

Logger.prototype.log = function () {
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("LOG")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = util.inspect(arguments[i]);
        }
    }  

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr);
    return this;
};

Logger.prototype.highlight = function () {
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("*****")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = util.inspect(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.bgGreen);
    return this;
};

// Aliases for highlight
Logger.prototype.silly = Logger.prototype.highlight;
Logger.prototype.boo = Logger.prototype.highlight;

Logger.prototype.info = function () {

    if (logLevel < Logger.INFO) {
        return
    }
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("INFO")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = util.inspect(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr);
    return this;
};

Logger.prototype.error = function () {

    if (logLevel < Logger.ERROR) {
        return
    }
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("ERROR")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = util.inspect(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.red.bold);
    return this;
};

Logger.prototype.warn = function () {

    if (logLevel < Logger.WARN) {
        return
    }
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("WARN")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = util.inspect(arguments[i]);
        }
    }

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.yellow);
    return this;
};

Logger.prototype.debug = function () {
    
    if (logLevel < Logger.DEBUG) {
        return
    }
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = util.inspect(arguments[i]);
        }
    }
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("DEBUG")
    );

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.gray);
    return this;
};

/**
 * Replace/Add console functions with Logger functions.
 */
Logger.prototype.replaceConsole = function() {
    console.log = this.log.bind(this);
    console.highlight = this.highlight.bind(this);
    console.boo = this.highlight.bind(this); // alias for highlight
    console.silly = this.highlight.bind(this); // alias for highlight
    console.info = this.info.bind(this);
    console.warn = this.warn.bind(this);
    console.error = this.error.bind(this);
    console.debug = this.debug.bind(this);
    return this;
}

Logger.prototype.getPrefix = function(level) {
    
    level = padLeft(5, level, " "); // 5 = ERROR.length
 
    if (this.prefix === "") {
        return "[" + level + "]";
    }
    
    var p = this.prefix;
    
    if (prefixLen > 0) {
        p = padLeft(prefixLen, p, " ");
    }
    
    return "[" + level + "]" + " [" + p + "]";   
}

/**
 * Pad a string.
 */
function padLeft(width, string, padding) { 
  return (width <= string.length) ? string : padLeft(width, string + padding, padding);
}

/**
 * Appends line to a file if Logger.file is specified.
 */
function writeLogFile(file, line) {
     
    if (file === undefined || file === null) {
        return;
    }
    
    fs.appendFile(file, line + os.EOL, {}, function() {
        //
    });
}

/**
 * Default static Logger instance.
 */
var defaultLogger = new Logger();

Logger.log = defaultLogger.log.bind(defaultLogger);
Logger.debug = defaultLogger.debug.bind(defaultLogger);
Logger.info = defaultLogger.info.bind(defaultLogger);
Logger.warn = defaultLogger.warn.bind(defaultLogger);
Logger.error = defaultLogger.error.bind(defaultLogger);
Logger.highlight = defaultLogger.highlight.bind(defaultLogger);
Logger.silly = defaultLogger.highlight.bind(defaultLogger); // Alias for highlight
Logger.boo = defaultLogger.highlight.bind(defaultLogger); // Alias for highlight

Logger.replaceConsole = defaultLogger.replaceConsole.bind(defaultLogger);
Logger.setPrefix = defaultLogger.setPrefix.bind(defaultLogger);
Logger.setLevel = defaultLogger.setLevel.bind(defaultLogger);
Logger.getLevel = defaultLogger.getLevel.bind(defaultLogger);
Logger.getLevelName = defaultLogger.getLevelName.bind(defaultLogger);
Logger.isDebug = defaultLogger.isDebug.bind(defaultLogger);
Logger.setGlobalDebugging = defaultLogger.setGlobalDebugging.bind(defaultLogger);
Logger.setGlobalFile = defaultLogger.setGlobalFile.bind(defaultLogger);
Logger.setGlobalPrefixLength = defaultLogger.setGlobalPrefixLength.bind(defaultLogger);

module.exports = Logger;


