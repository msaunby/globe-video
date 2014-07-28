//

var container, stats;
var image,imageContext;
var camera, scene, renderer;
var globe;
var longitudeA = 0, latitudeA = 0;
var zoom = 0;
var texture;
var cameraZ = 2000;
var geometry;
var mesh;

var auto_play = true;

init();
animate();
load_demo();

function init() {
    
    container = document.getElementById( 'globediv' );
    
    camera = new THREE.PerspectiveCamera( 60, 1, 1, 10000 );
    camera.position.z = cameraZ;

    scene = new THREE.Scene();

    jQuery('#xsliderA').on('slide', function(event, ui){ longitudeA = ui.value;} );
    jQuery('#ysliderA').on('slide', function(event, ui){ latitudeA = ui.value;} );
    jQuery('#zslider').on('slide', function(event, ui){ zoom = ui.value;} );

    renderer = new THREE.WebGLRenderer();
    // If the above doesn't work, e.g. if proxy not available, then try:
    //renderer = new THREE.CanvasRenderer();

    // Must now call renderer.setSize( width, height );
    // container height will likely be zero, so use container width() and make it square - which works nicely.
    renderer.setSize( jQuery(container).width(), jQuery(container).width() );
    container.appendChild( renderer.domElement );

    geometry = new THREE.SphereGeometry( 800, 40, 40 );
}

function load_demo() {

    video.src = 'clips/Global.2013.spherical.webm';   
    // This event listener now in localfile.js
    //    video.addEventListener( "loadedmetadata", function (e) {
    //    clip_w = this.videoWidth;
    //    clip_h = this.videoHeight;
    //    start_play(); }, false );
}

function start_play() {
    console.log('start_play');

    // remove existing globe then build a new one.
    removeGlobe();

    video = document.getElementById( 'video' );
    image = document.createElement( 'canvas' );
    image.width = clip_w;
    image.height = clip_h;
    console.log(image);
    console.log(jQuery('#video').width());
    console.log(jQuery('#video').height());
    console.log( image.width / image.height );
    imageContext = image.getContext('2d');

    texture = new THREE.Texture( image );
    texture.offset.set(0,0);
    //texture.repeat.set(0.6,1);

    var material = new THREE.MeshBasicMaterial( {  map: texture, overdraw: 1.0 } );
    mesh = new THREE.Mesh( geometry, material );
    globe = new THREE.Object3D();
    scene.add( globe );
    globe.add( mesh );

}

function stop_play() {
    removeGlobe();
}

function removeGlobe() {

    if(globe) scene.remove( globe );

}


function animate() {
    
    requestAnimationFrame( animate );    
    render();

}

function render() {

    if( globe ){
	globe.rotation.x = 3.14/180.0 * latitudeA;
	globe.rotation.y = 3.14/180.0 * (longitudeA - 90.0);
	camera.position.z = cameraZ - (zoom * 10);
	

	try{
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
	    
	    imageContext.drawImage( video, 0, 0 );
	    
	    if ( texture ) texture.needsUpdate = true;
	}
	
	
	renderer.render( scene, camera );
	}catch(err){
	    console.log('caught ' + err.message);
	}
    }
}

