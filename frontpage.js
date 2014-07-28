/**
 * The main handler for drag'n'drop and also for file selection. The XTK scene
 * gets created here and the viewer gets activated. Inspired by
 * http://imgscalr.com - THANKS!!
 */


function createData() {

  _data = {
   'image': {
     'file': [],
     'filedata': [],
     'extensions': ['JPG', 'PNG', 'GIF']
   }
  }

}


jQuery(document).ready(function() {


  detect_viewingmode();

  //initBrowserWarning();
  //initDnD();
  //initExamples();
  createData();


  ren3d = null;
  configurator = function() {

  };
  


  // from http://stackoverflow.com/a/7826782/1183453
  var args = document.location.search.substring(1).split('&');
  argsParsed = {};
  for (var i=0; i < args.length; i++)
  {
      arg = unescape(args[i]);

      if (arg.length == 0) {
        continue;
      }

      if (arg.indexOf('=') == -1)
      {
          argsParsed[arg.replace(new RegExp('/$'),'').trim()] = true;
      }
      else
      {
          kvp = arg.split('=');
          argsParsed[kvp[0].trim()] = kvp[1].replace(new RegExp('/$'),'').trim();
      }
  }

  // setup logging hotkey
  $(window).keypress(function(e) {
    if (e.charCode == 108) {
      $('#log').show();
      _LOG_ = true;
    }
  });

  if ('14yrold' in argsParsed) {

    load14yrold();

  } else if ('scene' in argsParsed) {

    // we have a scene
    var _scene = document.location.href.split('=');
    _scene.shift(); // remove first part (slicedrop.com?scene)

    _scene = _scene.join('=');

    console.log('Found scene ' + _scene);
    loadScene(_scene);

  } else if ('url' in argsParsed) {

    console.log('Found url ' + argsParsed['url']);

  } else {

    //for (var a in argsParsed) {
    var _url = document.location.search;
    if (_url.length > 1) {
      loadFile(document.location.search.substring(1));
    }
    //}

  }

  function switch_orientation(id) {

    var _width = jQuery(id).width();
    var _height = jQuery(id).height();

    // now convert to percentage
    console.log('old', _width, _height);
    _width = jQuery(id).width() / jQuery(document).width() * 100;
    _height = jQuery(id).height() / jQuery(document).height() * 100;
    console.log('new', _width, _height);
    jQuery(id).height(_width + '%');
    jQuery(id).width(_height + '%');
    jQuery(id).css('position', 'absolute');

  }

  function detect_viewingmode() {

    // portrait or landscape display
    if (jQuery(document).width() < jQuery(document).height()) {

      jQuery(document.body).removeClass('landscape');
      jQuery(document.body).addClass('portrait');

    } else {

      jQuery(document.body).removeClass('portrait');
      jQuery(document.body).addClass('landscape');

    }

  }

  // add a handler for viewing mode detecting
  jQuery(window).resize(detect_viewingmode);

});

	//var _data = [];
 	//_data['image'] = [];
	//_data['image']['file'] = [];

	function selectfiles(files) {
		// now switch to the viewer
  	//switchToViewer();
	  // .. and start the file reading
	  //alert(files);
    read(files);
	}

	function read(files) {	
		for ( var i = 0; i < files.length; i++) {
			var f = files[i];
			var _fileName = f.name;
			var _fileExtension = _fileName.split('.').pop().toUpperCase();
			// check for files with no extension
			if (_fileExtension == _fileName.toUpperCase()) {
				// who knows
				_fileExtension = 'JPG';
			}
			var _fileSize = f.size;
			_data['image']['file'].push(f);
		}
		// we now have the following data structure for the scene
		window.console.log('New data', _data);
		var _types = Object.keys(_data);
		// number of total files
		var _numberOfFiles = files.length;
		var _numberRead = 0;
		window.console.log('Total new files:', _numberOfFiles);
		  //
  // the HTML5 File Reader callbacks
  //

  // setup callback for errors during reading
  var errorHandler = function(e) {

   console.log('Error:' + e.target.error.code);

  };

  // setup callback after reading
  var loadHandler = function(type, file) {

   return function(e) {

     // reading complete
     var data = e.target.result;

     // might have multiple files associated
     // attach the filedata to the right one
     _data[type]['filedata'][_data[type]['file'].indexOf(file)] = data;

     _numberRead++;
     if (_numberRead == _numberOfFiles) {
       // all done, start the parsing
       parse(_data);
     }
};

};

  //
  // start reading
  //
  _types.forEach(function(v) {

   if (_data[v]['file'].length > 0) {

     _data[v]['file'].forEach(function(u) {

       var reader = new FileReader();

       reader.onerror = errorHandler;
       //reader.onload = (loadHandler)(v,u); // bind the current type

       // start reading this file
       //reader.readAsArrayBuffer(u);
	 reader.onload = function(e) {
    fileDisplayArea.innerHTML = "";

    // Create a new image.
    var img = new Image();
    // See http://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/
    img.crossOrigin = "anonymous";

    // Set the img src property using the data URL.
    img.src = reader.result;
    img.style.width="100%"; // fill the enclosing DIV.

    newGlobe(reader.result);

    // Add the image to the page.
    fileDisplayArea.appendChild(img);
  }

  reader.readAsDataURL(_data[v]['file'][0]); 

     });

   }

  });

}

function parse(data) {
	if (data['image']['file'].length > 0) {
		// we have an image
		//volume = new X.volume();
		//volume.file = data['image']['file'].map(function(v) {
		//	return v.name;
		//});
	}
}

