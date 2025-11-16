// script.js

// Import Three.js explicitly for module scope
// Using 'three' directly for Parcel to resolve in the build process for index.html
import * as THREE from 'three'; 

// GSAP is loaded globally via CDN, so access it via window.gsap

// --- Global Variables for 3D Scene ---
let scene, camera, renderer;
let mouseX = 0,
    mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let defParticles = [];
let noxParticles = [];
let cleanAirParticles = [];
let exhaustPipe; // Represents the stylized exhaust system

const DEF_PARTICLE_COUNT = 250; // Number of DEF particles
const NOX_PARTICLE_COUNT = 200; // Number of NOx particles
const CLEAN_AIR_PARTICLE_COUNT = 150; // Number of clean air particles

// --- Preloader Logic ---
const preloader = document.getElementById('preloader');

function hidePreloader() {
    if (preloader) {
        preloader.classList.add('hidden');
        // Optional: Remove preloader from DOM after transition
        preloader.addEventListener(
            'transitionend',
            () => {
                preloader.remove();
            },
            { once: true }
        );
    }
}

// --- Initialization Function for the 3D Animation ---
function initDefNoxAnimation(canvasId = 'animationCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`3D canvas with ID '${canvasId}' not found. Animation cannot be initialized.`);
        hidePreloader(); // Hide preloader if canvas not found
        return;
    }

    // Set up Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    // Set initial size, will be updated by onWindowResize
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Set up Scene
    scene = new THREE.Scene();
    // Background color for the 3D scene (dark blue for contrast with particles)
    scene.background = new THREE.Color(0x002a52);

    // Set up Camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of view
        canvas.clientWidth / canvas.clientHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.set(0, 0, 5); // Initial camera position

    // --- Add Lighting to the Scene ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft overall light
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7); // Main light source
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Secondary light source
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // --- Create Stylized Exhaust Pipe Model ---
    // This group will hold all parts of our abstract exhaust system
    exhaustPipe = new THREE.Group();

    // Main pipe body (a simple cylinder)
    const pipeBodyGeometry = new THREE.CylinderGeometry(0.7, 0.7, 4, 32); // Radius top, radius bottom, height, segments
    const pipeBodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444, // Dark grey for the pipe
        specular: 0x666666, // Specular highlights for a metallic look
        shininess: 50, // Shininess of the material
    });
    const pipeBody = new THREE.Mesh(pipeBodyGeometry, pipeBodyMaterial);
    pipeBody.rotation.z = Math.PI / 2; // Rotate to lay horizontally
    exhaustPipe.add(pipeBody);

    // Inlet nozzle (where DEF enters)
    const inletNozzleGeometry = new THREE.CylinderGeometry(0.5, 0.7, 0.5, 32);
    const inletNozzleMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        specular: 0x555555,
        shininess: 30,
    });
    const inletNozzle = new THREE.Mesh(inletNozzleGeometry, inletNozzleMaterial);
    inletNozzle.rotation.z = Math.PI / 2;
    inletNozzle.position.x = -2.25; // Position at the left end of the main pipe
    exhaustPipe.add(inletNozzle);

    // Outlet nozzle (where emissions exit)
    const outletNozzleGeometry = new THREE.CylinderGeometry(0.8, 0.7, 0.5, 32);
    const outletNozzleMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        specular: 0x555555,
        shininess: 30,
    });
    const outletNozzle = new THREE.Mesh(outletNozzleGeometry, outletNozzleMaterial);
    outletNozzle.rotation.z = Math.PI / 2;
    outletNozzle.position.x = 2.25; // Position at the right end of the main pipe
    exhaustPipe.add(outletNozzle);

    exhaustPipe.position.set(0, 0, 0); // Center the pipe
    scene.add(exhaustPipe);

    // --- Particle Systems for DEF, NOx, and Clean Air ---

    // DEF Particles (Blue, flowing into the inlet)
    const defMaterial = new THREE.PointsMaterial({
        color: 0x00aaff, // Bright blue color for DEF
        size: 0.08, // Size of each particle
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending, // For glowing effect
    });
    const defGeometry = new THREE.BufferGeometry();
    const defPositions = [];
    for (let i = 0; i < DEF_PARTICLE_COUNT; i++) {
        defPositions.push(
            -5 + Math.random() * 2, // Start randomly to the left of the inlet
            Math.random() * 1 - 0.5,
            Math.random() * 1 - 0.5
        );
    }
    defGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(defPositions, 3)
    );
    defParticles = new THREE.Points(defGeometry, defMaterial);
    scene.add(defParticles);

    // NOx Particles (Red/Orange, flowing out of the outlet)
    const noxMaterial = new THREE.PointsMaterial({
        color: 0xff4500, // Red-orange color for NOx
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
    });
    const noxGeometry = new THREE.BufferGeometry();
    const noxPositions = [];
    for (let i = 0; i < NOX_PARTICLE_COUNT; i++) {
        noxPositions.push(
            exhaustPipe.position.x + 1.5 + Math.random() * 0.5, // Start near the outlet
            Math.random() * 0.5 - 0.25,
            Math.random() * 0.5 - 0.25
        );
    }
    noxGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(noxPositions, 3)
    );
    noxParticles = new THREE.Points(noxGeometry, noxMaterial);
    scene.add(noxParticles);

    // Clean Air Particles (Green, replacing NOx as it's reduced)
    const cleanAirMaterial = new THREE.PointsMaterial({
        color: 0x8dc63f, // Accent green for clean air
        size: 0.09,
        transparent: true,
        opacity: 0.0, // Start invisible, will fade in
        blending: THREE.AdditiveBlending,
    });
    const cleanAirGeometry = new THREE.BufferGeometry();
    const cleanAirPositions = [];
    for (let i = 0; i < CLEAN_AIR_PARTICLE_COUNT; i++) {
        cleanAirPositions.push(0, 0, 0); // Initial position (will be updated dynamically)
    }
    cleanAirGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(cleanAirPositions, 3)
    );
    cleanAirParticles = new THREE.Points(cleanAirGeometry, cleanAirMaterial);
    scene.add(cleanAirParticles);

    // Initial animation for the exhaust pipe model using GSAP
    // Access gsap from the global window object
    window.gsap.from(exhaustPipe.rotation, {
        duration: 2,
        y: Math.PI * 2, // Rotate 360 degrees on Y-axis
        ease: 'power3.out',
    });
    window.gsap.from(exhaustPipe.position, {
        duration: 1.5,
        z: -5, // Start further back and move forward
        ease: 'power2.out',
        onComplete: hidePreloader, // Hide preloader after initial 3D animation
    });

    console.log('3D DEF/NOx animation scene created successfully!');

    // --- Event Listeners for Interactivity and Responsiveness ---
    // Mouse interaction for subtle camera movement (parallax effect)
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Handle window resizing to keep the animation responsive
    window.addEventListener('resize', onWindowResize, false);

    // Start the animation loop
    animate();
}

// --- Mouse Move Handler for Parallax Effect ---
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

// --- Window Resize Handler ---
function onWindowResize() {
    const canvas = document.getElementById('animationCanvas');
    if (!canvas) return;

    // The size needs to be based on its parent container's actual computed size.
    // We're now dealing with `canvas` inside `.animation-content-wrapper` which is flex.
    // The clientWidth/clientHeight of the canvas itself should reflect its flex-adjusted size.
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix(); // Update camera's projection matrix
    renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Resize renderer
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate); // Request next animation frame

    // Subtle rotation for the exhaust pipe model
    if (exhaustPipe) {
        exhaustPipe.rotation.y += 0.002;
        exhaustPipe.rotation.x = Math.sin(Date.now() * 0.0002) * 0.05;
    }

    // Parallax effect: camera subtly moves based on mouse position
    if (camera) {
        const targetX = mouseX * 0.0001;
        const targetY = -mouseY * 0.0001;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position); // Ensure camera always looks at the center
    }

    // --- Animate DEF particles ---
    const defPositions = defParticles.geometry.attributes.position.array;
    for (let i = 0; i < defPositions.length; i += 3) {
        defPositions[i] += 0.04; // Move right towards the exhaust pipe inlet
        // If particle moves past the inlet, reset its position to the left
        if (defPositions[i] > exhaustPipe.position.x - 1.5) {
            defPositions[i] = -5 + Math.random() * 2;
            defPositions[i + 1] = Math.random() * 1 - 0.5;
            defPositions[i + 2] = Math.random() * 1 - 0.5;
        }
    }
    defParticles.geometry.attributes.position.needsUpdate = true; // Tell Three.js to update vertex positions

    // --- Animate NOx particles and transform to Clean Air particles ---
    const noxPos = noxParticles.geometry.attributes.position.array;
    const cleanAirPos = cleanAirParticles.geometry.attributes.position.array;

    for (let i = 0; i < noxPos.length; i += 3) {
        noxPos[i] += 0.03; // Move right away from the exhaust pipe outlet
        noxPos[i + 1] += (Math.random() - 0.5) * 0.01; // Add slight random spread
        noxPos[i + 2] += (Math.random() - 0.5) * 0.01;

        // Calculate distance from the exhaust pipe outlet
        const distance = Math.sqrt(
            Math.pow(noxPos[i] - (exhaustPipe.position.x + 2), 2) +
            Math.pow(noxPos[i + 1], 2) +
            Math.pow(noxPos[i + 2], 2)
        );

        // Visual transformation: Fade out NOx and fade in Clean Air
        if (distance > 0.5 && distance < 3) {
            const fadeFactor = (distance - 0.5) / 2.5; // Factor from 0 to 1 over a specific distance range
            // Adjust NOx particle opacity
            noxParticles.material.opacity = 0.8 * (1 - fadeFactor);

            // Position Clean Air particles where NOx is fading and adjust their opacity
            cleanAirPos[i] = noxPos[i];
            cleanAirPos[i + 1] = noxPos[i + 1];
            cleanAirPos[i + 2] = noxPos[i + 2];
            cleanAirParticles.material.opacity = 0.8 * fadeFactor;
        } else if (distance >= 3) {
            // If NOx particle is too far, reset its position to the outlet
            noxPos[i] = exhaustPipe.position.x + 2 + Math.random() * 0.5;
            noxPos[i + 1] = Math.random() * 0.5 - 0.25;
            noxPos[i + 2] = Math.random() * 0.5 - 0.25;
            noxParticles.material.opacity = 0.8; // Reset NOx opacity
            cleanAirParticles.material.opacity = 0.0; // Hide clean air particle
        }
    }
    noxParticles.geometry.attributes.position.needsUpdate = true;
    cleanAirParticles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera); // Render the scene
}


// --- Initialize functions ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D animation if on the index page
    if (document.getElementById('animationCanvas')) {
        initDefNoxAnimation('animationCanvas'); // Initialize 3D animation
    } else {
        // If not on a page with animation, hide preloader immediately
        hidePreloader();
    }

    // --- Google Search Animation Initialization ---
    const searchAnimationContainer = document.getElementById('searchAnimationContainer');
    if (searchAnimationContainer) { // Only run if the element exists
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const searchResults = document.getElementById('searchResults');

        const queryText = 'how much nox is reduced by adblue';
        const typingSpeed = 0.05; // seconds per character
        const searchDelay = 1; // seconds before results appear
        const hideResultsDelay = 15; // seconds to hide results after initial load


        // Function to show search results with animation
        function showSearchResults() {
            // Temporarily make it visible to get its height
            searchResults.style.height = 'auto';
            searchResults.style.opacity = '1';
            const naturalHeight = searchResults.clientHeight;
            searchResults.style.height = '0'; // Reset height for animation
            searchResults.style.opacity = '0'; // Reset opacity for animation

            window.gsap.to(searchResults, {
                opacity: 1,
                height: naturalHeight,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    searchResults.style.height = 'auto'; // Set to auto after animation
                }
            });
        }

        // Function to hide search results with animation
        function hideSearchResults() {
            window.gsap.to(searchResults, {
                opacity: 0,
                height: 0,
                y: 20, // Move down slightly as it hides
                duration: 0.7,
                ease: 'power2.inOut',
                onComplete: () => {
                    searchResults.style.height = '0'; // Ensure it's collapsed
                    searchResults.style.overflow = 'hidden'; // Ensure content is clipped
                }
            });
        }

        // Function to simulate typing
        let hideTimeout; // To store the timeout for hiding results

        function typeQuery(text, index = 0) {
            if (index < text.length) {
                searchInput.value += text.charAt(index);
                setTimeout(() => typeQuery(text, index + 1), typingSpeed * 1000);
            } else {
                // Once typing is complete, simulate search and show results
                window.gsap.to(loadingIndicator, { opacity: 1, duration: 0.5 });
                setTimeout(() => {
                    window.gsap.to(loadingIndicator, { opacity: 0, duration: 0.5 });
                    showSearchResults();

                    // Set timeout to hide results after 15 seconds
                    hideTimeout = setTimeout(hideSearchResults, hideResultsDelay * 1000);

                }, searchDelay * 1000);
            }
        }

        // Event listener for the search button
        searchButton.addEventListener('click', () => {
            // Clear any existing hide timeout if the user clicks the button
            clearTimeout(hideTimeout);
            searchInput.value = queryText; // Ensure text is filled
            showSearchResults(); // Show results immediately on click
            // Optionally, set a new timeout to hide after another 15 seconds
            hideTimeout = setTimeout(hideSearchResults, hideResultsDelay * 1000);
        });


        // Initial animation for the container
        window.gsap.fromTo( // Use window.gsap as it's globally loaded
            searchAnimationContainer,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );

        // Start the animation automatically after a short delay
        setTimeout(() => {
            typeQuery(queryText);
        }, 1500); // Start typing 1.5 seconds after container appears
    }
});




// Website update js date: 16 nov 2025 onwards

