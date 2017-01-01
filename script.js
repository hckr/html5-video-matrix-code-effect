let videoPlayer = document.getElementById('video-player'),
    localVideoSelector = document.getElementById('local-video-selector');

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
