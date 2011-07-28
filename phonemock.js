/**
 * Phonemock
 * =========
 * 
 * @author 	Alexander Keller
 *  		ak@aflx.de
 *  		http://www.phonemock.com
 *  
 * Phonegap target: 1.0.0rc3
 * 
 * Use this to wrap the PhoneGap-calls in order to run your mobile project in
 * any WebKit Browser like Google Chrome.
 * 
 * The MIT License
 * Copyright (c) 2011 Alexander Keller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * software and associated documentation files (the "Software"), to deal in the Software 
 * without restriction, including without limitation the rights to use, copy, modify, 
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
 * permit persons to whom the Software is furnished to do so, subject to the following 
 * conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

Phonemock = function() {
};

Phonemock.constructors = [];
Phonemock.defaultImage = "http://www.aflx.de/aflx_logo_109x80.png";

/**
 * Call this function to init Phonemock!
 * You can pass a config object to add properties to Phonemock.
 */
Phonemock.construct = function(config) {
	if (config) {
		for (var attr in config) {
			Phonemock[attr] = config[attr];
	    }
	}
	
	// Execute all constructor-functions
	for (var i = 0; i < Phonemock.constructors.length; i++) {
		Phonemock.constructors[i]();
	}
};

/**
 * These functions are the pendants to the Phonegap Constructors.
 */
Phonemock.addConstructor = function(func) {
	Phonemock.constructors.push(func);
};

/**
 * Add the navigator and app object.
 */
Phonemock.addConstructor(function(){
	if (!navigator)
		navigator = {};
	
	if (!navigator.app)
		navigator.app = {};
});

/**
 * If you need FileSystem access, then you need to add a valid 
 * filestructure/FileSystem object.
 */ 
Phonemock.addFileSystem = function(fileSystem) {
	PMFile.fileSystem = fileSystem;
};

/**
 * Just for globally handling missing result-function.
 */
Phonemock.success = function(success, result) {
	if (success)
		success(result);
	else
		console.log("No success function defined: Success: " + result);
};

/**
 * Just for globally handling missing result-function.
 */
Phonemock.fail = function(fail, error) {
	if (fail)
		fail(error);
	else
		console.log("No failure function defined: Fail: " + error.code);
};

/**
 * This is the link between the app and Phonemock. Instead of calling
 * Phonegap functions the calls are redirected to the Phonemock pendants.
 */
PhoneGap.exec = function(success, fail, type, call, params) {
	type = type.replace(/\s+/g,'');
	console.log("PhoneGap.exec call: " + call + " of " + type);
	var execClass = new window["PM" + type]();
	execClass[call](success, fail, params);
};

/*******************************************************************************
 * 
 * Overridden PhoneGap JS
 * 
 ******************************************************************************/

/**
 * I had to override this because I think you will get in trouble if you have
 * a file and a directory with the same name! So we have to decide if we have
 * a directory or a file to delete.
 */
DirectoryEntry.prototype.remove = function(successCallback, errorCallback) {
    PhoneGap.exec(successCallback, errorCallback, "File", "remove", [this.fullPath, this.isFile]);
};

/*******************************************************************************
 * 
 * Accelerometer
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Camera
 * 
 ******************************************************************************/

Phonemock.addConstructor(function() {
    if (typeof navigator.camera === "undefined") {
        navigator.camera = new Camera();
    }
});

PMCamera = function() {
};

PMCamera.prototype.takePicture = function(success, fail, params) {
	var quality = params[0];
	var destinationType = params[1];
	var sourceType = params[2];
	
	success("http://www.aflx.de/aflx_logo_109x80.png");
};

/*******************************************************************************
 * 
 * Capture
 * 
 ******************************************************************************/

Phonemock.addConstructor(function(){
	if (typeof navigator.device === "undefined") {
		navigator.device = window.device = new Device();
	}
	if (typeof navigator.device.capture === "undefined") {
		navigator.device.capture = window.device.capture = new Capture();
	}
});

PMCapture = function() {
};

PMCapture.prototype.captureImage = function(success, fail, options) {
	var limit = options.limit;
	var mediaFile = new MediaFile();
	mediaFile.name = "aflx_logo";
	mediaFile.fullPath = Phonemock.defaultImage;
	mediaFile.type = "png";
	mediaFile.lastModifiedDate = new Date();
	mediaFile.size = 100;
	
	success([mediaFile]);
};

/*******************************************************************************
 * 
 * Compass
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Connection
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Contacts
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Device
 * 
 ******************************************************************************/

PMDevice = function() {
};

PMDevice.prototype.getDeviceInfo = function(success, fail, params) {
	var info = Object({
		uuid: "82517-phone-mock",
		version: "0.23",
		platform: "bowser",
		name: "phonemock",
		phonegap: "1.0.0rc3"
	});
	
	success(info);
};

/*******************************************************************************
 * 
 * Events
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * File & Directory
 * 
 ******************************************************************************/

PMFile = function() {
};

// The filesystem, which contains all files and dirs
PMFile.fileSystem = null;
// This is the content of a file or directory!
PMFile.prototype.content = null;

/**
 * Add FileSystem to Phonemock
 */
Phonemock.addConstructor(function(){
	var pgLocalFileSystem = new LocalFileSystem();
	// Needed for cast methods
    if(typeof window.localFileSystem == "undefined") 
    	window.localFileSystem  = pgLocalFileSystem;
    if(typeof window.requestFileSystem == "undefined") 
    	window.requestFileSystem  = pgLocalFileSystem.requestFileSystem;
    if(typeof window.resolveLocalFileSystemURI == "undefined") 
    	window.resolveLocalFileSystemURI = pgLocalFileSystem.resolveLocalFileSystemURI;
});

//------------------------------------------------------------------------------
// LOCALFILESYSTEM
//------------------------------------------------------------------------------

PMFile.prototype.requestFileSystem = function(success, fail, params) {
	Phonemock.success(success, PMFile.fileSystem);
};

PMFile.prototype.resolveLocalFileSystemURI = function(success, fail, params) {
	var uri = params[0];
	console.log("Function not implemented yet: resolveLocalFileSystemURI");
};

//------------------------------------------------------------------------------
// FILE
//------------------------------------------------------------------------------

Phonemock.addConstructor(function() {
    if (typeof navigator.fileMgr === "undefined") {
        navigator.fileMgr = new FileMgr();
    }
});

PMFile.prototype.getFileProperties = function(success, fail, params) {
	var filePath = params[0];
	console.log("Function not implemented yet: getFileProperties");
};

PMFile.prototype.testSaveLocationExists = function(success, fail, params) {
	console.log("Function not implemented yet: testSaveLocationExists");
};

PMFile.prototype.testFileExists = function(success, fail, params) {
	var fileName = params[0];
	
	var file = PMFile.find(PMFile.fileSystem.root, fileName, "", options);
	
	if (file) {
		Phonemock.success(success, true);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.testDirectoryExists = function(success, fail, params) {
	var dirName = params[0];
	console.log("Function not implemented yet: testDirectoryExists");
};

PMFile.prototype.getFreeDiskSpace = function(success, fail, params) {
	console.log("Function not implemented yet: getFreeDiskSpace");
};

PMFile.prototype.writeAsText = function(success, fail, params) {
	var fileName = params[0];
	var data = params[1];
	var append = params[2];
	
	console.log("Function not implemented yet: writeAsText");
};

PMFile.prototype.write = function(success, fail, params) {
	var fileName = params[0];
	var data = params[1];
	var position = params[2];
	var options = {};
	options.isFile = true;
	options.create = true;
	
	var file = PMFile.find(PMFile.fileSystem.root, fileName, "", options);
	
	if (file) {
		file.content = data;
		Phonemock.success(success, data.length);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.truncate = function(success, fail, params) {
	var fileName = params[0];
	var size = params[1];
	console.log("Function not implemented yet: truncate");
};

PMFile.prototype.readAsText = function(success, fail, params) {
	var fileName = params[0];
	var encoding = params[1];
	var options = {};
	options.isFile = true;
	
	var file = PMFile.find(PMFile.fileSystem.root, fileName, "", options);
	
	if (file) {
		Phonemock.success(success, file.content);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.readAsDataURL = function(success, fail, params) {
	var fileName = params[0];
	console.log("Function not implemented yet: readAsDataURL");
};

//------------------------------------------------------------------------------
// FILEENTRY
//------------------------------------------------------------------------------

PMFile.prototype.copyTo = function(success, fail, params) {
	var fullPath = params[0];
	var parent = params[1];
	var newName = params[2];
	console.log("Function not implemented yet: copyTo");
};

PMFile.prototype.getMetadata = function(success, fail, params) {
	var fullPath = params[0];
	console.log("Function not implemented yet: getMetadata");
};

// see below in the DirectoryEntry section
//PMFile.prototype.getParent = function(success, fail, params);

//see below in the DirectoryEntry section
//PMFile.prototype.remove = function(success, fail, params);

PMFile.prototype.moveTo = function(success, fail, params) {
	var fullPath = params[0];
	var parent = params[1];
	var newName = params[2];
	console.log("Function not implemented yet: moveTo");
};

PMFile.prototype.getFileMetadata = function(success, fail, params) {
	var options = {};
	options.isFile = true;
	
	var fileEntry = PMFile.find(PMFile.fileSystem.root, params[0], "", options);

	if (fileEntry) {
		var file = new File();
		file.name = fileEntry.name;
		file.fullPath = fileEntry.fullPath;
		// @TODO: getting a valid mime type and not only the extension
		file.type = fileEntry.name.substring(fileEntry.name.lastIndexOf(".")+1);
		file.lastModifiedDate = new Date();
		file.size = fileEntry.content.length;
		
		Phonemock.success(success, file);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

//------------------------------------------------------------------------------
// DIRECTORYENTRY
//------------------------------------------------------------------------------

PMFile.prototype.getDirectory = function(success, fail, params) {
	var path = params[0];
	
	// merge relative path if needed
	var fullPath = PMFile.getAbsolutePath(path, params[1]);
	var options = params[2];
	options.isDirectory = true;

	// We always search for Directories via the fullPath!
	var dir = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);
	
	if (dir) {
		Phonemock.success(success, dir);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.readEntries = function(success, fail, params) {
	var fullPath = params[0];
	var options = {};
	options.isDirectory = true;
	
	var dir = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);

	if (dir) {
		success(dir.content);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.copyTo = function(success, fail, params) {
	var fullPath = params[0];
	var parent = params[1];
	var newName = params[2];
	console.log("Function not implemented yet: copyTo");
};

PMFile.prototype.getMetadata = function(success, fail, params) {
	var fullPath = params[0];
	console.log("Function not implemented yet: getMetadata");
};

PMFile.prototype.getParent = function(success, fail, params) {
	var fullPath = params[0];
	var parentPath = fullPath.substring(0,fullPath.lastIndexOf("/"));
	var options = {};
	options.isDirectory = true;
	
	var parent = PMFile.find(PMFile.fileSystem.root, parentPath, "", options);
	
	if (parent) {
		Phonemock.success(success, parent);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.moveTo = function(success, fail, params) {
	var fullPath = params[0];
	var parent = params[1];
	var newName = params[2];
	console.log("Function not implemented yet: moveTo");
};

PMFile.prototype.remove = function(success, fail, params) {
	var fullPath = params[0];
	var isFile = params[1];
	var options = {};
	options.isFile = isFile;
	
	var entry = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);

	// Only delete the directory if there is no content (subdirectories or files)
	if (entry && entry.content.length == 0) {
		this.getParent(
			function(dir){
				var pos = dir.content.indexOf(entry);
				dir.content.splice(pos, 1);
				
				Phonemock.success(success, dir);
			}, 
			fail, 
			[fullPath]
		);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.getFile = function(success, fail, params) {
	var path = params[0];
	
	// merge relative path if needed
	var fullPath = PMFile.getAbsolutePath(path, params[1]);
	var options = params[2];
	options.isFile = true;

	// We always search for Files via the fullPath!
	var file = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);

	if (file) {
		Phonemock.success(success, file);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

PMFile.prototype.removeRecursively = function(success, fail, params) {
	var fullPath = params[0];
	
	var options = {};
	options.isDirectory = true;

	// We always search for Directories via the fullPath!
	var entry = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);
	
	if (entry) {
		// Just delete the whole entry...
		this.getParent(
			function(dir){
				var pos = dir.content.indexOf(entry);
				dir.content.splice(pos, 1);
				
				Phonemock.success(success, dir);
			}, 
			fail, 
			[fullPath]
		);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

//Static helper functions

/**
 * Returns an absolute path.
 * Check if the given path (relative) is relative or an absolute path.
 * If it is realtive it will be merged with the base path.
 * 
 * @param string basePath
 * @param string relativePath
 */
PMFile.getAbsolutePath = function(basePath, relativePath) {
	if (relativePath.search(/\//g) == -1) {
		// we have a path relative to the basePath (file or subdirectoy)
		return basePath + "/" + relativePath;
	} else if (relativePath.search(/\.\.\//g) != -1){
		// we have to merge the base and the relative path
		var upDirs = relativePath.match(/\.\.\//g).length;
		relativePath = relativePath.replace(/\.\.\//g, "");
		var itemsBase = basePath.split("/");
		
		for (var i = 0; i < upDirs; i++) {
			itemsBase.pop();
		}
		
		return itemsBase.join("/") + "/" + relativePath;
	} else if (relativePath.search(/\.\//g) != -1) {
		// if we are looking for a subdir
		return basePath + "/" + relativePath.replace(/.\//g, "");
	} else {
		// we have no realtive path
		return relativePath;
	}
};

/**
 * Returns a DirectoryEntry or FileEntry, which is searched recursive by a 
 * given absolute path.
 * If the Entry does not exist, it will be created, if the option create is set.
 * 
 * @param array searchItems
 * @param string fullPath
 * @param string currentPath
 * @param object options
 */
PMFile.find = function(searchItems, fullPath, currentPath, options) {
	if (options["isFile"]) {
		options.isDirectory = !options.isFile;
	} else if (options["isDirectory"]) {
		options.isFile = !options.isDirectory;
	}

	fullPath = fullPath.replace(/\/$/,"").replace(/^\//g, ""); 
	
	var dirStack = fullPath.split("/");
	var currentDir = dirStack.shift();
	
	// The path to the current directory
	if (currentPath == "") {
		currentPath = currentDir;
	} else {
		currentPath += "/" + currentDir;
	}
	
	// If there are no subdirs => we found our directory => return
	if (dirStack.length == 0) {
		return searchItems;
	}
	
	// the next item
	var nextItem = dirStack[0];
	var searchItem = null;
	
	// Check if the next item exists
	for(var i = 0; i < searchItems.content.length; i++) {
		var item = searchItems.content[i];
		// If we have to go down several subdirs, we have to ensure, that
		// we choose a directory and not a file with the same name!!!
		if (item instanceof DirectoryEntry && dirStack.length >= 1) {
			// we are looking for a directory
			if (item["name"] == nextItem) {
				searchItem = item;
				break;
			}
		} else if (item instanceof FileEntry) {
			// we are looking for a file
			if (item["name"] == nextItem) {
				searchItem = item;
				break;
			}
		}
	}
	
	// if directory not exists => create it, if option is set
	if (searchItem == null &&
		options != null &&
		options.create == true) {
		// create subdirectory if not exists
		
		if (options.isDirectory == true &&
			options.isFile == false) {
			searchItem = new DirectoryEntry();
			searchItem.content = [];
		} else {
			searchItem = new FileEntry();
			searchItem.content = "";
		}
		
		searchItem.name = nextItem;
		searchItem.fullPath = currentPath + "/" + nextItem;
		
		// Add the new Entry to the parent DirectoryEntry.
		searchItems.content.push(searchItem);
	}
	
	// next step
	return PMFile.find(searchItem, dirStack.join("/"), currentPath, options);
};

/*******************************************************************************
 * 
 * Geolocation
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Media
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Network
 * 
 ******************************************************************************/

Phonemock.addConstructor(function() {
    if (typeof navigator.network === "undefined") {
        navigator.network = new Object();  // This was renamed with 1.0!
    }
    if (typeof navigator.network.connection === "undefined") {
        navigator.network.connection = new Connection();
    }
});

PMNetworkStatus = function() {
};

/**
 * Try to get the logo of www.aflx.de to check if an internet connection is available.
 * 
 * @param success
 * @param fail
 * @param params
 */
PMNetworkStatus.prototype.getConnectionInfo = function(success, fail, params) {
	var img = document.body.appendChild(document.createElement("img"));
    img.onload = function()
    {
    	Phonemock.success(success, "online");
    	document.body.removeChild(img);
    };
    img.onerror = function()
    {
    	Phonemock.success(success, "none");
    	document.body.removeChild(img);
    };
    img.src = Phonemock.defaultImage; 
};

/*******************************************************************************
 * 
 * Notification
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * Storage
 * 
 ******************************************************************************/
