let videoPlayer = document.getElementById('video-player'),
    localVideoSelector = document.getElementById('local-video-selector'),
    tempCanvas = document.createElement('canvas'),
    tempCtx = tempCanvas.getContext('2d'),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    blockSize = 10;

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

videoPlayer.addEventListener('play',
    () => {
        tempCanvas.width = videoPlayer.width / blockSize;
        tempCanvas.height = videoPlayer.height / blockSize;

        requestAnimationFrame(function draw() {
            if(videoPlayer.paused || videoPlayer.ended) {
                return false;
            }
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
                ctx.fillText('x', x, y);
            }
            requestAnimationFrame(draw);
        });
    }, false);
