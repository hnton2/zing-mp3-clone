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

// ======================================== SLIDER PLAYLIST ===========================
var swiper = new Swiper('.swiper', {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});

// ======================================== ADD NEY PLAYLIST ===========================
const newListView = document.querySelector('.newList__modal'),
    newListBtn = document.querySelector('.newList-btn'),
    newListCloseBtn = document.querySelector('.newList__form-close')

newListBtn.addEventListener('click', () => {
    newListView.classList.add('active__modal')
})

newListCloseBtn.addEventListener('click', () => {
    newListView.classList.remove('active__modal')
})

// ======================================== CHOOSE MENU SECTION ===========================
const tabs = document.querySelectorAll('[data-target]'),
    tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('playlist__active')
        })
        target.classList.add('playlist__active')

        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
    })
})