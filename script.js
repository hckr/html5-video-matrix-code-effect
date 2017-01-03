let localVideoSelector = document.getElementById('local-video-selector'),
    canvasContainer = document.getElementById('canvas-container'),
    blockSize = 10,
    availableCharacters = '१२३४५६७८९अरतयपसदगहजकलङषचवबनमआथय़फशधघझखळक्षछभणऒθωερτψυιοπασδφγηςκλζχξωβνμΘΩΨΠΣΔΦΓΗςΛΞЯЫУИПДФЧЙЛЗЦБ',
    trailLength = 20,
    greenChange = Math.floor(255 / (trailLength * 2)),
    otherChange = Math.floor(255 / (trailLength)),
    stopPreviousAnimation;

function prepareForNewAnimation() {
    if (stopPreviousAnimation) {
        stopPreviousAnimation();
        canvasContainer.innerHTML = '';
        localVideoSelector.type = '';
        localVideoSelector.type = 'file';
        stopPreviousAnimation = undefined;
    }
}

document.getElementById('select-video').addEventListener('click', () => {
    prepareForNewAnimation();
    localVideoSelector.click()
}, false);

localVideoSelector.addEventListener('change', function() {
    let file = this.files[0];
    if (document.createElement('video').canPlayType(file.type) === '') {
        alert(`Unfortunately this browser can't play file of type ${file.type}.`);
        return;
    }
    stopPreviousAnimation = createMatrixPlayer(URL.createObjectURL(file), c => canvasContainer.appendChild(c));
}, false);

function createMatrixPlayer(videoSrc, callback) {
    let videoPlayer = document.createElement('video'),
        tempCanvas = document.createElement('canvas'),
        tempCtx = tempCanvas.getContext('2d'),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        charactersOnCanvas = [],
        columns,
        rows,
        trailHeads = [], // y position for each subsequent column
        interval,
        shouldStopDrawing = false;

    ctx.font = blockSize + 'px monospace';

    function getRandomCharacter() {
        let index = Math.floor(Math.random() * availableCharacters.length);
        return availableCharacters[index];
    }

    function setRandomCharacterAt(pos) {
        return charactersOnCanvas[pos] = getRandomCharacter();
    }

    function getCharacterAt(pos) {
        return charactersOnCanvas[pos] || setRandomCharacterAt(pos);
    }

    function getPossibleRandomCharacterAt(pos) {
        return (Math.random() < 0.001) ?
               setRandomCharacterAt(pos) :
               getCharacterAt(pos);
    }

    function getFillStyle(column, row, r, g, b) {
        let gray = Math.min(r, g, b),
            distanceFromTrailHead = trailHeads[column] - row,
            newR = 0,
            newG = gray,
            newB = 0;
        if (distanceFromTrailHead >= 0 && distanceFromTrailHead < trailLength) {
            newG = 255 - distanceFromTrailHead * greenChange;
            newR = newB = 255 - distanceFromTrailHead * otherChange;
        }
        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    function randomNewTrailHeadPos() {
        return -1 * Math.floor(Math.random() * rows * 30);
    }

    videoPlayer.addEventListener('play', function startMatrixAnimation() {
        videoPlayer.removeEventListener('play', startMatrixAnimation, false);

        canvas.width = videoPlayer.clientWidth;
        canvas.height = videoPlayer.clientHeight;

        columns = Math.floor(canvas.width / blockSize);
        rows = Math.floor(canvas.height / blockSize);

        tempCanvas.width = columns;
        tempCanvas.height = rows;

        requestAnimationFrame(function draw() {
            tempCtx.drawImage(videoPlayer, 0, 0, tempCanvas.width, tempCanvas.height);
            let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let row = -1;
            for (let i = 0, pos = 0; i < imageData.length; i += 4, ++pos) {
                let column = pos % tempCanvas.width;
                if (column == 0) {
                    row += 1;
                }
                let r = imageData[i],
                    g = imageData[i+1],
                    b = imageData[i+2];
                ctx.fillStyle = getFillStyle(column, row, r, g, b);
                ctx.fillText(getPossibleRandomCharacterAt(pos), column * blockSize, row * blockSize);
            }
            if(!shouldStopDrawing) {
                requestAnimationFrame(draw);
            }
        });

        for (let i = 0; i < columns; ++i) {
            trailHeads[i] = randomNewTrailHeadPos();
        }

        interval = setInterval(function updateTrailHeadsLoop() {
            for (let i = 0; i < columns; ++i) {
                trailHeads[i] += 1;
                if (trailHeads[i] >= rows + trailLength) {
                    trailHeads[i] = randomNewTrailHeadPos();
                }
            }
        }, 20);
    }, false);

    videoPlayer.src = videoSrc;
    videoPlayer.autoplay = true;
    canvasContainer.appendChild(videoPlayer);

    callback(canvas);

    return () => {
        shouldStopDrawing = true;
        clearInterval(interval);
    };
}
