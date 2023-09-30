const userId = new URLSearchParams(window.location.search).get('id');

if (!userId || userId != 'test') {
    window.location = 'index.html';
}

let mediaRecorder;
let audioChunks = [];
let audioBlob;

function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        $('#recording-status').html('Audio recording unsupported!!');
        return;
    }

    if (!mediaRecorder) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    // if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    // }
                };
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
                };
                mediaRecorder.start();
                console.log("Recording... (4 seconds)");
                $('#recording-status').html('Recording... (4 seconds)');
                setTimeout(() => {
                    mediaRecorder.stop();
                    console.log("Finished recording");
                    $('#recording-status').html('Finished recording');
                }, 4000);
            })
            .catch((error) => {
                $('#recording-status').html('Error:' + error);
            });
    } else {
        mediaRecorder.start();
        console.log("Recording... (4 seconds)");
        $('#recording-status').html('Recording... (4 seconds)');
        setTimeout(() => {
            mediaRecorder.stop();
            console.log("Finished recording");
            $('#recording-status').html('Finished recording');
        }, 4000);
    }
}

function playAudio() {
    const audioUrl = URL.createObjectURL(audioBlob);
    analyzeAudio(audioUrl);
}

function analyzeAudio(audioUrl) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const audioElement = new Audio(audioUrl);
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // audioElement.addEventListener('ended', () => {
    //     const analyserData = new Uint8Array(analyser.frequencyBinCount);
    //     analyser.getByteFrequencyData(analyserData);

    //     console.log(analyserData);

    //     // Find the bin corresponding to the 1000Hz frequency
    //     const binSize = audioContext.sampleRate / analyser.fftSize;
    //     const targetBin = Math.round(1000 / binSize);

    //     // Check if the amplitude of the target bin is above a threshold
    //     const threshold = 128; // Adjust this threshold as needed

    //     let total = 0;
    //     for (var i = 105; i < 115; i++) {
    //         total += analyserData[i];
    //     }

    //     $('#recording-status').html('Total detection on 25kHz frequency is:' + total + '\nRest is: ' + analyserData);

    //     if (analyserData[targetBin] > threshold) {
    //         console.log('Frequency 1000Hz detected!');
    //     } else {
    //         console.log('Frequency 1000Hz not detected.');
    //     }
    // });

    $('#recording-status').html("Playing audio with URL " + audioUrl);
    console.log("Playing audio with URL " + audioUrl);
    audioElement.src = audioUrl;
    audioElement.play();

    setTimeout(() => {
        const analyserData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(analyserData);

        console.log(analyserData);

        // Find the bin corresponding to the 1000Hz frequency
        const binSize = audioContext.sampleRate / analyser.fftSize;
        const targetBin = Math.round(1000 / binSize);

        // Check if the amplitude of the target bin is above a threshold
        const threshold = 128; // Adjust this threshold as needed

        let total = 0;
        for (var i = 105; i < 115; i++) {
            total += analyserData[i];
        }

        $('#recording-status').html('Total detection after 4s on 25kHz frequency is:' + total + '\nRest is: ' + analyserData);

        if (analyserData[targetBin] > threshold) {
            console.log('Frequency 1000Hz detected!');
        } else {
            console.log('Frequency 1000Hz not detected.');
        }
    }, 4000);
}