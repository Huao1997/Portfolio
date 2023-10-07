const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

//load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);


window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once window loaded
    playingNow();
    loadlike();
})

//load music
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `../public/albums/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `../public/music/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music
function playMusic(){
    wrapper.classList.add("pause");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music
function pauseMusic(){
    wrapper.classList.remove("pause");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
    loadlike();
}

//prev music
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
    loadlike();
}


//play or pausr button
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("pause");
    // if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused  ? pauseMusic() : playMusic();
    playingNow();
});


//next music btn
nextBtn.addEventListener("click", ()=>{
    nextMusic(); 
});

//prev music btn
prevBtn.addEventListener("click", ()=>{
    prevMusic(); 
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //getting currentTime of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`; 
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`; //add 0 if less than 10
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


//Update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickoffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration
    
    mainAudio.currentTime = (clickoffSetX / progressWidthval) * songDuration;
    playMusic();

});

//work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    //first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
    //let's do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one": //if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": //if icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");        
            break;
    }
});

//above changed the icon
//after the song ended what to do
mainAudio.addEventListener("ended", ()=>{

    let getText = repeatBtn.innerText; //getting innerText of icon
    //Do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat then  the next song will play
            nextMusic();
            loadlike();
            break;
        case "repeat_one": //if icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beggining
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic(); //calling playMusic function   
            loadlike();         
            break;
        case "shuffle": //if icon is shuffle then change it to repeat
            //generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex); //this loop run untill the next random number won't be the same of current music index
            musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); //calling loadMusic function 
            playMusic(); //calling playMusic function            
            playingNow();
            loadlike();
            break;
    }
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    //pass the song name, artist from the array to li
    let liTag = `<li li-index="${i + 1}">
                    <i class="${allMusic[i].i} " id="favorite"></i>
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>                  
                </li>`
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //add 0 if sec is less than 10
            totalSec = `0${totalSec}`; 
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //adding t duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //Remove playing class from all other li expect the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //Get that audio duration value and pass to .audio-duration innertext
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //passing t-Duration value to audio duration innerText
        }
        //if there is an li tag which li-index is equal to musicInDEX
        //then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }    
}

//Play song on li click
function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that liindex to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
    loadlike();
}

//background color change
const mod1 = document.querySelector("#mode1");
        
mod1.addEventListener("click", () => {
    document.querySelector('.phone').classList.toggle('dark');
    document.querySelector('.bx-moon').classList.toggle('bx-sun');
})


const mod2 = document.querySelector("#mode2");
        
mod2.addEventListener("click", () => {
    document.querySelector('.phone').classList.toggle('active');
    document.querySelector('.bx-minus').classList.toggle('bx-plus');
})


//add to favorite
const LT = wrapper.querySelector(".LT");
//heart amount
for (let L = 0; L < allMusic.length; L++) {
    let LikeTags = `<span LT-index="${L + 1}" class=''>
                    <i class="${allMusic[L].i}" id="BF"></i>
                    </span>`
    LT.insertAdjacentHTML("beforeend", LikeTags);
}


const musicLike = LT.querySelector("#BF");
const allLTags = LT.querySelectorAll("span");
//click like
for (let LT = 0; LT < allLTags.length; LT++) {
    allLTags[LT].addEventListener("click", (e) => {
        e.target.classList.toggle("active");
        addToFavorite();})
}

//like icon
function loadlike(){
    for (let LL = 0; LL < allLTags.length; LL++) {
    if(allLTags[LL].classList.contains("display")){
        allLTags[LL].classList.remove("display");}

    if(allLTags[LL].getAttribute("LT-index") == musicIndex){
        allLTags[LL].classList.add("display");
    }
    }}

//favorite display
function addToFavorite(){
    for (let f = 0; f < allLiTags.length; f++) {
        let musicFavorite = allLiTags[f].querySelector("#favorite");
        if(allLiTags[f].getAttribute("li-index") == musicIndex){
            musicFavorite.classList.toggle("active");
        }
        }}


