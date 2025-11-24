import EventGear from './src/utils/EventGear.js';
// Initialize ClickCounter
const ClickCounter = new EventGear(1000); // Allow for 1000 historical entries

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timeframeSelect = document.getElementById('timeframe');
const modeSelect = document.getElementById('modeCpsMax');
const puzzleGame = document.getElementById('puzzleGame');
const puzzlePieces = document.getElementById('puzzlePieces');
const checkPuzzleButton = document.getElementById('checkPuzzle');
const circles = [];
const stars = [];
const puzzleOrder = [1, 2, 3, 4, 5];
let currentOrder = [];
let lastCircleColor = '#FFFFFF';
let lastStarColor = '#800080';
let maxCPSBreak = 9;
let currentModeIndex = 0;
let menuHeight = document.querySelector('.menu').offsetHeight;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.menu').offsetHeight;
    menuHeight = document.querySelector('.menu').offsetHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Manual color selection functions
let manualColorArray = [
    '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF8000', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008080', '#8B4513', '#A52A2A', '#D2691E', '#CD853F', '#DEB887'
];

function cycleColor(colorInput) {
    let indexChange = manualColorArray.indexOf(colorInput.toUpperCase());
    if (indexChange === -1) {
        indexChange = 0;
    }
    indexChange = (indexChange + 1) % manualColorArray.length;
    return manualColorArray[indexChange];
}

const drawCircles = () => {
    circles.forEach((circle, index) => {
        ctx.beginPath();
        const currentColor = cycleColor(lastCircleColor);
        lastCircleColor = currentColor;
        const r = parseInt(currentColor.slice(1, 3), 16);
        const g = parseInt(currentColor.slice(3, 5), 16);
        const b = parseInt(currentColor.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${circle.opacity})`;
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
        circle.radius += 2;
        circle.opacity -= 0.05;
        if (circle.opacity <= 0) {
            circles.splice(index, 1);
        }
    });
};

const drawStars = () => {
    stars.forEach((star, index) => {
        ctx.beginPath();
        const currentColor = cycleColor(lastStarColor);
        lastStarColor = currentColor;
        const r = parseInt(currentColor.slice(1, 3), 16);
        const g = parseInt(currentColor.slice(3, 5), 16);
        const b = parseInt(currentColor.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.opacity})`;
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(Math.PI / 180 * 45);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(0, star.radius);
            ctx.rotate(Math.PI / 180 * 144);
            ctx.lineTo(0, star.radius / 2.5);
            ctx.rotate(Math.PI / 180 * 144);
        }
        ctx.fill();
        ctx.restore();
        star.opacity -= 0.05;
        if (star.opacity <= 0) {
            stars.splice(index, 1);
        }
    });
};

const drawThermometer = (height) => {
    const thermWidth = 100;
    const thermHeight = canvas.height * 0.6;
    const thermX = 10;
    const thermY = canvas.height * 0.3;

    ctx.fillStyle = 'white';
    ctx.fillRect(thermX, thermY, thermWidth, thermHeight);

    const gradient = ctx.createLinearGradient(thermX, thermY + thermHeight, thermX, thermY);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'red');

    ctx.fillStyle = gradient;
    ctx.fillRect(thermX, thermY + thermHeight - (height * thermHeight), thermWidth, height * thermHeight);
};

const updateGame = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (ClickCounter.getIsActive) {
        drawCircles();
        drawStars();
        
        // Draw thermometer based on current frequency
        drawThermometer(Math.min(ClickCounter.getShortTermFrequency() / maxCPSBreak, 1));
        
	// Display metrics
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText(`Max CPS: ${ClickCounter.getMaxFrequency().toFixed(1)}`, 10, 30);
	ctx.fillText(`Last CPS: ${ClickCounter.getLastTimeframeFrequency().toFixed(1)}`, 10, 60);
	ctx.fillText(`Jitter: ${ClickCounter.getShortTermJitter().toFixed(3)} ms`, 10, 90); // New line for short-term jitter
	ctx.fillText(`Total: ${ClickCounter.getEventCountTotal()}`, 10, 120);
	ctx.fillText(`CPM: ${ClickCounter.getEventCountLastMinute().toFixed(0)}`, 10, 150);
	ctx.fillText(`CPS: ${ClickCounter.getShortTermFrequency().toFixed(1)}`, 10, 180);
    }
    requestAnimationFrame(updateGame); // Continue updating the game
};

/**
 * Handles mouse events and creates visual effects.
 * @param {MouseEvent} e - The mouse event object.
 */
const drawMouseEffects = (e, radiusFactor = 1) => {
    try {
        const { clientX, clientY } = e;
        const adjustedY = clientY - menuHeight;

        // Add circles and stars with adjusted coordinates
        circles.push({ x: clientX, y: adjustedY, radius: 5 * radiusFactor, opacity: 1 });
        stars.push({ x: clientX, y: adjustedY, radius: 10 * radiusFactor, opacity: 1 });
    } catch (error) {
        console.error('Error drawing mouse events:', error);
    }
}

const startGame = () => {
    ClickCounter.reset(); 							// Reset event counter
    ClickCounter.start(); 							// Start counting events
    ClickCounter.setFrameDuration(parseInt(timeframeSelect.value));		// Set timeframe duration
    currentModeIndex = modeSelect.selectedIndex; 				// Get selected mode
    maxCPSBreak = parseFloat(modeSelect.value); 				// Set maximum CPS threshold
    if (maxCPSBreak <= 333) {
    	ClickCounter.setCallbackIntervalCount(10, (e) => {drawMouseEffects (e, 5);});
	// Set up total running time Alarm with callback
	ClickCounter.setCallbackTotalTime(60, () => {
	    alert("Congratulations! You've played 1 minute!"); // Show alert message
	    ClickCounter.setCallbackTotalTime(300, () => {
	    	alert("Congratulations! You've played 5 minute!"); // Show alert message
	    });
	});

        // Set up frequency alarm with callback
        ClickCounter.setCallbackFrequency(0, maxCPSBreak, () => {
	    ClickCounter.stop(); // Trigger broken state when alarm is hit
	    startRepairGame(); // Call function to handle "thermometer break"
        });
   	// Set up total count alarm for 100 clicks
    	const clickGoal = 100; // Define the click achievement goal
	ClickCounter.setCallbackTotalCount(clickGoal, () => {
	    alert("Congratulations! You've reached 100 clicks!"); // Show alert message
	    // Now set up another total count alarm for 1,000 clicks
	    const nextClickGoal = 1000; // Define the next click achievement goal
	    ClickCounter.setCallbackTotalCount(nextClickGoal, () => {
		alert("Congratulations! You've reached 1,000 clicks!"); // Show alert message for 1,000 clicks
	    });
	});
    } else {
	ClickCounter.resetCallbacksWithTresholds();
    }
    updateGame(); // Start updating the game visuals
};

// Click event to register user clicks and create visual effects
ClickCounter.linkEventListener(canvas, 'click', drawMouseEffects);

document.getElementById('hackButton').addEventListener('click', async () => {
    // Deactivate callbacks
    ClickCounter.setCallbackIsActivatedEventResponse(false);
    ClickCounter.setCallbackIsActivatedIntervalCount(false);
    // Register multiple events (ensure this respects the deactivation state)
    const eventCount = Math.min(parseInt(document.getElementById('hackInput').value, 10), 100000) || 0;
    await ClickCounter.registerMultipleEvents(eventCount);
    // Reactivate callbacks after registration is complete
    ClickCounter.setCallbackIsActivatedEventResponse(true);
    ClickCounter.setCallbackIsActivatedIntervalCount(true);
});

// Function to start the repair mini-game when CPS limit is exceeded
const startRepairGame = () => {
    puzzleGame.style.display = 'block'; // Show puzzle game UI
    currentOrder = [...puzzleOrder].sort(() => Math.random() - 0.5); // Shuffle pieces randomly
    renderPuzzlePieces(); // Render puzzle pieces for user interaction
};

// Function to render puzzle pieces for the repair game
const renderPuzzlePieces = () => {
   puzzlePieces.innerHTML=''; 
   currentOrder.forEach(piece => {
       const pieceElement=document.createElement('div');
       pieceElement.textContent=piece; 
       pieceElement.addEventListener('click',()=>movePiece(piece)); 
       puzzlePieces.appendChild(pieceElement); 
   });
};

// Function to move a puzzle piece in the repair game
const movePiece=(piece)=>{ 
   const index=currentOrder.indexOf(piece); 
   if(index>0){ 
       [currentOrder[index],currentOrder[index-1]]=[currentOrder[index-1],currentOrder[index]]; 
       renderPuzzlePieces(); 
   } 
};

// Function to check if the puzzle is solved correctly by comparing orders
const checkPuzzle=()=>{ 
   if(JSON.stringify(currentOrder)===JSON.stringify(puzzleOrder)){ 
       alert('Thermometer fixed! You can continue playing.');
       puzzleGame.style.display='none'; 
       startGame();
       currentModeIndex=(currentModeIndex+1)%modeSelect.options.length; 
       modeSelect.selectedIndex=currentModeIndex; 
   } else { 
       alert('Not quite right. Try again!'); 
   }
};

// Event listeners for changing timeframe and checking puzzle completion 
timeframeSelect.addEventListener('change', startGame); // Reset game on timeframe change
modeSelect.addEventListener('change', startGame); // Reset game on mode change
checkPuzzleButton.addEventListener('click', checkPuzzle);

// Start the game immediately when loaded 
document.addEventListener('DOMContentLoaded', () => {
    startGame();
});
