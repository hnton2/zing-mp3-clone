// ======================================== GLOBAL VARIABLE ===========================

const main = $(".main");
const header = $(".header");
const dropdownBtn = $("#dropdown-btn");
const dropdownContent = $("#nav-dropdown");
const dropdownLink = $(".nav__link");
const newListModal = $(".newList__modal");
const newListModalContainer = $(".newList__modal-content");
const newListBtns = $(".new-playlist");
const newListCloseBtn = $(".newList__form-close");
const playlist = $(".playlist__songs");
const audio = document.querySelector("#audio");
const disc = $("#song-disc");
const songTitle = $("#song-title");
const songSinger = $("#song-singer");
const playButton = $("#play-button");
const randomButton = $("#random-button");
const prevButton = $("#prev-button");
const nextButton = $("#next-button");
const repeatButton = $("#repeat-button");
const iconPlayButton = $(".control__icon-main");
const iconAroundDisc = $(".music__icons");
const processBar = $("#process-song");
const currentTime = $("#current-time");
const totalTime = $("#total-time");
const volumeProcess = $("#process-volume");
const volumeButton = $("#volume-button");
const sliderContent = $(".swiper-wrapper");
const openThemeBtn = $(".open-theme");
const closeThemeBtn = $(".close-theme");
const themeModal = $(".theme-modal");
const themeModalContainer = $(".theme-modal .container");

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;

// ======================================== FUNCTION HELPER ===========================
function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}

$(document).ready(() => {
    // ======================================== CHANGE BACKGROUND HEADER ===========================
    main.scroll(() => {
        if (main.scrollTop() >= 10) header.addClass("bg2-header");
        else header.removeClass("bg2-header");
    });

    // ======================================== DROPDOWN MENU NAVBAR ===========================
    dropdownBtn.click(() => {
        dropdownBtn.toggleClass("btn__active");
        dropdownContent.toggleClass("show-nav__dropdown");
    });

    dropdownLink.each((index, item) => {
        $(item).click(() => {
            if (dropdownBtn.hasClass("btn__active")) {
                dropdownBtn.removeClass("btn__active");
                dropdownContent.removeClass("show-nav__dropdown");
            }
        });
    });

    // ======================================== ADD NEW PLAYLIST ===========================
    newListBtns.each((index, item) => $(item).click(() => newListModal.addClass("active")));
    newListCloseBtn.click(() => newListModal.removeClass("active"));
    newListModal.click(() => newListModal.removeClass("active"));
    newListModalContainer.click((e) => e.stopPropagation());

    // ======================================== THEME MODAL ===========================
    openThemeBtn.click(() => themeModal.addClass("active"));
    closeThemeBtn.click(() => themeModal.removeClass("active"));
    themeModal.click(() => themeModal.removeClass("active"));
    themeModalContainer.click((e) => e.stopPropagation());

    // ======================================== CHOOSE MENU SECTION ===========================
    const tabs = $("[data-target]"),
        tabContents = $("[data-content]");

    tabs.each((index, tab) => {
        $(tab).click(() => {
            const target = $(tab).attr("data-target");
            tabContents.each((index, tabContent) => {
                $(tabContent).removeClass("playlist__active");
            });
            $(target).addClass("playlist__active");

            tabs.each((index, tab) => {
                $(tab).removeClass("active");
            });
            $(tab).addClass("active");
        });
    });

    // ======================================== RENDER LIST SONG AND SLIDERS IMAGES===========================
    let htmlSong = "";
    $.each(songs, (index, song) => {
        sliderContent.append(`<img src="${song.thumb}" alt="${song.name}" class="playlist__thumb swiper-slide">`);

        htmlSong += `<li class="playlist__song grid ${index === currentIndex ? "active" : ""}">
                        <div class="playlist__info flex">
                            <a href="#" class="playlist__img-link">
                            <img src="${song.thumb}" alt="${song.name}" class="playlist__item-img">
                            </a>
                            <div class="playlist__desc flex">
                                <a href="#" class="playlist__desc-title">
                                ${song.name}
                                ${song.iconStatus}
                                </a>
                                <span class="playlist__desc-subtitle">${song.singer}</span>
                            </div>
                        </div>
                        <span class="playlist__time">${song.duration}</span>
                        <div class="playlist__option flex">
                            <button class="playlist__option-btn">
                                <i class="fas fa-heart playlist__icon-heart"></i>
                            </button>
                            <button class="playlist__option-btn">
                                <i class="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                    </li>`;
    });
    playlist.each((index, list) => {
        $(list).append(htmlSong);
    });

    // ======================================== SLIDER PLAYLIST ===========================
    let swiper = new Swiper(".swiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
    });

    // ======================================== CURRENT SONG ===========================
    const currentSong = (n) => {
        if (n >= songs.length) {
            n -= songs.length;
        }
        let current = songs[n];
        audio.src = current.path;
        audio.load();
        audio.currentTime = 0;
        disc.css("background-image", `url(${current.thumb})`);
        songTitle.html(current.name);
        songSinger.html(current.singer);
    };
    currentSong(currentIndex);

    // ======================================== PLAY BUTTON ===========================
    playButton.click(() => {
        if (audio.paused) {
            showIconPause();

            audio.play();
            isPlaying = true;
        } else {
            showIconPlay();

            audio.pause();
            isPlaying = false;
        }
    });

    // ======================================== CONFIG AUDIO ===========================
    audio.addEventListener("timeupdate", () => {
        if (!audio.paused) {
            const processPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            processBar.val(processPercent);
            currentTime.html(formatTime(audio.currentTime));
        }
    });
    audio.addEventListener("loadedmetadata", () => {
        totalTime.html(formatTime(audio.duration));
    });
    audio.addEventListener("ended", () => {
        audio.pause();
        showIconPlay();
        processBar.val("0");
        currentTime.html("0:00");

        if (isRandom && !isRepeat) {
            currentIndex = randomSong(currentIndex);
        } else if (!isRepeat) {
            currentIndex += 1;
            if (currentIndex >= songs.length) currentIndex = 0;
        }
        currentSong(currentIndex);
        changeActiveSong(currentIndex);

        if (isPlaying) {
            audio.play();
            showIconPause();
        }
    });

    // ======================================== CHANGE VOLUME ===========================
    volumeProcess.change(() => {
        audio.volume = volumeProcess.val() / 100;
        if (audio.volume >= 0.5) {
            volumeButton.html('<i class="fas fa-volume-up controlSetting__icon"></i>');
        } else if (audio.volume < 0.5 && audio.volume > 0.05) {
            volumeButton.html('<i class="fas fa-volume-down controlSetting__icon"></i>');
        } else if (audio.volume <= 0.05) {
            volumeButton.html('<i class="fas fa-volume-off controlSetting__icon"></i>');
        } else if (audio.volume === 0) {
            volumeButton.html('<i class="fas fa-volume-mute controlSetting__icon"></i>');
        }
    });
    // ======================================== CLICK BUTTON VOLUME ===========================
    volumeButton.click(() => {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeProcess.val("0");
            volumeButton.html('<i class="fas fa-volume-mute controlSetting__icon"></i>');
        } else {
            audio.volume = 1;
            volumeProcess.val("100");
            volumeButton.html('<i class="fas fa-volume-up controlSetting__icon"></i>');
        }
    });

    // ======================================== CHANGE TIME ===========================
    processBar.change(() => {
        audio.pause();

        let current = audio.duration * (processBar.val() / 100);
        audio.currentTime = current;
        currentTime.html(formatTime(current));

        audio.play();
    });

    // ======================================== CHOOSE SONG ===========================
    const songGroup = $(".playlist__song");
    songGroup.each((index, song) => {
        $(song).click(() => {
            audio.pause();
            showIconPlay();
            processBar.val("0");
            currentTime.html("0:00");

            currentIndex = Number(index);
            currentSong(currentIndex);
            changeActiveSong(currentIndex);

            if (isPlaying) {
                audio.play();
                showIconPause();
            }
        });
    });

    // ======================================== NEXT SONG ===========================
    nextButton.click(() => {
        audio.pause();
        showIconPlay();
        processBar.val("0");
        currentTime.html("0:00");

        if (isRandom) {
            currentIndex = randomSong(currentIndex);
        } else {
            currentIndex += 1;
            if (currentIndex >= songs.length) currentIndex = 0;
        }
        currentSong(currentIndex);
        changeActiveSong(currentIndex);

        if (isPlaying) {
            audio.play();
            showIconPause();
        }
    });

    // ======================================== PREV SONG ===========================
    prevButton.click(() => {
        audio.pause();
        showIconPlay();
        processBar.val("0");
        currentTime.html("0:00");

        if (isRandom) {
            currentIndex = randomSong(currentIndex);
        } else {
            currentIndex -= 1;
            if (currentIndex < 0) currentIndex = songs.length - 1;
        }
        currentSong(currentIndex);
        changeActiveSong(currentIndex);

        if (isPlaying) {
            audio.play();
            showIconPause();
        }
    });

    // ======================================== RANDOM SONG ===========================
    randomButton.click(() => {
        randomButton.toggleClass("active");
        isRandom = !isRandom;
    });

    // ======================================== REPEAT SONG ===========================
    repeatButton.click(() => {
        repeatButton.toggleClass("active");
        isRepeat = !isRepeat;
    });

    // ======================================== FUNCTION ===========================
    const changeActiveSong = (n) => {
        songGroup.each((index, song) => {
            if ($(song).hasClass("active")) {
                $(song).removeClass("active");
            }
            if (n === index) {
                $(song).addClass("active");
            }
        });
    };

    const showIconPlay = () => {
        iconPlayButton.addClass("fa-play-circle");
        iconPlayButton.removeClass("fa-pause-circle");

        disc.removeClass("spin-around");
        iconAroundDisc.removeClass("active");
        songTitle.removeClass("text-animation");
    };

    const showIconPause = () => {
        iconPlayButton.removeClass("fa-play-circle");
        iconPlayButton.addClass("fa-pause-circle");

        disc.addClass("spin-around");
        iconAroundDisc.addClass("active");
        songTitle.addClass("text-animation");
    };

    const randomSong = (n) => {
        while (true) {
            let randomIndex = Math.floor(Math.random() * songs.length);
            if (n !== randomIndex) {
                return randomIndex;
            }
        }
    };
});
