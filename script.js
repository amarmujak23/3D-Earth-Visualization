let scene, camera, renderer, sphere, controls;

function init() {
  // Create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create sphere geometry and material with texture
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const texture = new THREE.TextureLoader().load('earth-texture.jpg');
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  // Create atmospheric haze
  const atmosphereGeometry = new THREE.SphereGeometry(2.05, 64, 64);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x6699ff, // Light blue color
    transparent: true,
    opacity: 0.1, // Adjust opacity as needed for the desired effect
    side: THREE.BackSide
  });

  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphere);

  // Create sphere mesh
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Create and add stars to the scene
  createStars();

  // Enable controls for interaction
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = false;

  // Start animation
  animate();

  // Fade in the sphere only
  sphere.material.transparent = true;
  sphere.material.opacity = 0;
  fadeIn(sphere.material, 3000); // Fade-in the sphere after 3 seconds

  // Fade out the overlay after 4 seconds
  fadeOutOverlay('overlay', 3000);
}

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
  });

  const stars = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;

    stars.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}


function fadeIn(material, duration) {
  let opacity = 0;
  const start = performance.now();

  function fadeInAnimation(time) {
    opacity = (time - start) / duration;
    if (opacity >= 1) {
      opacity = 1;
      material.opacity = 1; // Set material opacity explicitly
      return;
    }
    material.opacity = opacity;
    requestAnimationFrame(fadeInAnimation);
  }

  requestAnimationFrame(fadeInAnimation);
}

function fadeOutOverlay(overlayId, delay) {
  setTimeout(() => {
    const overlay = document.getElementById(overlayId);
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none'; // Allow interaction with elements beneath the overlay
  }, delay);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);


// Initialize
init();
