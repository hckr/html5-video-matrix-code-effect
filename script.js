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

videoPlayer.addEventListener('play',
    () => {
        tempCanvas.width = videoPlayer.width / blockSize;
        tempCanvas.height = videoPlayer.height / blockSize;

        requestAnimationFrame(function draw() {
            tempCtx.drawImage(videoPlayer, 0, 0, tempCanvas.width, tempCanvas.height);
            let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            ctx.fillStyle = 'rgb(0, 10, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            let y = -1;
            for (let i = 0, pos = 0; i < imageData.length; i += 4, ++pos) {
                let x = (pos % tempCanvas.width) * blockSize;
                if (x == 0) {
                    y += blockSize;
                }
                let r = imageData[i],
                    g = imageData[i+1],
                    b = imageData[i+2],
                    gray = Math.min(r, g, b);
                ctx.fillStyle = `rgb(0, ${gray}, 0)`;
                ctx.fillText(getPossibleRandomCharacterAt(pos), x, y);
            }
            requestAnimationFrame(draw);
        });
    }, false);
