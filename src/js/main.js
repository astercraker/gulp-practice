var scene,camera,renderer,mesh,hand,tira_particulas,controls
var ww = window.innerWidth, wh = window.innerHeight;

var particleImage = '../models/particle-tiny.png',
			particleColor = '0xFFFFFF',
			particleSize = .1;

var uniforms;

let SEPARATION = 120;
let AMOUNTX = 60;
let AMOUNTY = 50;
let particles;
let particle;
let count = 0;
let start = Date.now();
let material;

window.addEventListener('load', init);
function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, ww / wh, 0.5, 3000000)
    //camera.position.z = 40;
    camera.near = 0.5;
    camera.far = 3000000;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.set(350, 100, -450);

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: document.querySelector('canvas')
    });
    renderer.setSize(ww, wh)
    //renderer.setClearColor(0x001a2d);
    renderer.setClearColor( 0x000000, 0 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPan = false;
    controlsuserPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    console.log("controls", controls);
    controls.update();

    var ambientLight = new THREE.AmbientLight( 0x404040, 40 ); // soft white light
    scene.add( ambientLight );

    var light = new THREE.PointLight( 0x71b9d1, 40 );
				light.position.set( 0, 0, 100 );
                scene.add( light );
    var axisHelper = new THREE.AxesHelper(10);
    //scene.add(axisHelper);

    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('../models/mano-textura.jpg');

    particles = new Array();
    var PI2 = Math.PI * 2;
    var texture = new THREE.TextureLoader().load( '../models/dot.png' );
    var materialParticle = new THREE.SpriteMaterial( { map: texture, color: 0x2aabd2, opacity: 1.0 } );
    var i = 0;

      for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

          particle = particles[ i ++ ] = new THREE.Sprite( materialParticle.clone() );
          particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
          particle.position.y = -200;
          particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
          particle.scale.set(158, 158,158)
          //console.log("Sprite material", particle.scale);
          scene.add( particle );

        }

      }
    // var loader = new THREE.OBJLoader();
    // var gltfLoader = new THREE.GLTFLoader();

    animationLoop()
    window.addEventListener('resize', onResize);
}
function animationLoop() {
    renderer.render(scene, camera)

    var i = 0;
      for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

          particle = particles[ i++ ];
          particle.position.y = -200 + ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
            ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
          if(particle.position.y >= -110) {
            particle.material.color = new THREE.Color(0x925f01);
          } else if(particle.position.y > -140 && particle.position.y < -110) {
            particle.material.color = new THREE.Color("orange");
          } else if(particle.position.y > -170 && particle.position.y < -140) {
            particle.material.color = new THREE.Color(0xf85d09);
          } else {
            particle.material.color = new THREE.Color(0x2aabd2);
          }
          //particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
          //  ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
          //particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.9 ) + 1 ) * 8 +
          //  ( Math.sin( ( iy + count ) * 0.9 ) + 1 ) * 4;
          //console.log(particle.scale.x);
        }
  
      }
  
      count += 0.1;

    requestAnimationFrame(animationLoop)
    controls.update();
}

function onResize() {
    ww = window.innerWidth;
    wh = window.innerHeight;
    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();
    renderer.setSize(ww, wh);
}
