let videoPlayer = document.getElementById('video-player'),
    localVideoSelector = document.getElementById('local-video-selector'),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

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
        requestAnimationFrame(function draw() {
            if(videoPlayer.paused || videoPlayer.ended) {
                return false;
            }
            ctx.drawImage(videoPlayer, 0, 0, videoPlayer.width, videoPlayer.height);
            requestAnimationFrame(draw);
        });
    }, false);
