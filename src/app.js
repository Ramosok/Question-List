import {Question} from "./questions"
import {createModal, isValid} from "./utils";
import {authWithEmailAndPassword, getAuthFormHTML} from "./authorization";
import './styles.css'

const form = document.getElementById('form');
const input = form.querySelector('#questions-input');
const submitBtn = form.querySelector('#submit');
const modalBtn = document.querySelector('#modal-window-btn');

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal);
input.addEventListener('input', (value) => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault();

    if (isValid) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled = true
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}


function openModal() {
    createModal('Authorization', getAuthFormHTML())
    document.getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const btnSubmit = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value
    btnSubmit.disabled = true

    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalError)
        .then(() => btnSubmit.disabled = false)
}

function renderModalError(content) {
    if (typeof content === 'string') {
        createModal('Error', content)
    } else {
        createModal('Question list', Question.ListToHTML(content))
    }
}