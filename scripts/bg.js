// Register plugins
gsap.registerPlugin(MotionPathPlugin, CustomEase);

const container = document.querySelector('.hero-bg');

// Generate random blob shape
function generateBlobShape() {
    const baseRadius = 50;
    const variance = 15;
    
    // Generate random radii
    const r1 = baseRadius + Math.random() * variance;
    const r2 = baseRadius + Math.random() * variance;
    const r3 = baseRadius + Math.random() * variance;
    const r4 = baseRadius + Math.random() * variance;
    const r5 = baseRadius + Math.random() * variance;
    const r6 = baseRadius + Math.random() * variance;
    const r7 = baseRadius + Math.random() * variance;
    const r8 = baseRadius + Math.random() * variance;
    
    return `${r1}% ${r2}% ${r3}% ${r4}% / ${r5}% ${r6}% ${r7}% ${r8}%`;
}

function createBlob() {
    // Create a new blob
    const blob = document.createElement('div');
    blob.className = 'water-blob';
    
    // Randomize the blue hue slightly
    const blueHue = 220 + Math.random() * 20;
    const saturation = 70 + Math.random() * 30;
    const lightness = 25 + Math.random() * 10; 

    blob.style.background = `radial-gradient(circle, 
        hsla(${blueHue}, ${saturation}%, ${lightness}%, 0.8) 0%, 
        hsla(${blueHue}, ${saturation}%, ${Math.max(lightness - 10, 5)}%, 0.4) 70%, 
        hsla(${blueHue}, ${saturation}%, ${Math.max(lightness - 15, 0)}%, 0) 100%)`;
    
    // Add blob to the beginning of container to ensure it's behind content
    container.prepend(blob);
    return blob;
}

function animateBlob(blobType = 'leftMain') {
    // Create a new blob
    const blob = createBlob();
    
    // Container dimensions (for more accurate positioning)
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width || window.innerWidth;
    const containerHeight = containerRect.height || window.innerHeight;
    
    // Initial position based on blob type - FIXED STARTING POSITIONS
    let startX;
    
    // Set starting positions
    if (blobType === 'leftMain') {
        startX = containerWidth * 1.5; // Center for main left blob
    } 
    else if (blobType === 'leftSecondary') {
        startX = containerWidth * 1.5; // Center for secondary left blob (same as main left)
    } 
    else {
        startX = containerWidth * 1.55; // Slightly right of center for right blob
    }
    
    const startY = -300; // Start above the viewport
    
    // Set initial styles
    gsap.set(blob, {
        x: startX,
        y: startY, 
        opacity: 1,
        scale: 1
    });
    
    // Create a custom path for the animation based on blob type
    let path;
    
    if (blobType === 'leftMain') {
        // Main left blob - moves directly left
        path = [
            {x: startX, y: startY}, // Start position at center
            {x: containerWidth * 0.35, y: containerHeight * 0.25}, // Move left immediately
            {x: containerWidth * 0.2, y: containerHeight * 0.5}, // Continue left
            {x: containerWidth * 0.05, y: containerHeight * 0.75}, // Further left
            {x: -containerWidth * 0.2, y: containerHeight * 1.0} // Exit left
        ];
    } 
    else if (blobType === 'leftSecondary') {
        // Secondary left blob - moves left but at a different angle
        path = [
            {x: startX, y: startY}, // Start position at center
            {x: containerWidth * 1.5, y: containerHeight * 0.3}, // Move left at different angle
            {x: containerWidth * 1.4, y: containerHeight * 0.6}, // Continue on different path
            {x: containerWidth * 0.1, y: containerHeight * 0.9}, // Different exit path
            {x: -containerWidth * 0.1, y: containerHeight * 1.1} // Exit left
        ];
    } 
    else {
        // Right blob - moves right from a position slightly right of center
        path = [
            {x: startX, y: startY}, // Start position slightly right of center
            {x: containerWidth * 0.7, y: containerHeight * 0.25}, // Move right immediately
            {x: containerWidth * 0.85, y: containerHeight * 0.5}, // Continue right
            {x: containerWidth * 0.95, y: containerHeight * 0.75}, // Further right
            {x: containerWidth * 1.2, y: containerHeight * 1.0} // Exit right
        ];
    }
    
    // Create the timeline for the animation
    const tl = gsap.timeline({
        onComplete: () => {
            blob.remove(); 
        }
    });
    
    // Shape morphing animation
    const morphTimeline = gsap.timeline({repeat: 2});
    for (let i = 0; i < 5; i++) {
        morphTimeline.to(blob, {
            duration: 2.4,
            borderRadius: generateBlobShape(),
            ease: "sine.inOut"
        });
    }
    
    // Adjust scale based on blob type
    let maxScale = 3.5;
    if (blobType === 'leftSecondary') {
        maxScale = 3.2; // Make secondary left blob slightly smaller
    }
    
    // Main animation
    tl.to(blob, {
        duration: 0.5, 
        opacity: 0.9, 
        ease: "power1.in" 
    })
    .to(blob, {
        duration: 3,
        motionPath: {
            path: path,
            curviness: 2,
            autoRotate: false
        },
        scale: maxScale,
        ease: "none",
        onUpdate: () => {
            // Ensure the scale increases as it moves
            const progress = tl.progress();
            if (progress > 0.5 && progress < 0.8) {
                // Make it grow even larger during movement
                gsap.to(blob, {
                    scale: maxScale + 0.3,
                    duration: 0.1,
                    overwrite: false
                });
            }
        }
    }, 0) // Start at the same time as opacity animation
    .to(blob, {
        duration: 2.5,
        opacity: 0,
        ease: "power2.out",
    }, 4.5); // Start fading out a bit earlier
    
    // Add the morphing animation
    tl.add(morphTimeline, 0);
}

// Create new triple blobs periodically
function startBlobSequence() {
    // Function to create all three blobs at once
    function createTripleBlobs() {
        animateBlob('leftMain');      // Main left blob
        animateBlob('leftSecondary'); // Secondary left blob with slight variation
        animateBlob('right');         // Right blob
    }
    
    // Create initial blobs
    createTripleBlobs();
    
    // Then create new ones periodically
    setInterval(createTripleBlobs, 1000); // Slightly increased interval for performance with 3 blobs
}

// Start the animation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    startBlobSequence();
});