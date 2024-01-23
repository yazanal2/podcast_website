var vlmprg= document.querySelector('#myvloume');
var timeline= document.querySelector('#myRange');
var play= document.querySelector('.tl-nfs-play');

let playflag = false;


let flagspeed = 0;


var timer1= document.querySelector('.time-podcast1');
var timer2= document.querySelector('.time-podcast2');


var vlm_icon= document.querySelector('.vlm-icon');

let flagvlmprg = 1;


const podcast= document.querySelector('.audio-nfs');
let nfs_buffer = document.querySelector('.nfs-buffer'); 





play.addEventListener("click", function() {
    if (playflag == false)
    {
        podcast.play();
        play.innerHTML = '<i class="fal fa-pause"></i>';
        playflag = true;
    }



    else{
        podcast.pause();
        play.innerHTML = '<i class="fal fa-play"></i>';
        playflag = false;
    }
    
});



vlmprg.addEventListener("input", function() {
    x2 = vlmprg.value; 
    color = 'background : linear-gradient(to right,#fff '+x2+'%,rgba(255,255,255,.5) '+x2+'%)!important;';
    vlmprg.style = color;


    
    if (x2 >= 51)
    {
        vlm_icon.innerHTML = '<i class="fal fa-volume-up"></i>';
    }
    if (x2 <= 50)
    {
        vlm_icon.innerHTML = '<i class="fal fa-volume-down"></i>';
    }
    if (x2 <= 30)
    {
        vlm_icon.innerHTML = '<i class="fal fa-volume-off"></i>';
    }
    if (x2 == 0)
    {
        vlm_icon.innerHTML = '<i class="fal fa-volume-mute"></i>';
    }

    podcast.volume = this.value/100;
});




vlm_icon.addEventListener("click",function(){


    if(flagvlmprg<3){

        flagvlmprg++;
    }


    else{

        flagvlmprg=1;
    }



    console.log(flagvlmprg);


    switch(flagvlmprg){

        case 1: vlm_icon.innerHTML = '<i class="fal fa-volume-up"></i>';
        vlmprg.value = '100';
        podcast.volume = 100 / 100;
        color = 'background : linear-gradient(to right,#fff 100%,rgba(255,255,255,.5) 0)!important;';
        vlmprg.style = color;
        break;



        case 2 :
            vlm_icon.innerHTML = '<i class="fal fa-volume-mute"></i>';
            vlmprg.value = '0';
            podcast.volume = 0 / 100;
            color = 'background : linear-gradient(to right,#fff 0,rgba(255,255,255,.5) 0)!important;';
            vlmprg.style = color;
        break;


        case 3 :
            vlm_icon.innerHTML = '<i class="fal fa-volume-down"></i>';
            vlmprg.value = '50';
            podcast.volume = 50 / 100;
            color = 'background : linear-gradient(to right,#fff 50%,rgba(255,255,255,.5) 50%)!important;';
            vlmprg.style = color;
        break;


        default: 
        vlm_icon.innerHTML = '<i class="fal fa-volume-up"></i>';
        vlmprg.value = '100';
        podcast.volume = 100 / 100;
        color = 'background : linear-gradient(to right,#fff 100%,rgba(255,255,255,.5) 0)!important;';
        vlmprg.style = color;
    }

});









// timer


function getTime(time){

    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - ( minutes * 60 ))
    let minuteValue;
    let secondsValue;

    if(minutes < 10) {
        minuteValue = '0' + minutes;
    } else {
        minuteValue = minutes;
    }


    if(seconds < 10) {
        secondsValue = '0' + seconds;
    } else {
        secondsValue = seconds;
    }

    return minuteValue + ':' + secondsValue
}



podcast.addEventListener("timeupdate", function(){

    timer1.textContent = getTime(podcast.currentTime);

    timer2.textContent = getTime(podcast.duration);




    // +'/'+getTime(podcast.duration)
    let barLength = (podcast.currentTime / podcast.duration) * 100;
    timeline.value = barLength;
    color = 'background : linear-gradient(to right,#fff '+timeline.value+'%,rgba(255,255,255,.5) '+timeline.value+'%)!important;';
    timeline.style = color;



    var duration =  podcast.duration;
    if (duration > 0) {
      for (var i = 0; i < podcast.buffered.length; i++) {
            if (podcast.buffered.start(podcast.buffered.length - 1 - i) < podcast.currentTime) {
                podcastBufWidth = (podcast.buffered.end(podcast.buffered.length - 1 - i) / duration) * 100 + "%";
                nfs_buffer.innerHTML = '<style>.slider::after { width: '+podcastBufWidth+';}</style>';
                break;
            }
        }
    }
});



  timeline.addEventListener("input", function() {
    podcast.currentTime = (this.value / 100) * podcast.duration
    x1 = timeline.value;
    color = 'background : linear-gradient(to right,#fff '+x1+'%,rgba(255,255,255,.5) '+x1+'%)!important;';
    timeline.style = color;
});





//Podcast amount 
podcast.addEventListener('progress', function() {
    
});