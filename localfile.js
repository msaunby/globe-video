
(function (module) {
     
    var fileReader = function ($q, $log) {
 
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
			deferred.resolve(reader.result);
		    });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
			deferred.reject(reader.result);
		    });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
	{
	    total: event.total,
	    loaded: event.loaded
	});
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
		};
    };
 
    module.factory("fileReader",
                   ["$q", "$log", fileReader]);

}(angular.module("globe")));


var LocalFileController = function ($scope, fileReader) {
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
		var video = jQuery("#video").get(0);
		video.src = result;
		video.crossOrigin='anonymous';
            });
    };

    $scope.reset = function() {
	alert('reset');
	reset_globe();
    };
 

    $scope.$on("fileProgress", function(e, progress) {
            $scope.progress = 100.0 * progress.loaded / progress.total;
	    $scope.setProgress( 100.0 * progress.loaded / progress.total );
        });
 
};

app.directive("ngFileSelect",function(){

        return {
            link: function($scope,el){

		video.addEventListener( "loadedmetadata", function (e) {
			clip_w = this.videoWidth;
			clip_h = this.videoHeight;
			console.log("metadata loaded");
			$scope.setVideoSize( clip_w, clip_h );
			if( auto_play ){
			    start_play();
			}else{
			    $scope.open();
			}
		    }, false );
		
                el.bind("change", function(e){
			stop_play();
			var video = jQuery("#video").get(0);
			video.src = "";
			$scope.setVideoSize( 0, 0 );
                        $scope.file = (e.srcElement || e.target).files[0];
                        $scope.getFile();
                    })
      
                    }
    
        }
  
  
    });


