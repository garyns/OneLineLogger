/**
 * A simple, no fuss logging library for Node.
 * 
 * Web Browser Note - this library is untested and unexpected to work in a Web Browser.
 *                    it was designed spcifically for Node applications.
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
 *  // The following would also diable global debug logging
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
var debugging = true;
var file = null;

function Logger() {
    this.prefix = "";
}


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
 * Set weather .debug() calls are logged or not.
 */
Logger.prototype.setGlobalDebugging = function(on) {
    debugging = on;
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
            //arguments[i] = JSON.stringify(arguments[i]);
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
            // arguments[i] = JSON.stringify(arguments[i]);
            arguments[i] = util.inspect(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.bgGreen);
    return this;
};

Logger.prototype.info = function () {
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("INFO")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            // arguments[i] = JSON.stringify(arguments[i]);
            arguments[i] = util.inspect(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr);
    return this;
};

Logger.prototype.error = function () {
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("ERROR")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            //arguments[i] = JSON.stringify(arguments[i]);
            arguments[i] = util.inspect(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.red.bold);
    return this;
};

Logger.prototype.warn = function () {
    
    Array.prototype.unshift.call(
        arguments,
        new Date().toLocaleString(),
        this.getPrefix("WARN")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            // arguments[i] = JSON.stringify(arguments[i]);
            arguments[i] = util.inspect(arguments[i]);
        }
    }

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.yellow);
    return this;
};

Logger.prototype.debug = function () {
    
    if (!debugging) {
        return this;
    }
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            // arguments[i] = JSON.stringify(arguments[i]);
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
 * Check if debug logging enabled
 */
 Logger.prototype.isDebug = function() {
    return debugging
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

Logger.replaceConsole = defaultLogger.replaceConsole.bind(defaultLogger);
Logger.setPrefix = defaultLogger.setPrefix.bind(defaultLogger);
Logger.isDebug = defaultLogger.isDebug.bind(defaultLogger);
Logger.setGlobalDebugging = defaultLogger.setGlobalDebugging.bind(defaultLogger);
Logger.setGlobalFile = defaultLogger.setGlobalFile.bind(defaultLogger);
Logger.setGlobalPrefixLength = defaultLogger.setGlobalPrefixLength.bind(defaultLogger);

module.exports = Logger;
