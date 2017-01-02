let videoPlayer = document.getElementById('video-player'),
    localVideoSelector = document.getElementById('local-video-selector'),
    tempCanvas = document.createElement('canvas'),
    tempCtx = tempCanvas.getContext('2d'),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    blockSize = 10,
    availableCharacters = '१२३४५६७८९अरतयपसदगहजकलङषचवबनमआथय़फशधघझखळक्षछभणऒθωερτψυιοπασδφγηςκλζχξωβνμΘΩΨΠΣΔΦΓΗςΛΞЯЫУИПДФЧЙЛЗЦБ',
    charactersOnCanvas = [];

ctx.font = blockSize + 'px monospace';

document.getElementById('select-video').addEventListener('click',
    () => localVideoSelector.click(), false);

localVideoSelector.addEventListener('change',
    function() {
        let file = this.files[0];
        if (videoPlayer.canPlayType(file.type) === '') {
            alert(`Unfortunately this browser can't play file of type ${file.type}.`);
            return;
        }
        videoPlayer.src = URL.createObjectURL(file);
    }, false);

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
    return (Math.random() < 0.0001) ?
           setRandomCharacterAt(pos) :
           getCharacterAt(pos);
}

let columns = Math.floor(videoPlayer.width / blockSize),
    rows = Math.floor(videoPlayer.height / blockSize),
    trailHeads = [], // y position for each subsequent column
    trailLength = 20,
    greenChange = Math.floor(255 / (trailLength * 2)),
    otherChange = Math.floor(255 / (trailLength));

for (let i = 0; i < columns; ++i) {
    trailHeads[i] = 0;
}

setInterval(function updateTrailHeadsLoop() {
    for (let i = 0; i < columns; ++i) {
        trailHeads[i] += 1;
        if (trailHeads[i] >= rows + trailLength) {
            trailHeads[i] = -1 * Math.floor(Math.random() * rows * 40);
        }
    }
}, 33);

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

videoPlayer.addEventListener('play',
    () => {
        tempCanvas.width = columns;
        tempCanvas.height = rows;

        requestAnimationFrame(function draw() {
            tempCtx.drawImage(videoPlayer, 0, 0, tempCanvas.width, tempCanvas.height);
            let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            ctx.fillStyle = 'rgb(0, 10, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            requestAnimationFrame(draw);
        });
    }, false);
