// Sprite Animation Configuration
const SPRITE_SIZE = 256; // size of each frame (px)
const GRID_COLS = 4;
const GRID_ROWS = 4;
const FRAME_COUNT = GRID_COLS * GRID_ROWS;
const FRAME_RATE = 8; // frames per second

let animationInterval = null;
let spriteFrame = 0;
let spriteImg = null;
let currentSprite = null; // 'speaking' or 'listening'

const SPRITE_PATHS = {
    speaking: 'static/assets/animation_grid.png',
    listening: 'static/assets/animation_grid_listening.png'
};

function drawSpriteFrame(ctx, img, frame) {
    const col = frame % GRID_COLS;
    const row = Math.floor(frame / GRID_COLS);
    ctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    ctx.drawImage(
        img,
        col * SPRITE_SIZE, row * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE,
        0, 0, SPRITE_SIZE, SPRITE_SIZE
    );
}

function startSpriteAnimation(mode) {
    const spriteType = mode === 'speaking' ? 'speaking' : 'listening';
    if (currentSprite === spriteType && animationInterval) return; // Already running this sprite
    stopSpriteAnimation(); // Stop any previous animation
    currentSprite = spriteType;
    spriteFrame = 0;
    const canvas = document.getElementById('sprite-canvas');
    const ctx = canvas.getContext('2d');
    spriteImg = new Image();
    spriteImg.src = SPRITE_PATHS[spriteType];
    spriteImg.onload = () => {
        animationInterval = setInterval(() => {
            drawSpriteFrame(ctx, spriteImg, spriteFrame);
            spriteFrame = (spriteFrame + 1) % FRAME_COUNT;
        }, 1000 / FRAME_RATE);
    };
}

function stopSpriteAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    // Optionally clear the canvas or leave the last frame visible
}

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

function getAgentIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('agentId') || 'xj5vNrQBEgYg7GhB8jGy'; // default agent
}

async function getSignedUrl(agentId) {
    const response = await fetch('/api/signed-url?agentId=' + encodeURIComponent(agentId));
    const data = await response.json();
    return data.signedUrl;
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
        const agentId = getAgentIdFromUrl();
        const signedUrl = await getSignedUrl(agentId);
        
        conversation = await Conversation.startSession({
            signedUrl: signedUrl,
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
                updateSpeakingStatus({ mode: 'listening' });
                stopSpriteAnimation();
            },
            onError: (error) => {
                console.error('Conversation error:', error);
                alert('An error occurred during the conversation.');
            },
            onModeChange: (mode) => {
                console.log('Mode changed:', mode);
                updateSpeakingStatus(mode);
                if (mode.mode === 'speaking') {
                    startSpriteAnimation('speaking');
                } else {
                    startSpriteAnimation('listening');
                }
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
        stopSpriteAnimation();
    }
}

document.getElementById('startButton').addEventListener('click', startConversation);
document.getElementById('endButton').addEventListener('click', endConversation);

window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});