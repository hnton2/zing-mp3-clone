// ======================================== DROPDOWN MENU NAVBAR ===========================
const dropdownBtn = document.getElementById('dropdown-btn')
const dropdownContent = document.querySelector('#nav-dropdown')
const dropdownLink = document.querySelectorAll('.nav__link')

dropdownBtn.addEventListener('click', () => {
    dropdownBtn.classList.toggle('btn__active')
    dropdownContent.classList.toggle('show-nav__dropdown')
})

dropdownLink.forEach((content) => {
    content.addEventListener('click', () => {
        dropdownBtn.classList.remove('btn__active')
        dropdownContent.classList.remove('show-nav__dropdown')
    })
})