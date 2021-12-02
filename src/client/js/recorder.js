import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
//ffmpeg allows us to transcode video
//we can use it on the frontend thanks to webassembly

const actionBtn = document.querySelector('.actionBtn');
const video = document.querySelector('.preview')

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName
    document.body.appendChild(a)
    a.click();
}

const handleDownload = async() => {

    actionBtn.removeEventListener('click', handleDownload)
    actionBtn.innerText = 'Transcoding ...' 
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({
        corePath: "https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js",
        log: true
    });
    await ffmpeg.load();

    ffmpeg.FS('writeFile', files.input, await fetchFile(videoFile))
    //we write a file on the imaginary File System(memory) with the videoFile
    //the name of file is recording.webm

    await ffmpeg.run("-i", files.input, "-r", "60", files.output); 
    //the input is "recording.webm"
    //the rate of this is 60fp/s and get output.mp4

    await ffmpeg.run('-i', files.output, "-ss", "00:00:01", "-frames:v", "1", files.thumb);
    //input is recording.webm
    //go to second "00:00:01" and take 1 screenshot
    //output is thumbnail.jpg

    const mp4File = ffmpeg.FS('readFile', files.output)
    const thumbFile = ffmpeg.FS('readFile', files.thumb)
    //we read files and the return value of these are unit8Array
    //meaning unsigned unteger. Positive integer

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"})
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"})
    //representation 이 아니라 actual file을 얻으려면 unit8array.buffer

    const mp4Url = URL.createObjectURL(mp4Blob)
    const thumbUrl = URL.createObjectURL(thumbBlob)

    downloadFile(mp4Url, "MyRecording.mp4")
    downloadFile(thumbUrl, "MyThumbnail.jpg")

    ffmpeg.FS('unlink', files.input)
    ffmpeg.FS("unlink", files.output)
    ffmpeg.FS('unlink', files.thumb)

    URL.revokeObjectURL(mp4Url)
    URL.revokeObjectURL(thumbFile)
    URL.revokeObjectURL(videoFile)

    actionBtn.disabled = false;
    actionBtn.innerText = 'Record Again'
    actionBtn.addEventListener('click', handleStart)
};

const handleStart = () => {
    actionBtn.innerText = 'Recording...'
    actionBtn.disabled = true;
    actionBtn.removeEventListener('click', handleStart)
    recorder = new MediaRecorder(stream, {mimeType: "video/webm"});
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data)
        video.srcObject = null;
        video.src = videoFile;
        //video.loop = true;
        video.play()
        actionBtn.innerText = 'Download';
        actionBtn.disabled = false;
        actionBtn.addEventListener('click', handleDownload)
    }
    recorder.start();
    setTimeout(()=> {
        recorder.stop()
    }, 5000)
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: 1024,
            height: 576
        }
    })
    video.srcObject = stream;
    video.play()
}

init()

actionBtn.addEventListener('click', handleStart)