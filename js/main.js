// ======================================== GLOBAL VARIABLE ===========================
const app = $(".app");
const main = $(".main");
const header = $(".header");
const songsList = $(".songs-list");
const audio = document.querySelector("#audio");
const disc = $("#song-disc");
const songTitle = $("#song-title");
const songSinger = $("#song-singer");
const playButton = $("#play-button");
const randomButton = $("#random-button");
const prevButton = $("#prev-button");
const nextButton = $("#next-button");
const repeatButton = $("#repeat-button");
const playButtonIcon = $("#play-button > i");
const progressBar = $("#progress-bar");
const currentBar = $("#current-bar");
const currentTime = $("#current-time");
const totalTime = $("#total-time");
const userBox = $("#user-box");

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;

$(document).ready(() => {
    // ======================================== CHANGE BACKGROUND HEADER ===========================
    main.scroll(() => {
        if (main.scrollTop() >= 10) header.addClass(" is-scroll");
        else header.removeClass(" is-scroll");
    });

    // ======================================== DROPDOWN MENU NAVBAR ===========================
    const dropdownBtn = $("#dropdown-btn");
    const dropdownContent = $("#nav-dropdown");
    const dropdownLink = $(".nav__link");

    dropdownBtn.click(() => {
        dropdownBtn.toggleClass("btn-active");
        dropdownContent.toggleClass("active");
    });

    dropdownLink.each((index, item) => {
        $(item).click(() => {
            if (dropdownBtn.hasClass("btn-active")) {
                dropdownBtn.removeClass("btn-active");
                dropdownContent.removeClass("active");
            }
        });
    });

    // ======================================== PLAYLIST MODAL ===========================
    const newListModal = $(".newList__modal");
    const newListModalContainer = $(".newList__modal .content");
    const newListBtns = $(".new-playlist");
    const newListCloseBtn = $(".newList__modal .btn-close");

    newListBtns.each((index, item) => $(item).click(() => newListModal.addClass("active")));
    newListCloseBtn.click(() => newListModal.removeClass("active"));
    newListModal.click(() => newListModal.removeClass("active"));
    newListModalContainer.click((e) => e.stopPropagation());

    // ======================================== CHOOSE TAB ===========================
    const tabs = $("[data-target]");
    const tabPanels = $("[data-content]");

    tabs.each((index, tab) => {
        $(tab).click(() => {
            const target = $(tab).attr("data-target");
            tabPanels.each((index, tabContent) => $(tabContent).removeClass("active"));
            $(target).addClass("active");

            tabs.each((index, tab) => $(tab).removeClass("active"));
            $(tab).addClass("active");
        });
    });

    // ======================================== THEME MODAL ===========================
    const openThemeBtn = $(".open-theme");
    const closeThemeBtn = $(".close-theme");
    const themeModal = $(".theme-modal");
    const themeModalContainer = $(".theme-modal .container");
    const playerControl = $("#player-control");

    const closeThemeModal = () => {
        themeModal.removeClass("active");
        const currentTheme = JSON.parse(localStorage.getItem("THEME"));
        handleTheme(currentTheme);
    };

    openThemeBtn.click(() => themeModal.addClass("active"));
    closeThemeBtn.click(() => closeThemeModal());
    themeModal.click(() => closeThemeModal());
    themeModalContainer.click((e) => e.stopPropagation());

    const themeContent = $(".theme-modal .themes");
    let htmlTheme = "";
    $.each(themes, (index1, theme) => {
        let xhtml = "";
        $.each(theme.content, (index2, item) => {
            xhtml += `
                    <div class="theme" data-theme=${item.slug}>
                        <div class="card">
                            <div class="card-image">
                                <img src=${item.thumb} alt="Theme 1">
                            </div>
                            <i class="bi bi-check-circle-fill theme-check"></i>
                            <div class="card-fade"></div>
                            <div class="card-action">
                                <button class="apply" onclick="handleApplyTheme(${index1}, ${index2})">Áp dụng</button>
                                <button onclick="handlePreviewTheme(${index1}, ${index2})">Xem trước</button>
                            </div>
                        </div>
                        <p class="content">${item.title}</p>
                    </div>
            `;
        });
        htmlTheme += `
            <h1 class="theme__title">${theme.name}</h1>
            <div class="theme-list">${xhtml}</div>
        `;
    });
    themeContent.append(htmlTheme);

    const setVariableStyle = (colors) => {
        $(document.documentElement).css("--primary-bg", colors.primaryBg);
        $(document.documentElement).css("--layout-bg", colors.layoutBg);
        $(document.documentElement).css("--sidebar-bg", colors.sidebarBg);
        $(document.documentElement).css("--player-bg", colors.playerBg);
        $(document.documentElement).css("--player-text", colors.playerText);
        $(document.documentElement).css("--search-text", colors.searchText);
        $(document.documentElement).css("--purple-primary", colors.purplePrimary);
        $(document.documentElement).css("--text-item-hover", colors.textItemHover);
        $(document.documentElement).css("--text-primary", colors.textPrimary);
        $(document.documentElement).css("--text-secondary", colors.textSecondary);
        $(document.documentElement).css("--link-text-hover", colors.linkTextHover);
        $(document.documentElement).css("--text-placeholder", colors.textPlaceholder);
        $(document.documentElement).css("--navigation-text", colors.navigationText);
        $(document.documentElement).css("--tab-active-bg", colors.tabActiveBg);
    };

    const handleTheme = (data) => {
        const { colors, theme, playerTheme } = data;
        if (theme) {
            app.css("background-image", `url(${theme})`);
            userBox.removeClass("blur");
        } else {
            app.css("background-image", "none");
            userBox.addClass("blur");
        }
        if (playerTheme) playerControl.css("background-image", `url(${playerTheme})`);
        else playerControl.css("background-image", "none");
        setVariableStyle(colors);
    };

    const currentTheme = JSON.parse(localStorage.getItem("THEME"));
    handleTheme(currentTheme);
    const themeList = $(".theme");
    themeList.each((index, item) => {
        $(item).removeClass("active");
        if ($(item).data("theme") == currentTheme.slug) $(item).addClass("active");
    });

    handleApplyTheme = (index1, index2) => {
        const temp = themes[index1].content[index2];
        localStorage.setItem("THEME", JSON.stringify(temp));
        handleTheme(temp);
        closeThemeModal();
        themeList.each((index, item) => {
            $(item).removeClass("active");
            if ($(item).data("theme") == temp.slug) $(item).addClass("active");
        });
    };

    handlePreviewTheme = (index1, index2) => {
        const temp = themes[index1].content[index2];
        handleTheme(temp);
    };

    // ======================================== RENDER LIST SONG AND SLIDERS IMAGES ===========================
    const songsAnimation = $(".songs-animation");
    let htmlSong = "";
    $.each(songs, (index, song) => {
        songsAnimation.append(`<li class="song-animation"><img src="${song.thumb}" alt="${song.name}"></li>`);
        htmlSong += `<li class="song ${index === currentIndex ? "active" : ""}">
                        <div class="desc">
                            <div class="thumb">
                                <img src="${song.thumb}" alt="${song.name}">
                                <div class="thumb-fade"></div>
                                <i class="bi bi-play-fill thumb-icon"></i>
                            </div>
                            <div style="width: 100%">
                                <p class="song-title">${song.name}</p>
                                <p class="song-subtitle">${song.singer}</p>
                            </div>
                        </div>
                        <span class="time md-hide sm-hide">${song.duration}</span>
                        <div class="options">
                            <button class="btn btn-heart"><i class="bi bi-heart-fill"></i></button>
                            <button class="btn"><i class="bi bi-three-dots"></i></button>
                        </div>
                    </li>`;
    });
    songsList.each((index, list) => {
        $(list).append(htmlSong);
    });
    // ====== Add animation =======
    const thumbAnimations = $("li.song-animation");
    let counter = 0;
    if (thumbAnimations)
        setInterval(() => {
            thumbAnimations.eq(counter - 1).removeClass();
            thumbAnimations.eq(counter - 1).addClass("song-animation third");
            thumbAnimations.eq(counter).removeClass();
            thumbAnimations.eq(counter).addClass("song-animation first");
            thumbAnimations.eq(counter + 1).removeClass();
            thumbAnimations.eq(counter + 1).addClass("song-animation second");
            counter++;
            if (counter === thumbAnimations.length) counter = 0;
        }, 2000);

    // ====================================== PLAYER CONTROL ===========================
    const songList = $(".song");

    const handlePlaySong = () => {
        audio.play();
        isPlaying = true;
        playButtonIcon.removeClass("bi-play-fill");
        playButtonIcon.addClass("bi-pause-fill");
    };

    const handlePauseSong = () => {
        audio.pause();
        isPlaying = false;
        playButtonIcon.addClass("bi-play-fill");
        playButtonIcon.removeClass("bi-pause-fill");
    };

    const handleChangeTimebar = (val) => {
        progressBar.val(val);
        currentBar.css("width", `${val}%`);
    };

    const setCurrentSong = (n) => {
        if (n >= songs.length) n -= songs.length;
        let current = songs[n];
        audio.src = current.path;
        audio.load();
        audio.currentTime = 0;
        disc.css("background-image", `url(${current.thumb})`);
        songTitle.html(current.name);
        songSinger.html(current.singer);

        songList.each((index, item) => $(item).removeClass("active"));
        songList.eq(n).addClass("active");
    };

    // SETUP AUDIO
    audio.addEventListener("timeupdate", () => {
        if (!audio.paused) {
            const processPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            handleChangeTimebar(processPercent);
            currentTime.html(formatTime(audio.currentTime));
        }
    });
    audio.addEventListener("loadedmetadata", () => {
        totalTime.html(formatTime(audio.duration));
    });
    audio.addEventListener("ended", () => {
        audio.pause();
        handleChangeTimebar(0);
        currentTime.html("0:00");

        if (isRandom && !isRepeat) currentIndex = randomSong(currentIndex);
        else if (!isRepeat) {
            currentIndex += 1;
            if (currentIndex >= songs.length) currentIndex = 0;
        }
        setCurrentSong(currentIndex);

        if (isPlaying) audio.play();
    });

    setCurrentSong(currentIndex);
    // CLICK PLAY BUTTON
    playButton.click(() => {
        if (audio.paused) handlePlaySong();
        else handlePauseSong();
    });

    // CHANGE PROGRESSBAR
    progressBar.change(() => {
        audio.pause();
        let current = audio.duration * (progressBar.val() / 100);
        handleChangeTimebar(0);
        audio.currentTime = current;
        currentTime.html(formatTime(current));
        audio.play();
    });

    // SELECT SONG
    songList.each((index, song) => {
        $(song).click(() => {
            audio.pause();
            handleChangeTimebar(0);
            currentTime.html("0:00");

            setCurrentSong(Number(index));
            $(song).addClass("active");

            handlePlaySong();
        });
    });

    // NEXT SONG
    nextButton.click(() => {
        audio.pause();
        handleChangeTimebar(0);
        currentTime.html("0:00");

        if (isRandom) currentIndex = randomSong(currentIndex);
        else {
            currentIndex += 1;
            if (currentIndex >= songs.length) currentIndex = 0;
        }
        setCurrentSong(currentIndex);

        if (isPlaying) audio.play();
    });

    //  PREV SONG
    prevButton.click(() => {
        audio.pause();
        handleChangeTimebar(0);
        currentTime.html("0:00");

        if (isRandom) {
            currentIndex = randomSong(currentIndex);
        } else {
            currentIndex -= 1;
            if (currentIndex < 0) currentIndex = songs.length - 1;
        }
        setCurrentSong(currentIndex);

        if (isPlaying) audio.play();
    });

    // RANDOM SONG
    randomButton.click(() => {
        randomButton.toggleClass("active");
        isRandom = !isRandom;
    });

    // REPEAT SONG
    repeatButton.click(() => {
        repeatButton.toggleClass("active");
        isRepeat = !isRepeat;
    });

    // VOLUME
    const volumeProgress = $("#progress-volume");
    const currentVolume = $("#current-volume");
    const volumeButton = $("#volume-button");

    volumeProgress.change(() => {
        currentVolume.css("width", `${volumeProgress.val()}%`);
        audio.volume = volumeProgress.val() / 100;
        if (audio.volume >= 0.5) {
            volumeButton.html('<i class="bi bi-volume-up"></i>');
        } else if (audio.volume < 0.5 && audio.volume > 0.05) {
            volumeButton.html('<i class="bi bi-volume-down"></i>');
        } else if (audio.volume <= 0.05) {
            volumeButton.html('<i class="bi bi-volume-off"></i>');
        } else if (audio.volume === 0) {
            volumeButton.html('<i class="bi bi-volume-mute"></i>');
        }
    });
    volumeButton.click(() => {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeProgress.val("0");
            currentVolume.css("width", "0%");
            volumeButton.html('<i class="bi bi-volume-mute"></i>');
        } else {
            audio.volume = 1;
            volumeProgress.val("100");
            currentVolume.css("width", "100%");
            volumeButton.html('<i class="bi bi-volume-up"></i>');
        }
    });
});
