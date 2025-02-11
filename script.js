const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const question = document.getElementById('question');

let noAttempts = 0;
const maxSize = 50;

function increaseYesButtonSize() {
    if (parseInt(window.getComputedStyle(yesBtn).fontSize) >= maxSize) return;
    noAttempts++;
    const newSize = 18 + (noAttempts * 3);
    const fontSize = Math.min(newSize, maxSize);
    yesBtn.style.fontSize = `${fontSize}px`;
    yesBtn.style.padding = `${10 + noAttempts * 2}px ${20 + noAttempts * 2}px`;
}

function getRandomPosition() {
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    const zones = [
        {
            minX: 0,
            maxX: viewportWidth - btnWidth,
            minY: 0,
            maxY: containerRect.top - btnHeight
        },
        {
            minX: 0,
            maxX: viewportWidth - btnWidth,
            minY: containerRect.bottom,
            maxY: viewportHeight - btnHeight
        }
    ];
    
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const x = Math.max(0, Math.min(zone.maxX, Math.random() * zone.maxX));
    const y = Math.max(zone.minY, Math.min(zone.maxY, zone.minY + Math.random() * (zone.maxY - zone.minY)));
    
    return { x, y };
}

let isMoving = false;
let moveTimeout;
let mouseTimeout;

function moveButton() {
    if (!isMoving) return;
    const pos = getRandomPosition();
    noBtn.style.transition = 'all 0.6s ease';
    noBtn.style.left = `${pos.x}px`;
    noBtn.style.top = `${pos.y}px`;
    moveTimeout = setTimeout(moveButton, Math.random() * 400 + 100);
}

function startMoving() {
    isMoving = true;
    noBtn.style.position = 'fixed';
    noBtn.style.pointerEvents = 'none';
    moveButton();
}

function autoDodge() {
    const safeDistance = 150;
    const activationDistance = 250;

    document.addEventListener('mousemove', (e) => {
        const buttonRect = noBtn.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(mouseX - buttonCenterX, 2) + 
            Math.pow(mouseY - buttonCenterY, 2)
        );

        if (distance < activationDistance) {
            if (!isMoving) startMoving();
            
            if (distance < safeDistance) {
                const pos = getRandomPosition();
                noBtn.style.transition = 'all 0.2s ease';
                noBtn.style.left = `${pos.x}px`;
                noBtn.style.top = `${pos.y}px`;
            }
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMoving = false;
                clearTimeout(moveTimeout);
            }, 500);
        }
    });
}

noBtn.addEventListener('mouseover', () => {
    startMoving();
    increaseYesButtonSize();
});

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMoving();
    increaseYesButtonSize();
});

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

window.addEventListener('resize', () => {
    if (noBtn.style.position === 'fixed') {
        const pos = getRandomPosition();
        noBtn.style.left = `${pos.x}px`;
        noBtn.style.top = `${pos.y}px`;
    }
});

yesBtn.addEventListener('click', () => {
    question.textContent = 'YIIIIIIIIIIIEEEEE you like me pala';
    document.getElementById('gifImage').src = 'https://media1.tenor.com/m/h_cxNMxONl0AAAAd/yippe-genshin.gif';
    noBtn.style.display = 'none';
    yesBtn.style.display = 'none';
});

autoDodge();
