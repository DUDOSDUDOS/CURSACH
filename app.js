let camera, scene, renderer, controls, raycaster;
let objects = [];
let blocker = document.getElementById( 'blocker' );
let instructions = document.getElementById( 'instructions' );    

//optimization

let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
		let element = document.body;
		let pointerlockchange = function ( event ) {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
						controlsEnabled = true;
						controls.enabled = true;
						blocker.style.display = 'none';
				} else {
						controls.enabled = false;
						blocker.style.display = '-webkit-box';
						blocker.style.display = '-moz-box';
						blocker.style.display = 'box';
						instructions.style.display = '';
				}
		};

		let pointerlockerror = function ( event ) {
		instructions.style.display = '';
		};

// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
		instructions.addEventListener( 'click', function ( event ) {
				instructions.style.display = 'none';
// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
				if ( /Firefox/i.test( navigator.userAgent ) ) {
						let fullscreenchange = function ( event ) {
								if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
									document.removeEventListener( 'fullscreenchange', fullscreenchange );
									document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
									element.requestPointerLock();
								}	
						};
						document.addEventListener( 'fullscreenchange', fullscreenchange, false );
						document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
						element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
						element.requestFullscreen();
				} else {
						element.requestPointerLock();
				} }, false );
}

init();
animate();
			
var controlsEnabled = false;
let moveBackward = canJump = moveForward = moveLeft = moveRight = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();

function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 10 );
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

//keybord

	let onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 87: // w
			moveForward = true;
			break;
			case 65: // a
			moveLeft = true; break;
			case 83: // s
			moveBackward = true;
			break;
			case 68: // d
			moveRight = true;
			break;
			case 32: // space
			if ( canJump === true ) velocity.y += 20;
			canJump = false;
			break;
		}
	}

	let onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 87: // w
			moveForward = false;
			break;
			case 65: // a
			moveLeft = false;
			break;
			case 83: // s
			moveBackward = false;
			break;
			case 68: // d
			moveRight = false;
			break;
		}
	}

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

//resize screen
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

//animate

function animate() {
	requestAnimationFrame( animate );
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;
		let intersections = raycaster.intersectObjects( objects );
		let isOnObject = intersections.length > 0;
		let time = performance.now();
		let delta = ( time - prevTime ) / 1000;
		velocity.x -= velocity.x * 100.0 * delta;
		velocity.z -= velocity.z * 100.0 * delta;
		velocity.y -= 9.8 * 10.0 * delta;
		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;
		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;
		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = false;
		}	
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );
		if ( controls.getObject().position.y < 1 ) {
			velocity.y = 0;
			controls.getObject().position.y = 1;
			canJump = true;
		}
		prevTime = time;
	}
renderer.render( scene, camera );
}
