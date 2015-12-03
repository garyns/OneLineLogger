var fs = require("fs");
var os = require("os");
var colors = require("colors");

console._log = console.log;

// Global settings that affect ALL instances of logger.
var prefixLen = 0;
var debugging = true;
var file = null;

function Logger(prefix) {
    //if (!(this instanceof Logger)) return new Logger(prefix);
    
    this.config = {
        prefix: ""
    };
     
    this.setPrefix(prefix);
}

/**
 * Set min width of prefix text. Eg 0 -> [MON], 5 -> [MON  ].
 * Tweaking this helps keep text lining up in your log output.
 */
Logger.setGlobalPrefixLength = function(len) {
    
    if (len === undefined) {
        len = 0;
    }
    
    prefixLen = parseInt(len);
    return this;
}

/**
 * Set weather .debug() calls are logged or not.
 */
Logger.setGlobalDebugging = function(on) {
    debugging = on;
    return this;
}

/**
 * Set prefix.
 */
Logger.prototype.setPrefix = function(p) {
    
    if (p === undefined || p === null) {
        this.config.prefix = "";
    } else {
        this.config.prefix = p;
    }
 
    return this;
}

/**
 * Specify output file for logging. Null to disable.
 */
Logger.setGlobalFile = function(f) {
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
            arguments[i] = JSON.stringify(arguments[i]);
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
        this.getPrefix("SUCCESS")
    );
    
    for (i in arguments) {
        if (typeof arguments[i] === "object") {
            arguments[i] = JSON.stringify(arguments[i]);
        }
    }    

    argumentsStr =  Array.prototype.join.call(arguments, " ");
    writeLogFile(file, argumentsStr);
    console._log(argumentsStr.green);
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
            arguments[i] = JSON.stringify(arguments[i]);
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
            arguments[i] = JSON.stringify(arguments[i]);
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
            arguments[i] = JSON.stringify(arguments[i]);
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
            arguments[i] = JSON.stringify(arguments[i]);
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
Logger.replaceConsole = function() {
    console.log = this.log;
    console.highlight = this.highlight;
    console.info = this.info;
    console.warn = this.warn;
    console.error = this.error;
    console.debug = this.debug;
    return this;
}

/**
 * Appends line to a file if Logger.file is specified.
 */
writeLogFile = function(file, line) {
     
    if (file === undefined || file === null) {
        return;
    }
    
    fs.appendFile(file, line + os.EOL, {}, function() {
        //
    });
}

Logger.prototype.getPrefix = function(level) {
    
    level = padLeft(7, level, " "); // 7 = SUCCESS.length
 
    if (this.config.prefix === "") {
        return "[" + level + "]";
    }
    
    var p = this.config.prefix;
    
    if (prefixLen > 0) {
        p = padLeft(prefixLen, p, " ");
    }
    
    return "[" + level + "]" + " [" + p + "]";
    
}

function padLeft(width, string, padding) { 
  return (width <= string.length) ? string : padLeft(width, string + padding, padding);
}


var defaultLogger = new Logger();

Logger.log = defaultLogger.log.bind(defaultLogger);
Logger.info = defaultLogger.info.bind(defaultLogger);
Logger.highlight = defaultLogger.highlight.bind(defaultLogger);
Logger.warn = defaultLogger.warn.bind(defaultLogger);
Logger.error = defaultLogger.error.bind(defaultLogger);
Logger.debug = defaultLogger.debug.bind(defaultLogger);
//Logger.setDebugging = defaultLogger.setDebugging.bind(defaultLogger);
Logger.setPrefix = defaultLogger.setPrefix.bind(defaultLogger);
//Logger.setFile = defaultLogger.setFile.bind(defaultLogger);

Logger.create = function(prefix, len) {
    return new Logger(prefix, len);
}

module.exports = Logger;




