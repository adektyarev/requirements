// Global variables
let scene, camera, renderer, controls;
let hexTiles = [];
let buildings = [];
let selectedTile = null;
let raycaster, mouse;

// Tile data similar to the Calgary developments
const tileTypes = [
    {
        name: "Starling",
        type: "Mid-Front-Garage Homes", 
        description: "Eco-friendly design, amphitheatre, trails, pump-track...",
        forecast: "+15% in 3 years",
        amenities: ["Eco-friendly design", "Amphitheatre", "Trails", "Pump track"],
        color: 0x90EE90,
        buildingType: "house",
        icon: "🏠"
    },
    {
        name: "Goldwyn", 
        type: "Parked Semi-Detached Homes",
        description: "Parks, trails, family-oriented amenities",
        forecast: "+13% in 3 years", 
        amenities: ["Parks", "Trails", "Family amenities"],
        color: 0xFFD700,
        buildingType: "house",
        icon: "🏘️"
    },
    {
        name: "Forest Area",
        type: "Natural Reserve",
        description: "Protected forest land with wildlife",
        forecast: "No development planned",
        amenities: ["Wildlife", "Hiking trails"],
        color: 0x228B22,
        buildingType: "trees",
        icon: "🌲"
    },
    {
        name: "River Valley",
        type: "Waterfront",
        description: "Scenic river views and water access",
        forecast: "Premium location",
        amenities: ["Water access", "Scenic views"],
        color: 0x4682B4,
        buildingType: null,
        icon: "🌊"
    }
];

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background

    // Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 8, 10);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add renderer to DOM
    const container = document.getElementById('scene-container');
    container.appendChild(renderer.domElement);

    // Add lighting
    setupLighting();

    // Create raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2.2;

    // Generate hex map
    generateHexMap();

    // Add event listeners
    setupEventListeners();

    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';

    // Start render loop
    animate();
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
}

function generateHexMap() {
    const radius = 4;
    const hexRadius = 1;
    const hexHeight = 0.1;

    for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        
        for (let r = r1; r <= r2; r++) {
            const s = -q - r;
            
            // Convert hex coordinates to world position
            const x = (3/2 * q) * 1.5;
            const z = (Math.sqrt(3)/2 * q + Math.sqrt(3) * r) * 1.5;
            
            // Assign tile type based on position
            let tileTypeIndex;
            if (Math.abs(q) + Math.abs(r) + Math.abs(s) < 3) {
                tileTypeIndex = Math.random() < 0.5 ? 0 : 1; // Starling or Goldwyn
            } else if (x < 0 && z > 0) {
                tileTypeIndex = 2; // Forest
            } else if (Math.abs(z) < 1) {
                tileTypeIndex = 3; // River
            } else {
                tileTypeIndex = Math.floor(Math.random() * 2); // Random residential
            }
            
            const tileType = tileTypes[tileTypeIndex];
            const y = Math.random() * 0.3 - 0.15; // Slight height variation
            
            // Create hex tile
            const hexTile = createHexTile(x, y, z, hexRadius, hexHeight, tileType);
            hexTile.userData = {
                id: `${q}-${r}-${s}`,
                q, r, s, x, z, y,
                ...tileType
            };
            
            hexTiles.push(hexTile);
            scene.add(hexTile);
            
            // Add buildings if specified
            if (tileType.buildingType) {
                const building = createBuilding(tileType.buildingType, x, y + hexHeight + 0.1, z);
                buildings.push(building);
                scene.add(building);
            }
        }
    }
}

function createHexTile(x, y, z, radius, height, tileType) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 6);
    const material = new THREE.MeshLambertMaterial({ 
        color: tileType.color,
        transparent: true,
        opacity: 0.8
    });
    
    const hex = new THREE.Mesh(geometry, material);
    hex.position.set(x, y, z);
    hex.castShadow = true;
    hex.receiveShadow = true;
    
    return hex;
}

function createBuilding(type, x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    if (type === 'house') {
        // House base
        const houseGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const houseColors = [0x8B4513, 0xA0522D, 0xD2691E, 0xCD853F];
        const houseMaterial = new THREE.MeshLambertMaterial({ 
            color: houseColors[Math.floor(Math.random() * houseColors.length)]
        });
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        house.position.y = 0.3;
        house.castShadow = true;
        group.add(house);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(0.5, 0.4, 4);
        const roofColors = [0x800000, 0x8B0000, 0xA52A2A];
        const roofMaterial = new THREE.MeshLambertMaterial({ 
            color: roofColors[Math.floor(Math.random() * roofColors.length)]
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 0.7;
        roof.castShadow = true;
        group.add(roof);
        
        // Door
        const doorGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.02);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 0.15, 0.31);
        group.add(door);
        
        // Windows
        const windowGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.02);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
        
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(-0.2, 0.25, 0.31);
        group.add(window1);
        
        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(0.2, 0.25, 0.31);
        group.add(window2);
        
    } else if (type === 'trees') {
        const numTrees = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numTrees; i++) {
            const treeX = (Math.random() - 0.5) * 1.2;
            const treeZ = (Math.random() - 0.5) * 1.2;
            const height = 0.8 + Math.random() * 0.4;
            const trunkHeight = height * 0.3;
            const foliageHeight = height * 0.7;
            
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.05, 0.08, trunkHeight, 6);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(treeX, trunkHeight / 2, treeZ);
            trunk.castShadow = true;
            group.add(trunk);
            
            // Foliage
            const foliageGeometry = new THREE.ConeGeometry(0.3 + Math.random() * 0.2, foliageHeight, 8);
            const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.set(treeX, trunkHeight + foliageHeight / 2, treeZ);
            foliage.castShadow = true;
            group.add(foliage);
        }
    }
    
    return group;
}

function setupEventListeners() {
    // Mouse click
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Mouse move for hover effects
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Close popup
    document.getElementById('close-button').addEventListener('click', closePopup);
    
    // Close popup when clicking outside
    document.addEventListener('click', (event) => {
        const popup = document.getElementById('popup');
        if (!popup.contains(event.target) && !event.target.closest('canvas')) {
            closePopup();
        }
    });
}

function onMouseClick(event) {
    event.preventDefault();
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with hex tiles
    const intersects = raycaster.intersectObjects(hexTiles);
    
    if (intersects.length > 0) {
        const clickedTile = intersects[0].object;
        selectedTile = clickedTile;
        
        // Show popup with tile information
        showPopup(clickedTile.userData, event.clientX, event.clientY);
        
        // Highlight selected tile
        updateTileHighlight();
    }
}

function onMouseMove(event) {
    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(hexTiles);
    
    // Reset all tiles to normal state
    hexTiles.forEach(tile => {
        if (tile !== selectedTile) {
            tile.position.y = tile.userData.y;
            tile.material.emissive.setHex(0x000000);
        }
    });
    
    // Highlight hovered tile
    if (intersects.length > 0) {
        const hoveredTile = intersects[0].object;
        if (hoveredTile !== selectedTile) {
            hoveredTile.position.y = hoveredTile.userData.y + 0.05;
            hoveredTile.material.emissive.setHex(0x111111);
        }
        renderer.domElement.style.cursor = 'pointer';
    } else {
        renderer.domElement.style.cursor = 'grab';
    }
}

function updateTileHighlight() {
    // Reset all tiles
    hexTiles.forEach(tile => {
        tile.position.y = tile.userData.y;
        tile.material.emissive.setHex(0x000000);
    });
    
    // Highlight selected tile
    if (selectedTile) {
        selectedTile.material.emissive.setHex(0x333333);
    }
}

function showPopup(tileData, mouseX, mouseY) {
    const popup = document.getElementById('popup');
    
    // Update popup content
    document.getElementById('popup-icon').textContent = tileData.icon;
    document.getElementById('popup-title').textContent = tileData.name;
    document.getElementById('popup-subtitle').textContent = tileData.type;
    document.getElementById('popup-description').textContent = tileData.description;
    document.getElementById('popup-forecast').textContent = tileData.forecast;
    
    // Set forecast color
    const forecastElement = document.getElementById('popup-forecast');
    forecastElement.className = 'forecast-value';
    if (tileData.forecast.includes('+')) {
        forecastElement.classList.add('positive');
    } else if (tileData.forecast.includes('Premium')) {
        forecastElement.classList.add('premium');
    } else {
        forecastElement.classList.add('neutral');
    }
    
    // Update amenities
    const amenitiesList = document.getElementById('popup-amenities');
    amenitiesList.innerHTML = '';
    tileData.amenities.forEach(amenity => {
        const amenityDiv = document.createElement('div');
        amenityDiv.className = 'amenity-item';
        amenityDiv.innerHTML = `<span class="amenity-bullet">•</span>${amenity}`;
        amenitiesList.appendChild(amenityDiv);
    });
    
    // Position popup
    const popupWidth = 300;
    const popupHeight = 400;
    let left = Math.min(mouseX, window.innerWidth - popupWidth - 20);
    let top = Math.min(mouseY, window.innerHeight - popupHeight - 20);
    left = Math.max(20, left);
    top = Math.max(20, top);
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    
    // Show popup
    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('visible'), 10);
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('visible');
    setTimeout(() => {
        popup.classList.add('hidden');
        selectedTile = null;
        updateTileHighlight();
    }, 300);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Animate selected tile
    if (selectedTile) {
        selectedTile.position.y = selectedTile.userData.y + Math.sin(Date.now() * 0.005) * 0.1 + 0.1;
    }
    
    // Animate trees (slight swaying)
    buildings.forEach((building, index) => {
        if (building.children.length > 2) { // Has trees
            building.rotation.y = Math.sin(Date.now() * 0.0005 + index) * 0.05;
        }
    });
    
    // Render the scene
    renderer.render(scene, camera);
}

// Start the application when the page loads
window.addEventListener('load', init);