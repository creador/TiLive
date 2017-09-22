/*
 * Copyright (c) 2011-2014 YY Digital Pty Ltd. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

var spawn = require('child_process').spawn;
var os = require('os');
var path = require('path');
var fs = require('fs');
var commands = require('../commands/shadow');
var ipselector = require('ipselector');
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

exports.cliVersion = '>=3.2.0';
exports.version = '1.0';
exports.title = 'TiLive Express';
exports.desc  = 'For very basic and quick tilive usage';
exports.extendedDesc = 'Requires tilive: `[sudo] npm install -g tishadow`';

exports.init = init;
var logger;
function init(_logger, config, cli) {
  // users who are on the wrong SDK without this being set... TiShadow would just fail to work at all
  cli.addHook('build.pre.compile', preCompileHook);
  cli.addHook('cli:pre-validate', preValidateHook);

  logger = _logger;
}
function preValidateHook(build,finished) {
  if (build.cli.argv.$_.indexOf('--shadow') !== -1 ||
      build.cli.argv.$_.indexOf('--tishadow') !== -1 ||
      build.cli.argv.$_.indexOf('--tilive') !== -1 ||
      build.cli.argv.$_.indexOf('--appify') !== -1) {
    build.cli.config.cli.failOnWrongSDK = true;
  }
  finished();
}
function preCompileHook(build, finished) {
  if (build.cli.argv.$_.indexOf('--shadow') === -1 &&
      build.cli.argv.$_.indexOf('--tishadow') === -1 &&
      build.cli.argv.$_.indexOf('--tilive') === -1 &&
      build.cli.argv.$_.indexOf('--appify') === -1) {
    return finished();
  }

  var index;
  var isExpress = build.cli.argv.$_.indexOf('--appify') === -1;

  // pass through arguments
  var args = build.cli.argv.$_
  .filter(function(el) { return el !== "--shadow" && el !== "--tishadow" && el !== "--tilive" && el !== "--appify"});

  // temp appify build path
  var new_project_dir = path.join(build.projectDir, 'build', 'appify');

  // existing tishadow config?
  var config_path = path.join(home,'.tishadow.json');
  var config = fs.existsSync(config_path) ? require(config_path) : {};

  if ((index = args.indexOf('--host')) >= 0 || (index = args.indexOf('-o')) >= 0) {
    config.host = args[index + 1];
    args.splice(index, 2);
  }

  if ((index = args.indexOf('--project-dir')) >= 0 || (index = args.indexOf('-d')) >= 0) {
    args[index + 1] = new_project_dir;
  } else {
    args.push("--project-dir", new_project_dir);
  }

  if (build.certDeveloperName && build.provisioningProfileUUID) {
    args.push("--developer-name");
    args.push(build.certDeveloperName);
    args.push("--pp-uuid");
    args.push(build.provisioningProfileUUID);
  }

  // appify -> express
  function launch(ip_address){
    commands.startAppify(logger, new_project_dir, build.cli.argv.platform, ip_address, function() {
      if (args.indexOf("-p") === -1 && args.indexOf("--platform") === -1) {
        args.push("-p");
        args.push(build.cli.argv.platform);
      }
      commands.buildApp(logger,args)
      if (isExpress) {
        commands.startServer(logger);
        commands.startWatch(logger, build.cli.argv.platform, ip_address);
      }
    });
  }

  if (config.host) {
    launch(config.host);
  } else {
    // get ip address
    var ip_address = ipselector.selectOne({
      family : 'IPv4',
      internal : false,
      networkInterface : config.networkInterface? config.networkInterface:undefined
    },function(ip_address) {
      launch(ip_address);
    });
  }
}

