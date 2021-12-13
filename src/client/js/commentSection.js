import { async } from "regenerator-runtime";

const form = document.querySelector('.videoCommentForm');
const videoContainer = document.querySelector('.videoContainer');
const textarea = document.querySelector('textarea')
const commentDelBtns= document.querySelectorAll('.commentDeleteBtn')

const addComment = (text,id) => {
    const videoComments = document.querySelector('.videoComments ul')
    const newComment = document.createElement('li');
    newComment.dataset.id = id
    const icon = document.createElement('i')
    icon.className = "fas fa-comment"
    const span = document.createElement('span')
    const span2 = document.createElement('span')
    span2.className = 'commentDeleteBtn'
    span2.innerText = "❌"
    span.innerText = `${text}`
    newComment.appendChild(icon)
    newComment.appendChild(span) 
    newComment.appendChild(span2) 
    newComment.className = "videoComment"
    videoComments.prepend(newComment);
    videoComments.addEventListener('click', handleCommentDelete)
}


const handleCommentForm  = async(event) => {
    event.preventDefault()
    const videoId = videoContainer.dataset.id
    const text = textarea.value
    if(text == ""){
        return 
    }
    const response = await fetch(`/api/videos/${videoId}/comment/create`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({text}),
    })
    if (response.status == 201){
        textarea.value = ''
        const { newCommentId } = await response.json()
        addComment(text, newCommentId)
    }
}

const handleCommentDelete = async(event) => {
    const chosenComment = event.target.parentElement
    chosenComment.remove()
    const { id } = chosenComment.dataset
    
    await fetch(`/api/comment/${id}/delete`,{
            method: 'DELETE'
        })
    
    }


for ( const commentDelBtn of commentDelBtns) {
        commentDelBtn.addEventListener('click', handleCommentDelete)
    }


form.addEventListener('submit', handleCommentForm)