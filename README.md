# OneLineLogger
Simple Node logging to upgrade and extend console.log()

## Installing

##### NPM
```
npm install onelinelogger
```
##### GIT
Clone from GIT and install dependencies.
```
git clone https://github.com/garyns/OneLineLogger.git
cd OneLineLogger
npm install
```

## Examples

##### Basic Usage
```js
// Variable logger is considered the 'default logger' instance. Custom loggers are discussed later.
var logger = require("onelinelogger");

logger.log("Call to logger.log()");
logger.info("Call to logger.info()");
logger.warn("Call to logger.warn()");
logger.error("Call to logger.error()");
logger.debug("Call to logger.debug()");
logger.highlight("Call to logger.highlight()");
```

Here is the output:

![Console Output](https://raw.githubusercontent.com/garyns/OneLineLogger/master/mdassets/Console1-BasicLogger.jpg)


##### Overloading console.log() and related functions
```js
var logger = require("onelinelogger");

// Before Overloading
console.log("Call to console.log()");
console.info("Call to console.info()");
console.warn("Call to console.warn()");
console.error("Call to console.error()");

// Overload with default logger
logger.replaceConsole();

console.log("Call to console.log()");
console.info("Call to console.info()");
console.warn("Call to console.warn()");
console.error("Call to console.error()");
console.debug("Call to console.debug()");
console.highlight("Call to console.highlight()");
```

Here is the output (spacing added):

![Console Output](https://raw.githubusercontent.com/garyns/OneLineLogger/master/mdassets/Console3-ConsoleOverload.jpg)

##### Custom Logger Instance
Create custom loggers to help associate log entries with different parts of your code.
```js
// Default Logger instance
var logger = require("onelinelogger");

// Custom Logger instance
// [MY_LOGGER] is now added to every line
var myLogger = logger.create("MY_LOGGER");

myLogger.log("Call to myLogger.log()");
myLogger.info("Call to myLogger.info()");
myLogger.warn("Call to myLogger.warn()");
myLogger.error("Call to myLogger.error()");
myLogger.debug("Call to myLogger.debug()");
myLogger.highlight("Call to myLogger.highlight()");


// Alternatively, you could...
var myLogger2 = require("onelinelogger").create("MY_LOGGER2");

```

Here is the output:

![Console Output](https://raw.githubusercontent.com/garyns/OneLineLogger/master/mdassets/Console2-CustomLogger.jpg)

You can change the 'prefix' of a logger by calling `setPrefix()`.
```js
var logger = require("onelinelogger");

// Output of default logger now prefixed with [MAIN]
logger.setPrefix("MAIN");

// Customer Logger - [MY_LOGGER] is added to every line...
var myLogger = logger.create("MY_LOGGER");

// ... And now it's [THEIR_LOGGER]
myLogger.setPrefix("THEIR_LOGGER");
```

##### Global Settings
These settings affect ALL logger instances - that is the default logger and any custom loggers you create.
```js
var logger = require("onelinelogger");

// Append all output to a file
logger.setGlobalFile("log.txt");

// Stop logging to a file
logger.setGlobalFile(null);

// Set the length of the prefix text
// Tweaking this property helps you keep your text lining up
// Eg 0 -> [MAIN], where 10 -> [MAIN     ]
logger.setGlobalPrefixLength(10);

// Supress (false) or show (true) calls to .debug()
// Debug logging is on by default.
logger.setGlobalDebugging(true);

// Check if global debugging is enabled.
const debugging = logger.isDebug();
```

