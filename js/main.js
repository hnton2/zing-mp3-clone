// ======================================== CHANGE BACKGROUND HEADER ===========================
const main = document.querySelector('.main')
main.addEventListener('scroll', () => {
    const header = document.querySelector('.header')
    if (main.scrollTop >= 10) header.classList.add('bg2-header')
    else header.classList.remove('bg2-header')
})

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
    newListBtns = document.querySelectorAll('.new-playlist'),
    newListCloseBtn = document.querySelector('.newList__form-close')

newListBtns.forEach(newListBtn => {
    newListBtn.addEventListener('click', () => {
        newListView.classList.add('active__modal')
    })
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

// ======================================== PLAY MUSIC ===========================
const songs = [
    {
        name: 'Hẹn Em Kiếp Sau (Orinn Remix)',
        singer: 'Lã, Duy Phúc, TIB',
        path: 'music/Hen-Em-Kiep-Sau-Orinn-Remix-La-Duy-Phuc-TIB.mp3',
        thumb: 'images/audio_default.png',
        iconStatus: '<i class="fas fa-user-friends"></i>'
    },
    {
        name: 'Yêu Từ Đâu Mà Ra (Orinn Remix)',
        singer: 'LIL ZPOET, Orinn',
        path: '/music/Yeu-Tu-Dau-Ma-Ra-Orinn-Remix-LIL-ZPOET-Orinn.mp3',
        thumb: '/images/song-1.jpg',
        iconStatus: '<span class="badge">ZMA</span>'
    },
    {
        name: 'Mỹ Nhân (Orinn Remix)',
        singer: 'Đinh Đại Vũ, Orinn',
        path: '/music/My-Nhan-Remix-Dinh-Dai-Vu-Orinn.mp3',
        thumb: '/images/song-2.jpg',
        iconStatus: '<i class="fas fa-user-friends"></i>'
    },
    {
        name: 'Chỉ Là Không Cùng Nhau (Live Version)',
        singer: 'Tăng Phúc, Trương Thảo Nhi',
        path: '/',
        thumb: '/images/song-3.jpg',
        iconStatus: ''
    },
    {
        name: 'Còn Gì Đau Hơn Chữ Đã Từng',
        singer: 'Quân A.P',
        path: '',
        thumb: '/images/song-4.jpg',
        iconStatus: ''
    },
    {
        name: 'Ai Là Người Thương Em',
        singer: 'Quân A.P',
        path: '',
        thumb: '/images/song-5.jpg',
        iconStatus: '<i class="fas fa-user-friends"></i>'
    },
    {
        name: 'Em Ổn Không',
        singer: 'Trịnh Thiên Ân, ViruSs',
        path: '',
        thumb: '/images/song-6.jpg',
        iconStatus: '<i class="fas fa-user-friends"></i>'
    },
    {
        name: 'Chẳng Thể Tìm Được Em',
        singer: 'PhucXP, Freak D',
        path: '',
        thumb: '/images/song-7.jpg',
        iconStatus: '<i class="fas fa-user-friends"></i>'
    },
    {
        name: 'Mãi Mãi Không Phải Anh',
        singer: 'Thanh Bình',
        path: '',
        thumb: '/images/song-8.jpg',
        iconStatus: '<span class="badge">ZMA</span>'
    },
    {
        name: 'Kẻ Điên Tin Vào Tình Yêu',
        singer: 'Lil Z',
        path: '',
        thumb: '/images/song-9.jpg',
        iconStatus: ''
    },
    {
        name: 'Bông Hoa Đẹp Nhất',
        singer: 'Quân A.P',
        path: '',
        thumb: '/images/song-10.jpg',
        iconStatus: '<span class="badge">ZMA</span>'
    }
]
const disc = document.querySelector('#song-disc'),
    iconAroundDisc = document.querySelector('.music__icons'),
    audio = document.querySelector('#audio'),
    playlist = document.querySelectorAll('.playlist__songs'),
    controlStatus = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false
    },
    config = JSON.parse(localStorage.getItem('music_player')) || {},
    playButton = document.querySelector('.control__icon-main'),
    playIcon = 'fa-play-circle',
    pauseIcon = 'fa-pause-circle'

const saveDataInLocalStorage = (key, value) => {
    config[key] = value;
    localStorage.setItem('music_layer', JSON.stringify(config))
}

// Render playlist
const musicList = songs.map((song, index) => {
    return `<li class="playlist__song grid ${index === controlStatus.currentIndex ? 'active' : ''}">
                <div class="playlist__info flex">
                    <a href="#" class="playlist__img-link">
                        <img src="${song.thumb}" alt="" class="playlist__item-img">
                    </a>
                    <div class="playlist__desc flex">
                        <a href="#" class="playlist__desc-title">
                            ${song.name}
                            ${song.iconStatus}
                        </a>
                        <span class="playlist__desc-subtitle">${song.singer}</span>
                    </div>
                </div>
                <span class="playlist__time">03:44</span>
                <div class="playlist__option flex">
                    <button class="playlist__option-btn">
                        <i class="fas fa-heart playlist__icon-heart"></i>
                    </button>
                    <button class="playlist__option-btn">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </li>`
})
playlist.forEach(songList => {
    songList.innerHTML = musicList.join('')
})

const audioPlayer = document.querySelector('.playControl')
const processBar = document.querySelector('#process-song')
const currentTime = document.querySelector('#current-time')
const totalTime = document.querySelector('#total-time')
const volumeProcess = document.querySelector('#process-volume')
const volumeButton = document.querySelector('#volume-button')

playButton.addEventListener('click', () => {
    if (audio.paused) {
        playButton.classList.remove(playIcon)
        playButton.classList.add(pauseIcon)

        disc.classList.add('spin-around')
        iconAroundDisc.classList.add('active')

        audio.play();
    } else {
        playButton.classList.add(playIcon)
        playButton.classList.remove(pauseIcon)

        disc.classList.remove('spin-around')
        iconAroundDisc.classList.remove('active')

        audio.pause();
    }
})
audio.addEventListener('timeupdate', () => {
    if (!audio.paused) {
        const processPercent = Math.floor((audio.currentTime / audio.duration) * 100)
        processBar.value = processPercent
        currentTime.textContent = formatTime(audio.currentTime)
    }
})
volumeProcess.addEventListener('change', () => {
    audio.volume = volumeProcess.value / 100
    if (audio.volume >= 0.5) {
        volumeButton.innerHTML = '<i class="fas fa-volume-up controlSetting__icon"></i>'
    } else if (audio.volume < 0.5 && audio.volume > 0.05) {
        volumeButton.innerHTML = '<i class="fas fa-volume-down controlSetting__icon"></i>'
    } else if (audio.volume <= 0.05) {
        volumeButton.innerHTML = '<i class="fas fa-volume-off controlSetting__icon"></i>'
    } else if (audio.volume === 0) {
        volumeButton.innerHTML = '<i class="fas fa-volume-mute controlSetting__icon"></i>'
    }
})
audio.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(audio.duration)
})
audio.addEventListener('ended', () => {
    audio.currentTime = 0
    playButton.classList.add(playIcon)
    playButton.classList.remove(pauseIcon)
})
processBar.addEventListener('change', () => {
    audio.pause()

    let current = audio.duration * (processBar.value / 100)
    audio.currentTime = current
    currentTime.textContent = formatTime(current)

    audio.play();
})

function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
}