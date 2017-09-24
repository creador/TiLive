/*
 * Copyright (c) 2011-2014 YY Digital Pty Ltd. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

var log = require("/api/Log");

var TiShadowReporter = function(onComplete) {
	this.onComplete = onComplete;
};

var ansi = {
  green: '\x1B[32m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  none: '\x1B[0m',
  white: '\x1B[37m',
  bold_on:'\x1B[1m',
  bold_off:'\x1B[22m',
};

function summaryLine(passed, failed, type) {
  if (failed === 0) {
    log.pass("√ "+ passed + " " + type + "(s) completed.");
  } else {
    log.fail("x "+ failed + " of " + (passed + failed) + " " + type + "(s) failed."); 
  }
}

TiShadowReporter.prototype = {
  reportRunnerStarting: function () {
    log.test("Runner Started");
    this.total = {
      passed: 0,
      failed: 0
    };
    this.level = 0;
    this.current = {
      description: "",
      parent: null
    };

  },
  reportRunnerResults: function () {
    log.test("");
    summaryLine(this.total.passed, this.total.failed, "spec");
    
    this.onComplete();
    log.test("Runner Finished");
  },
  reportSpecStarting: function (spec) {
    if (spec.suite.description !== this.current.description) {
      if (spec.suite.description === this.current.parent) {
        this.current.parent = null;
        log.test("");
      } else {
        log.test("");
        log.test(ansi.bold_on + (this.level === 0 ? "" : "  ") +  spec.suite.description + ansi.bold_off);
        if (this.level !== 0 && this.current.parent === null) {
          this.current.parent = this.current.description;
        };
        this.level++;
      }
      this.current.description = spec.suite.description;
    }
  },
  reportSpecResults: function(spec) {
    if (spec.results().passed()) {
      log.test(ansi.green + "    √ " + ansi.none + spec.description);
      this.total.passed += 1;
    } else {
      this.total.failed += 1;
    }
    var results = spec.results().getItems();
    results.forEach(function(result) {
      if (result.type === "log") {
        log.test(result.toString());
      } else if (result.type === 'expect' && (result.passed != null) && !result.passed()) {
        log.fail(ansi.red + "    X " + ansi.none + spec.description);
        log.fail(ansi.red + "      => " + result.message + ansi.none);
      }
    });
  },
  reportSuiteResults: function(suite) {
    var results = suite.results();
    if (!suite.parentSuite) {
      summaryLine(results.passedCount, results.totalCount-results.passedCount, "test");
    }
    this.level--;
  },
  log: function(str) {
    log.info("  " + str);
  }
};

module.exports = TiShadowReporter;
