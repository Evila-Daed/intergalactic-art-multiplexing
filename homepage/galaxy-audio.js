const audioFiles = [
    "audio/1.mp3",
    "audio/2.mp3",
    "audio/3.mp3",
    "audio/4.mp3",
    "audio/5.mp3",
    "audio/6.mp3",
    "audio/7.mp3",
    "audio/8.mp3",
    "audio/9.mp3",
    "audio/10.mp3",
    "audio/11.mp3",
    "audio/12.mp3"
];

let activeAudios = [];

function startAudioSystem() {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            playRandomClip();
        }, random(2000, 10000));
    }
}

function playRandomClip() {
    let file = random(audioFiles);
    let audio = new Audio(file);
    audio.volume = 0;
    audio.addEventListener("loadedmetadata", () => {
        let clipDuration = random(10, 30);
        if (audio.duration < clipDuration) {
            clipDuration = audio.duration;
        }
        let maxStart = audio.duration - clipDuration;
        let start = maxStart > 0 ? random(maxStart) : 0;
        audio.currentTime = start;
        audio.play()
            .then(() => {
                fadeIn(audio, 1.5);
                setTimeout(() => {
                    fadeOut(audio, 1.5, () => {
                        audio.pause();
                        try {
                            audio.currentTime = 0;
                        } catch (e) { }
                        playRandomClip();
                    });
                }, Math.max((clipDuration - 1.5) * 1000, 0));
            })
            .catch(err => {
                console.log("Audio blocked:", err);
            });
    });
    activeAudios.push(audio);
}

function fadeIn(audio, time) {
    let start = performance.now();
    function fade(now) {
        let progress = (now - start) / (time * 1000);
        if (progress < 1) {
            audio.volume = Math.max(
                0,
                Math.min(1, progress)
            );
            requestAnimationFrame(fade);
        } else {
            audio.volume = 1;
        }
    }
    requestAnimationFrame(fade);
}

function fadeOut(audio, time, callback) {
    let start = performance.now();
    let initialVolume = audio.volume;
    function fade(now) {
        let progress = (now - start) / (time * 1000);
        if (progress < 1) {
            let volume = initialVolume * (1 - progress);
            audio.volume = Math.max(
                0,
                Math.min(1, volume)
            );
            requestAnimationFrame(fade);
        } else {
            audio.volume = 0;
            if (callback) {
                callback();
            }
        }
    }
    requestAnimationFrame(fade);
}