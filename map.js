let light = new THREE.AmbientLight("#faffe3");
scene.add(light);
let loader = new THREE.GLTFLoader();
        loader.load('map3.gltf', function(gltf){
          map = gltf.scene.children[0];
          map.scale.set(0.5,1,0);
        scene.add(gltf.scene);
          animate();
        });