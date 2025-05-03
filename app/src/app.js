// Sprite Animation Configuration
const SPRITE_SIZE = 256; // size of each frame (px)
const GRID_COLS = 4;
const GRID_ROWS = 4;
const FRAME_COUNT = GRID_COLS * GRID_ROWS;
const FRAME_RATE = 5; // frames per second

function startSpriteAnimation() {
    const canvas = document.getElementById('sprite-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'static/assets/animation_grid.png';

    let frame = 0;
    img.onload = () => {
        setInterval(() => {
            const col = frame % GRID_COLS;
            const row = Math.floor(frame / GRID_COLS);
            ctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
            ctx.drawImage(
                img,
                col * SPRITE_SIZE, row * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
                0, 0, SPRITE_SIZE, SPRITE_SIZE
            );
            frame = (frame + 1) % FRAME_COUNT;
        }, 1000 / FRAME_RATE);
    };
}

// Start the animation when the page loads
document.addEventListener('DOMContentLoaded', startSpriteAnimation);

// --- src/app.js ---
import { Conversation } from '@11labs/client';

let conversation = null;

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
    } catch (error) {
        console.error('Microphone permission denied:', error);
        return false;
    }
}

async function getSignedUrl() {
    try {
        const response = await fetch('/api/signed-url');
        if (!response.ok) throw new Error('Failed to get signed URL');
        const data = await response.json();
        return data.signedUrl;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
}

async function getAgentId() {
    const response = await fetch('/api/getAgentId');
    const { agentId } = await response.json();
    return agentId;
}

function updateStatus(isConnected) {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.textContent = isConnected ? 'Connected' : 'Disconnected';
    statusElement.classList.toggle('connected', isConnected);
}

function updateSpeakingStatus(mode) {
    const statusElement = document.getElementById('speakingStatus');
    // Update based on the exact mode string we receive
    const isSpeaking = mode.mode === 'speaking';
    statusElement.textContent = isSpeaking ? 'Agent Speaking' : 'Agent Silent';
    statusElement.classList.toggle('speaking', isSpeaking);
    console.log('Speaking status updated:', { mode, isSpeaking }); // Debug log
}

async function startConversation() {
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    
    try {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            alert('Microphone permission is required for the conversation.');
            return;
        }

        const signedUrl = await getSignedUrl();
        //const agentId = await getAgentId(); // You can switch to agentID for public agents
        
        conversation = await Conversation.startSession({
            signedUrl: signedUrl,
            //agentId: agentId, // You can switch to agentID for public agents
            onConnect: () => {
                console.log('Connected');
                updateStatus(true);
                startButton.disabled = true;
                endButton.disabled = false;
            },
            onDisconnect: () => {
                console.log('Disconnected');
                updateStatus(false);
                startButton.disabled = false;
                endButton.disabled = true;
                updateSpeakingStatus({ mode: 'listening' }); // Reset to listening mode on disconnect
            },
            onError: (error) => {
                console.error('Conversation error:', error);
                alert('An error occurred during the conversation.');
            },
            onModeChange: (mode) => {
                console.log('Mode changed:', mode); // Debug log to see exact mode object
                updateSpeakingStatus(mode);
            }
        });
    } catch (error) {
        console.error('Error starting conversation:', error);
        alert('Failed to start conversation. Please try again.');
    }
}

async function endConversation() {
    if (conversation) {
        await conversation.endSession();
        conversation = null;
    }
}

document.getElementById('startButton').addEventListener('click', startConversation);
document.getElementById('endButton').addEventListener('click', endConversation);

window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});