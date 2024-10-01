import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Get the video element and create a video texture
const video = document.getElementById('video');
if (video) {
    console.log('Video element found:', video);

    video.oncanplay = () => {
        video.play();
        console.log('Video can play');
    };
    video.onplaying = () => {
        console.log('Video is playing');
    };
    video.onerror = (e) => {
        console.error('Error occurred while playing video:', e);
    };

    // Check if the video can be played
    if (video.readyState >= 3) {
        console.log('Video is ready to play');
        video.play();
    } else {
        console.log('Video is not ready to play, current readyState:', video.readyState);
    }

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    // Create a plane geometry to display the video
    const geometry = new THREE.PlaneGeometry(5, 5); // Adjust dimensions as needed
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
} else {
    console.error('Video element not found');
}