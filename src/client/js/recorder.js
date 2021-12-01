const startBt = document.querySelector('.startBtn');
const video = document.querySelector('.preview')

const handleStart = async () => {
   const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true, width: 200, height: 200 }); 
   video.srcObject = stream
   console.log(video);
   video.play()
}

startBt.addEventListener('click', handleStart)