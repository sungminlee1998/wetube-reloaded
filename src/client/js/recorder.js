import regeneratorRuntime from "regenerator-runtime";
const startBt = document.querySelector('.startBtn');

const handleStart = async () => {
   const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); 
   console.log(stream)
}

startBt.addEventListener('click', handleStart)