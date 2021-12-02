const videoContainer = document.querySelector('.videoContainer')
const video = document.querySelector('video');
const videoControls = document.querySelector('.videoControls');

const playContainer = document.querySelector('.playContainer');
const playBtn = document.querySelector('.playBtn')
const playBtnIcon = playBtn.querySelector('i')
const time = document.querySelector('.time')
const totalTime = document.querySelector('.totalTime')
const currentTime = document.querySelector('.currentTime')
const timeline = document.querySelector('.timeline')

const volumnContainer = document.querySelector('.volumeContainer')
const volumeRange = document.querySelector(".volumeRange");
const muteBtn = document.querySelector('.mute')
const muteBtnIcon = muteBtn.querySelector('i')

const screenContainer = document.querySelector('.screenContainer')
const fullScreenBtn = document.querySelector(".fullScreenBtn")
const fullScreenBtnIcon = fullScreenBtn.querySelector('i')

let mouseLeaveTimeout = null;
let insideMoveTimeout = null;
let volumeValue = 0.5
video.volumn = volumeValue

const handlePlayClick = (e) => {
    if(video.paused){
        video.play()
    } else {
        video.pause()
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-up" : "fas fa-volume-mute";
    volumeRange.value = video.muted ? 0 : volumeValue
}

const handleVolumeChange = (event) => {
    const {target: {value}} = event;
    if(video.muted){
        video.muted = false;
    }
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11,8)
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration))
}

const handleTimeUpdate = () =>{
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
    timeline.max = Math.floor(video.duration)
}

//below readyState#11.6강의 댓글에서 찾음 stackoverflow 에서 찾은 답변 
//readyState 0 means 'No info available, readtState 2 means' Data is available for the urrent playback position
if (video.readyState >= 2) {
    handleLoadedMetadata()
}

const handleTimelineChange = (event) =>{
    const {target: {value}} = event;
    video.currentTime = value
}

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    //The Element object that's currently in full-screen mode
    if(fullscreen){
        document.exitFullscreen()
        fullScreenBtnIcon.classList = 'fas fa-expand'
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtnIcon.classList = 'fas fa-compress'
    }
}

const hideControls = () =>{
    videoControls.classList.remove('showing');
}

const handleMouseMove = () => {
    if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout)
        mouseLeaveTimeout = null
    } 
    if (insideMoveTimeout) {
        clearTimeout(insideMoveTimeout)
        insideMoveTimeout = null;
        //controlsMovementTimeout 은 마우스가 비디오에서 움직인다는뜻
        //계속 움직이면 clear함 
    }
    videoControls.classList.add('showing')
    insideMoveTimeout = setTimeout(hideControls, 3000)
    //we add class. At the same time, we starts setTimeout to remove the class.
}

const handleMouseLeave = () => {
    mouseLeaveTimeout = setTimeout(()=> { hideControls },3000)
}

const handleSpacebar = (e) => {
    if(e.keyCode == 32){
        handlePlayClick()
    }
}

const handleEnded = (e) => {
    const { id } = videoContainer.dataset
    fetch(`/api/videos/${id}/view`, {
        method: "POST"
    })
}



video.addEventListener('click', handlePlayClick);
playBtnIcon.addEventListener('click', handlePlayClick);
muteBtnIcon.addEventListener('click', handleMute); 
volumeRange.addEventListener('input', handleVolumeChange);
video.addEventListener('loadedmetadata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('ended', handleEnded)
timeline.addEventListener('input', handleTimelineChange);
fullScreenBtn.addEventListener('click', handleFullScreen);
videoContainer.addEventListener('mousemove', handleMouseMove)
videoContainer.addEventListener('mouseleave', handleMouseLeave)
document.addEventListener('keydown', handleSpacebar)