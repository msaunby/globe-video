//

var ModalCtrl = function ($scope, $modal, $log) {
    
    $scope.items = ['frame size', 'adjusted size'];
    $scope.title = "video info";
    $scope.progress = 0;
    $scope.width = 0;
    $scope.height = 0;
    
    $scope.setProgress = function( percent ){
	// console.log( percent );
	$scope.progress = percent;
    }

    $scope.setVideoSize = function( width, height ){
	$scope.width = width;
	$scope.height = height;
    }

    $scope.getProgress = function(){
	return $scope.progress;
    }

    $scope.on_ok = function() {
	  };
    


    $scope.open = function (size) {	
	var modalInstance = $modal.open({
		templateUrl: 'myModalContent.html',
		controller: ModalInstanceCtrl,
		size: size,
		resolve: {
		    items: function () {return $scope.items;},
		    title: function () {return $scope.title;},
		    getProgress: function () {return $scope.getProgress;},
		    width: function(){return $scope.width;},
		    height: function(){return $scope.height;},
		}
	    });
	
	modalInstance.result.then(function (selectedItem) {
		$scope.selected = selectedItem;
	    }, function () {
		// $log.info('Modal dismissed at: ' + new Date());
	    });
    };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items, title, getProgress, width, height) {


	    $scope.getProgress = getProgress;
	    $scope.width = width;
	    $scope.height = height;
	    $scope.items = items;
	    $scope.title = title;
	    $scope.selected = {
		item: $scope.items[0]
	    };
	    
	    $scope.ok = function () {
		$modalInstance.close($scope.selected.item);
		console.log('you hit ok');
		start_play();
	    };
	    
	    $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	    };

	    
	};

var VideoCtrl = function ($scope) {
    
    // See https://www.dropbox.com/developers/dropins/chooser/js
    // for detailed explaination.


    options = {
	
	// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
	    $scope.message = "loading from Dropbox...";
	    var video = jQuery("#video").get(0);
	    video.src = '/proxy.php?url=' + files[0].link;
	    

	    /*
	    video.addEventListener( "loadedmetadata", function (e) {
		    clip_w = this.videoWidth;
		    clip_h = this.videoHeight;
		    $scope.message = "width: " + clip_w + " height:" + clip_h;
		    $scope.open();
		}, false );
	    */
	},
	
	// Optional. Called when the user closes the dialog without selecting a file
	// and does not include any parameters.
	cancel: function() {	
	},
	
	// Optional. "preview" (default) is a preview link to the document for sharing,
	// "direct" is an expiring link to download the contents of the file. For more
	// information about link types, see Link types below.
	linkType: "direct",
	
	// Optional. A value of false (default) limits selection to a single file, while
	// true enables multiple file selection.
	multiselect: false, // or true
	
	// Optional. This is a list of file extensions. If specified, the user will
	// only be able to select files with these extensions. You may also specify
	// file types, such as "video" or "images" in the list. For more information,
	// see File types below. By default, all extensions are allowed.
	//extensions: ['.mp4', '.webm', '.wmv', '.mov'],
	extensions: ['video'],
    };
	
    
    $scope.vidplay =function() {
	var video = jQuery("#video").get(0);
	var button = document.getElementById("play");
	if (video.paused) {
	    video.play();
	    button.textContent = "||";
	} else {
	    video.pause();
	    button.textContent = ">";
	}
    };
    
    $scope.restart =function() {
	var video = jQuery("#video").get(0);
	video.currentTime = 0;
    };
    
    $scope.skip = function(value) {
	var video = jQuery("#video").get(0);
	video.currentTime += value;
    };      
    
    $scope.hellofn = function() {
	console.log($scope);
	Dropbox.choose(options);
    };

}

