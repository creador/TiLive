TiLive
========

TiLive is a fork of TiShadow for allowing Concepto DSL users using Titanium to deploy apps, run tests or execute code snippets live across all running iOS and Android devices.

There are three parts to TiLive: the TiLive server, TiLive app and TiLive CLI which are all need.


Getting Started
===============

TiLive Install
----------------

### TiLive NPM Package

TiLive is built on [node.js](http://nodejs.org/) and is required.

TiLive can be installed via npm using the following command:

```
$  npm install -g tilive
```

**PLEASE NOTE:** The package installs titanium hooks in the post install. 
If you install with `sudo` and get the error `Unable to write config file...` use the following command:

```
$ sudo npm install -g tilive --unsafe-perm
```

Or if you want to use the master version directly from GitHub:

```
  npm install -g creador/TiLive
```

### Using the Appcelerator CLI

By default TiLive uses the (free) `titanium` and `alloy` cli's under the hood. If you are using the (paid) `appc` cli then 
use the following command after installation:

```
$ tl config --use-appc-CLI
```

### _NEW_ DUMMY'S PATH: TiLive Express

You can do _a lot_ with TiLive. Keep reading this README to find out more.
But if it is all too much at the moment and you just want to use it for
live reload you can do the following.

During install a titanium cli plugin/hook was installed for you. From your project you can just use the following command:

```
  titanium build -p android -T device --live 
```

This will launch your app in the simulator and reload with any code/style/localisation changes.

Under the hood it:
 1. starts the tilive server - `tilive server`
 2. creates and launches an appified version of your app - `tilive appify` (with extra flags)
 3. watches your code and push on any changes - `tilive @ run --update`

**MAC**: If you get the error `EMFILE: Too many opened files.`, this is because of your system's max opened file limit. For OSX the default is very low (256). Increase your limit temporarily with `ulimit -n 8192`, the number being the new max limit.

### TiLive App

To create a new titanium project use the following command:

```
  tilive app -d [destination folder]
```

e.g.

```
  mkdir ~/tiliveapp
  tilive app -d ~/tiliveapp
```

**NOTE**: In general upgrade the server side and app at
the same time (using the `tishadow app` command).

You can upgrade an existing tishadow app using the `--upgrade` flag.

Start the TiLive Server
---------------------

The server can be started by typing the following command:

```
  tilive server
```

The following options are available:

```
    -h, --help             output usage information
    -p, --port <port>      server port
    -l, --long-polling     force long polling
    -i, --internal-ip <internal-ip>  internal ip to bind to
    -s, --screenshot-path <screenshot-path>  path to save screenshot (defaults to /tmp)
    -z, --manage-versions  manage and automatically update bundles
```

If `--manage-versions` is enabled, then bundle versions are tracked and
devices that connect with an older version will automatically be
updated. When using this mode, you can use the `tishadow deploy` command
to send a new bundle to the server without pushing it to connected
devices.

### Remote Server Mode and Private Rooms

The TiLive Server supports remote hosting with configurable http
ports. It also allow for private "rooms" (much like chat rooms) so that
the TiLive server can be shared. 

The `tilive log` command is
available to tail remote server logs (in the default or selected room).

The `tilive config` command is available to set the default host, port
and room for all the relevant command below.


Start the TiLive App
----------------------

Once the server is running launch the app. For example, to launch the
app in the iPhone simulator using the Titanium CLI:

```
  cd ~/tiliveapp
  titanium build -p iphone
```

From the app just enter the ip address or hostname of the computer running the
server and hit connect. (There are also more advanced connection settings
that can be used for remote server connections.)


What you can do with TiLive
=============================

Full Application Deployment
---------------------------

Go to the root folder of your project and enter the following command to deploy an app:

```
  tilive run
```

If the app has been deployed and you want to push minor updates, use the following command:

```
  tilive run --update
```

Here are full list of options:

```
    -h, --help                           output usage information
    -u, --update                         only send recently changed files
    -a, --patch                          patch updated files without causing app restart
    -i, --inspector                      enable automatic inspection and spies
    -l, --locale <locale>                set the locale in in the TiLive app
    -j, --jshint                         analyse code with JSHint
    -t, --tail-logs                      tail server logs on deploy
    -o, --host <host>                    server host name / ip address
    -p, --port <port>                    server port
    -r, --room <room>                    server room
    -s, --skip-alloy-compile             skip automatic alloy compilation
    -f, --alloy-compile-file <filename>  compile only one alloy file
    -P, --platform <platform>            target platform
    -D, --include-dot-files              includes dot files in the bundle (defaults to false)
    -T, --target <app_name>              target TiLive app (defaults to name on tiapp.xml or moduleid on manifest)
    -c, --ticommonjs                     support for applications using the ti-commonjs library
```

The app is then cached on the device. If you need to clear the cache, use
the following command:

```
  tilive clear
```

__Some notes and limitations__

 * Only files in the Resources directory will be sent to the device
   using TiLive. That said, localization files **are** supported. (see
   options above). 
 * Native modules _can_ be supported if built into the TiShadow app
   first. (I.e., add them to the tiapp.xml of the TiShadow app.)
 * Custom fonts will be loaded if placed in the `Resources/fonts`
   directory for iOS only.
 * If there any errors about a Titanium SDK command not being found, add
   them to the Includes.js files and clean and build the TiLive app. (I
   will gradually be adding commands.)
 * Any Ti.API logs will be redirected to the server logs and webpage.


Testing / Assertions
--------------------

TiLive supports [Jasmine](http://pivotal.github.com/jasmine/) BDD tests. 
(Insipration taken from these two projects: [titanium-jasmine](https://github.com/guilhermechapiewski/titanium-jasmine/) and [jasmine-titanium](https://github.com/akahigeg/jasmine-titanium))

Include your specs in the `spec` path of your project. Ensure
the files are ending in `_spec.js`. (Note: simply write the spec without any including/requiring the jasmine library.)

To execute the tests enter the following command:

```bash
  tilive spec
```

Here are a full list of options:

```
    -h, --help                           output usage information
    -u, --update                         only send recently changed files
    -l, --locale <locale>                set the locale in in the TiLive app
    -o, --host <host>                    server host name / ip address
    -p, --port <port>                    server port
    -r, --room <room>                    server room
    -t, --type <type>                    testing library
    -j, --jshint                         analyse code with JSHint
    -x, --junit-xml                      output report as JUnit XML
    -P, --platform <platform>            target platform
    -s, --skip-alloy-compile             skip automatic alloy compilation
    -f, --alloy-compile-file <filename>  compile only one alloy file
    -D, --include-dot-files              includes dot files in the bundle (defaults to false)
    -T, --target <app_name>              target TiLive app (defaults to name on tiapp.xml or moduleid on manifest)
    -C, --clear-spec-files               clears only the spec files from the cache
    -c, --coverage <report_types>        runs code coverage, for available report_types see https://github.com/gotwarlost/istanbul#the-report-command```
```

**NEW**: You can now select the testing library to use `jasmine`, `mocha-should` or `mocha-chai`. 
The default library is `jasmine` to change that use, e.g. `tishadow config -t mocha-should`.

**NEW**: test coverage reports using instanbul is also available using the `--coverage <report_types>` flag.

The test results will be returned to the server/cli output:
![Spec Output](http://github.com/creador/TiLive/raw/master/example/spec.png)


_Alternatively (yet not preferred/depcrecated)_

TiLive also supports the use of assertions and the results are
returned either to the browser or server logs.
 
For example:

```javascript
    assert.isNumber(6, "Testing if 6 is a number");
    assert.isArray([1,2,3,4], "Testing if it is an array");
```

The following assertion are supported:
'equal', 'strictEqual', 'deepEqual', 'isTrue', 'isFalse',
'isEmpty', 'isElement', 'isArray','isObject', 'isArguments', 'isFunction',
'isString', 'isNumber', 'isFinite', 'isBoolean', 'isDate', 'isRegExp', 'isNaN', 'isNull',
'isUndefined', 'lengthOf', 'match', 'has'

Also the equivalent not assertions are available as well, e.g.
'notEqual', 'isNotString', 'isNotNumber', etc.
 

Configurable Localisation
-------------------------
TiLive supports dynamic localisation. You can also chose the locale 
you wish to use when launching your app/tests. Simply add the
two-letter language code to your command. For example:

```
  tilive run --locale es
  tilive spec --locale nl
```

TiLive REPL
-------------

The TiLive REPL is available and evaluates commands in a
persistent sand-boxed context. 

To Launch the REPL enter the following command:

```bash
  tilive repl
```
With the following options: 

```
    -h, --help         output usage information
    -o, --host <host>  server host name / ip address
    -p, --port <port>  server port
    -r, --room <room>  server room
```


`launchApp(appName)`, `closeApp()` and `clearCache()` methods available
to interact with apps cached in the TiApp app.

`require()`, `Ti.include()` and assets are relative the running app
inside the TiLive app.

**note**: you can now also pipe to the tilive repl using the `--pipe` flag. have a look 
at this [screencast](http://www.youtube.com/watch?v=f9ZLAtzJdGY)

###Spies

You can add **spies** on objects so that you can modify them from
the repl at run time. In your code add the following command:
`addSpy(name, object)`. This can be included as a comment, eg:
`//addSpy("mywindow",win)` which will be uncommented when pushed.
To get the object, simply use, e.g. `getSpy("mywindow")` from the repl.

If you want to use the web-browser based inspector and/or automatic spy insertion,
then use the `--inspector` flag with `run` or `config`. 

Screenshots
-----------

You can capture screenshots of all connected devices using the following command: 

```
  $ tilive screenshot
```

The screenshots will be saved in `png` format in the `/tmp` directory or the path
configured using the `--screenshot-path` flag when starting the server.

###Screencast mode

Instead of saving the screenshots you can stream them to the browser. Use the following command:

```
  $ tilive screenshot --screencast 1000 --scale 0.1
```

In the above example a screenshot is sent every 1000ms and scales the images to 10% of their height/width.
Go to: `http://localhost:3000/screencast` to view the screencast.


Code Snippets Via Webpage
-------------------------
 
Enter the following address in a browser window:

```
    http://localhost:3000/
```

In the editor you can enter code and press Command+s to deploy the code
snippet to all connected devices. Have a look at the demo [video](http://www.youtube.com/watch?v=xUggUXQArUM).

Coding from the webpage works much like the REPL and variables
are stored in a sand-boxed context. See the next section.


TiLive Appify
---------------

The `tilive appify` command can be used to create a
stand-alone app that is integrated with TiLive. It automatically
launches the contained tilive bundle and connects to a pre-configured
server. The allows connecting to the deployed app via the repl and/or
push upgrades.

```
  Usage: appify [options]

  Options:

    -h, --help                output usage information
    -d, --destination <path>  target path for generated project
    -o, --host <host>         set server host name / ip address
    -p, --port <port>         set server port
    -r, --room <room>         set server room
```

**NEW**: if you want to quickly create and launch/deploy and appified app you can use
the tilive titanium hook. For example

~~~
$ ti build -p ios -F ipad -T device --appify
~~~

TiLive CLI defaults
---------------------

You can use the `tilive config` command to set some tilive cli defaults.

The following are some of the options you can set:

~~~
    -h, --help                           output usage information
    -o, --host <host>                    set default server host name / ip address
    -p, --port <port>                    set default server port
    -r, --room <room>                    set default server room
    -i, --inspector                      enable automatic inspection and spies
    -b, --boost                          use super fast selective alloy compilation
    -t, --type <type>                    default testing library
    -w, --watch-delay <millis>           time to wait before responding to for changes (default: 0)
    -i, --watch-interval <millis>        time to wait between checking files for changes (default: 100)
    -x, --watch-exclude <glob>           files to exclude from watch
    -n, --network-interface <interface>  set default network interface (used in express mode)
~~~


Launch From Web
---------------

_Currently only working on iOS_

You can also use TiLive to bundle an app and launch it from a web
page. Use the command `tilive bundle` to bundle the app for a
TiLive distribution. Then include a link to the bundle in your webpage
using the following format, e.g. : `tilive://mydomain.com/bundle.zip`.
Tapping on the link from your browser should launch the app in TiLive.


VIM Shortcuts
-------------
Those using vim/gvim/mvim for development might want to add these
shortcuts (or similar) to the .vimrc/.gvimrc files. It add the shortcuts, F6
to save and do a tilive update, and Shift+F6 to save and perform a full
tilive deploy:

```
    :map <F6> <Esc>:w<CR>:!tilive run --update<CR>a
    :imap <F6> <Esc>:w<CR>:!tilive run --update<CR>a
    :map <S-F6> <Esc>:w<CR>:!tilive run<CR>a
    :imap <S-F6> <Esc>:w<CR>:!tilive run<CR>a 
```


Credits
=======

The server code uses the following and are included:

 * [node.js](http://nodejs.org/)
 * [express](http://expressjs.com/)
 * [socket.io](http://socket.io)
 * [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
 * [Ace](https://github.com/ajaxorg/ace)

The app is built using [Appcelerator](http://www.appcelerator.com/)'s
Titanium, Creador OPEN and Concepto DSL.

Third Party Modules
-------------------

### Websockets/Socket.IO
####iPhone/Android
Copyright 2012 jordi domenech jordi@iamyellow.net Apache License, Version 2.0

[Github Repo](https://github.com/iamyellow/tiws)


### ZIP Modules
####iPhone/Android

Now using ti.compression:
[titanium_modules](https://github.com/appcelerator/titanium_modules)

Feedback appreciated.

@creador




