/**
 * Phonemock
 * =========
 * 
 * @author 	Alexander Keller
 *  		ak@aflx.de
 *  		http://www.phonemock.com
 *  
 * Phonegap target: 1.0.0
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
 * 
 * @param config	an object to configure Phonemock
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
 * 
 * @param fileSystem	
 */ 
Phonemock.addFileSystem = function(fileSystem) {
	PMFile.fileSystem = fileSystem;
};

/**
 * Just for globally handling missing result-function.
 * 
 * @param success	The success callback
 * @param result   	The result which is passed to success
 */
Phonemock.success = function(success, result) {
	if (success)
		success(result);
	else
		console.log("No success function defined: Success: " + result);
};

/**
 * Just for globally handling missing result-function.
 * 
 * @param fail   	The error callback
 * @param error		The error object which is passed to fail
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
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param type		for example File, NetworkStatus...
 * @param call		The function to call
 * @param params	These params are passed to the call method
 */
PhoneGap.exec = function(success, fail, type, call, params) {
	// remove whitespaces
	type = type.replace(/\s+/g,'');
	console.log("PhoneGap.exec call: " + call + " of " + type);
	
	// every type has a prefix PM
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
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 */
DirectoryEntry.prototype.remove = function(success, fail) {
    PhoneGap.exec(success, fail, "File", "remove", [this.fullPath, this.isFile]);
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

/**
 * Wraps the takePicture method of Camera.
 * Always returns an URL to a picture.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params	quality, destinationType, sourceType
 */
PMCamera.prototype.takePicture = function(success, fail, params) {
	var quality = params[0];
	var destinationType = params[1];
	var sourceType = params[2];
	
	success(Phonemock.defaultImage);
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

/**
 * Returns a MediaFile object. The fullPath is always an URL to an image.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param options
 */
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

/**
 * Faking device info. 
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Returns the fake fileSystem. You have to call Phonemock.addFileSystem() first!
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Checks whether a File exists or not.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
PMFile.prototype.testFileExists = function(success, fail, params) {
	var fileName = params[0];
	var options = {};
	options.create = false;
	options.isFile = true;
	
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

/**
 * Writes text to a file.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Returns the content of a file.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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


//see below in the DirectoryEntry section
//PMFile.prototype.moveTo = function(success, fail, params) {

/**
 * Returns some information of a file.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
PMFile.prototype.getFileMetadata = function(success, fail, params) {
	var options = {};
	options.isFile = true;
	
	var fileEntry = PMFile.find(PMFile.fileSystem.root, params[0], "", options);

	if (fileEntry) {
		var file = new File();
		file.name = fileEntry.name;
		file.fullPath = fileEntry.fullPath;
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

/**
 * Returns a directory by name/path.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Returns the content (a list of files and directories) of a directory.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Returns the parent directory of a file or directory.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Moves a file or directory to another directory.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
PMFile.prototype.moveTo = function(success, fail, params) {
	var fullPath = PMFile.getAbsolutePath(PMFile.fileSystem.root, params[0]);
	var parent = params[1];
	var newName = params[2];
	var options = {};
	
	var entry = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);

	if (entry) {
		// move the entry from the current parent directory to the new parent
		this.getParent(
			function(dir){
				var pos = dir.content.indexOf(entry);
				dir.content.splice(pos, 1);
				
				entry.name = newName;
				entry.fullPath = parent.fullPath + "/" + newName;
				parent.content.push(entry);
				
				Phonemock.success(success, entry);
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

/**
 * Removes a file or a directory.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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

/**
 * Returns a file by name/path.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
PMFile.prototype.getFile = function(success, fail, params) {
	var path = params[0];
	
	// merge relative path if needed
	var fullPath = PMFile.getAbsolutePath(path, params[1]);
	var options = params[2];
	options.isFile = true;

	// We always search for files via the fullPath!
	var file = PMFile.find(PMFile.fileSystem.root, fullPath, "", options);

	if (file) {
		Phonemock.success(success, file);
	} else {
		var error = new FileError();
		error.code = FileError.NOT_FOUND_ERR;
		Phonemock.fail(fail, error);
	}
};

/**
 * Delete a whole directory.
 * 
 * @param success	The success callback
 * @param fail   	The error callback
 * @param params
 */
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
	if (relativePath.search(/^\//g) == -1) {
		// example: "path"
		// we have a path relative to the basePath (file or subdirectoy)
		return basePath + "/" + relativePath;
	} else if (relativePath.search(/^\.\//g) != -1) {
		// example: "./path"
		// we also have a path relative to the basePath (file or subdirectoy)
		// but we have to replace "./"
		return basePath + "/" + relativePath.replace(/^\.\//g, "");
	} else if (relativePath.search(/^\.\.\//g) != -1){
		// example: "../path"
		// we have to merge the base and the relative path
		var upDirs = relativePath.match(/^\.\.\//g).length;
		relativePath = relativePath.replace(/^\.\.\//g, "");
		var itemsBase = basePath.split("/");
		
		for (var i = 0; i < upDirs; i++) {
			itemsBase.pop();
		}
		
		return itemsBase.join("/") + "/" + relativePath;
	} else {
		// example: "/path"
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
		currentPath = "/" + currentDir;
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
		
		if (dirStack.length > 1) {
			// We are not in the last part of the path =>
			// we always have to create a directory
			searchItem = new DirectoryEntry();
			searchItem.content = [];
		} else {
			// create the file/directory if not exists
			if (options.isDirectory == false &&
				options.isFile == true) {
				searchItem = new FileEntry();
				searchItem.content = "";
			} else {
				searchItem = new DirectoryEntry();
				searchItem.content = [];
			}
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
 * @param success	The success callback
 * @param fail   	The error callback
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
