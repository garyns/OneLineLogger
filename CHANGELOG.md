# OneLineLogger Change Log

## 1.1.3

* `setLevel()` can now take a one of the strings `DEBUG`, `INFO`, `WARN` or `ERROR` in addition to a Number between 0 and 3 (0 to 3 relating to the constants `logger.DEBUG`, etc )

## 1.1.2

* Logging level can be set by `setLevel(level)`, where parameter `level` is one of `logger.DEBUG`, `logger.INFO`, `logger.WARN`, `logger.ERROR`
* `setGlobalDebugging()` is not deprecated. Use `setLevel(logger.DEBUG)` instead.
* `logger.boo()` as an alias to `logger.highlight()`

## 1.0.1

* Added Install Instructions


## 1.0.0

* Initial Release
