# Phonemock - a JS-Wrapper for PhoneGap #
By Alexander Heinrich
   ak@aflx.de
   http://www.aflx.de
 
   Phonegap target: 1.1.0

Use this to wrap the PhoneGap-calls in order to run your mobile project in
a browser like Google Chrome.

## What is Phonemock and what can I do with it? ##
 
Phonemock is a simple js-wrapper for PhoneGap. 
The aim is to mock (catch) all PhoneGap.exec() calls in order to handle these calls in js. 

This has the advantage, that you can run your PhoneGap project in a browser, which gives you
the possibility to debug your app with the build-in debugger of the bowser (for example 
in Google Chrome).

## Using Phonemock ##

Start Google Chrome: `google-chrome --allow-file-access-from-files --disable-web-security`

Just load phonemock.js after phonegap-*.js and call:

<pre>
Phonemock.construct();
</pre>

You can pass a config object to this function above.

### File support ###

In order to mock the whole filesystem you have to initialize it like this:

<pre>
// a file and the app directory
var file = new FileEntry();
file.name = "test.txt";
file.fullPath = "myapp/test.txt";
file.content = "Hello!";

var appDir = new DirectoryEntry();
appDir.name = "myapp";
appDir.fullPath = "myapp";
appDir.content = [ file ];

// the root
var root = new DirectoryEntry();
root.name = "sdcard";
root.fullPath = "sdcard";
root.content = [appDir];

var filesystem = new FileSystem();
filesystem.name = "sdcard";
filesystem.fullPath = "sdcard";
filesystem.root = root;

Phonemock.addFileSystem(filesystem);
</pre>

## Phonemock and plugins ##

You have to include js code for every plugin you want to wrap.
Write a function like this: 
`PM + PluginName + .prototype. + FunctionName(success, fail, params) {...};`

For example: if you use a plugin `Downloader`, which calls 
`PhoneGap.exec(win, fail, "Downloader", "downloadFile", [fileUrl, dirName, fileName, overwrite]);`
in the plugin js file, you need to mock it like this:

<pre>

PMDownloader = function() {};

PMDownloader.prototype.downloadFile = function(success, fail, params) {
  // do something
}

</pre>

## ATTENTION ##

Because Phonemock wraps every function within the browser you can get in trouble, if
you load to big or to much files etc.
Google Chrome will ask you sometimes, if you want to kill the app-tab. Give it a
chance and wait ;-) 

## RELEASE NOTES ##

### Aug 03, 2011 ###

* bugfixes and comments

## BUGS AND CONTRIBUTIONS ##

Please note, that this is a very early version of Phonemock. I will add new features one 
after another. I know...there is still much to do ;-)

If you want to contribute or if you found an error or...let me know!

## LICENCE ##

The MIT License
Copyright (c) 2011 Alexander Heinrich

Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:

The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
OR OTHER DEALINGS IN THE SOFTWARE.
