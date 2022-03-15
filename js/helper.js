// ======================================== FUNCTION ===========================
function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}

const randomSong = (n) => {
    while (true) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        if (n !== randomIndex) return randomIndex;
    }
};
