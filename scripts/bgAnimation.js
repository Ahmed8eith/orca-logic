// Register plugins
gsap.registerPlugin(MotionPathPlugin);

const container = document.querySelector('.hero-bg');
let containerRect = container.getBoundingClientRect();
let containerWidth = containerRect.width || window.innerWidth;
let containerHeight = containerRect.height || window.innerHeight;
let observer;
let activeTimelines = new Set();
let isPaused = false;

// Update container dimensions on resize of screen
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        containerRect = container.getBoundingClientRect();
        containerWidth = containerRect.width;
        containerHeight = containerRect.height;
    }, 200);
});

// Generate random blob shape 
function generateBlobShape() {
    return Array.from({length: 8}, 
        () => 50 + Math.random() * 15 + '%'
    ).join(' ');
}

function createBlob() {
    const blob = document.createElement('div');
    blob.className = 'water-blob';
    
    // Color generation
    const hue = 220 + Math.random() * 20;
    const saturation = 70 + Math.random() * 30;
    blob.style.background = `radial-gradient(circle, 
        hsla(${hue}, ${saturation}%, 25%, 0.7) 0%, 
        hsla(${hue}, ${saturation}%, 15%, 0.3) 70%, 
        transparent 100%)`;
    
    container.prepend(blob);
    return blob;
}

function animateBlob(blobType) {
    const blob = createBlob();
    const startX = containerWidth * (blobType === 'right' ? 1.55 : 1.5);
    const startY = -300;

    gsap.set(blob, {
        x: startX,
        y: startY,
        opacity: 1,
        scale: 1
    });

    // Motion paths
    const paths = {
        leftMain: [
            {x: startX, y: startY},
            {x: containerWidth * 0.35, y: containerHeight * 0.25},
            {x: -containerWidth * 0.2, y: containerHeight * 1.0}
        ],
        right: [
            {x: startX, y: startY},
            {x: containerWidth * 0.7, y: containerHeight * 0.5},
            {x: containerWidth * 1.2, y: containerHeight * 1.0}
        ]
    };

    const tl = gsap.timeline({
        onComplete: () => {
            blob.remove();
            activeTimelines.delete(tl);
        }
    });

    activeTimelines.add(tl);

    // Morph animation
    const morphDuration = 4;
    tl.to(blob, {
        borderRadius: generateBlobShape(),
        duration: morphDuration,
        ease: "none",
        repeat: 1
    }, 0);

    // Main animation
    tl.to(blob, {
        duration: 4.5,
        motionPath: {
            path: paths[blobType] || paths.leftMain,
            curviness: 1.5
        },
        scale: blobType === 'right' ? 3 : 3.2,
        ease: "power1.out"
    }, 0)
    .to(blob, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.in"
    }, "-=1.5");
}

// Blob sequence
function startBlobSequence() {
    const createBlobs = () => {
        animateBlob('leftMain');
        animateBlob('right');
    };
    
    createBlobs();
    setInterval(createBlobs, 1500);
}

//Observer setup (pauses animation when user is outside of viewport)
function setupObserver() {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (isPaused) {
                    activeTimelines.forEach(tl => tl.resume());
                    isPaused = false;
                }
            } else {
                if (!isPaused) {
                    activeTimelines.forEach(tl => tl.pause());
                    isPaused = true;
                }
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    });

    observer.observe(container);
}

// Pause all timelines when page is hidden
let isPageVisible = true;

function handleVisibilityChange() {
    if (document.hidden) {
        if (!isPaused) {
            activeTimelines.forEach(tl => tl.pause());
            isPaused = true;
        }
    } else {
        // Resume only if container is in view
        const containerVisible = container?.getBoundingClientRect().top < window.innerHeight;
        if (containerVisible && isPaused) {
            activeTimelines.forEach(tl => tl.resume());
            isPaused = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    startBlobSequence();
    setupObserver();
    document.addEventListener('visibilitychange', handleVisibilityChange); 
});

//clenup
window.addEventListener('beforeunload', () => {
    observer.disconnect();
    activeTimelines.clear();
    document.removeEventListener('visibilitychange', handleVisibilityChange); 
});