
import {tweetsData} from '/data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import {authenticateUser} from '/database.js';

const tweetSectionEl = document.querySelector(".tweets-section");
const dialogBoxEl = document.getElementById("dialog-box");
const form = document.querySelector("form");

let userName = null;

if(document.readyState === 'interactive'){
    dialogBoxEl.style.display = "block";
}



// ######################################## EVENT LISTENER ########################################


form.addEventListener("submit", (event) =>{
    event.preventDefault();

    const dataObj = new FormData(event.target);
    authenticateUser(dataObj.get('user-name').toLowerCase().trim(), dataObj.get('password')).
    then((state)=>{
        if(!state) return;

        dialogBoxEl.style.display = "none";
        userName = dataObj.get('user-name').toLowerCase().trim();
        alert("Welcome to Siraj's Tweeter");
        renderTweets();
    });
});

document.addEventListener("click", (event) =>{

    if(!userName) return;
    else dialogBoxEl.style.display = "none";

    if(event.target.dataset.comment){
        const commentsEl = document.getElementById(event.target.dataset.comment);
        commentsEl.classList.toggle("hide-comments");
        return;
    }

    if(event.target.dataset.like){
        console.log("like tweet");
        return;
    }

    if(event.target.dataset.retweet){
        console.log("retweet");
        return;
    }

    if(event.target.dataset.del){
        console.log("delete tweet");
        return;
    }
    
    if(event.target.classList.contains("tweet-btn")){
        publishTweet();
        return;
    }

    if(event.target.dataset.replay){
        // console.log(event.target.dataset.replay)
        addReplay(event.target.dataset.replay);
        return;
    }
});

// ####################################### EVENT LISTENER END ######################################




// ################################## TWEEET RENDERING FUNCTIONS  ##################################

function renderTweets(){
    clearTweets();
    for (const tweet of tweetsData) {
        renderTweet(tweet);
    }
}


function renderTweet(tweetData){

    const comments = generateCommentsHTML(tweetData.replies, tweetData.uuid);

    const tweet = `
                    <div class="separator"></div>
                    <div class="tweet">
                        <img src="${tweetData.profilePic}" class="profile-pic">
                        <section>

                            <span class="user-name">${tweetData.handle}</span>
                            <p class="tweet-text">
                                ${tweetData.tweetText}
                            </p>

                            <section class="tweet-options">
                                <span>
                                    <i
                                     class="fa-regular fa-comment-dots"
                                     data-comment="${tweetData.uuid}"
                                    ></i>
                                    ${tweetData.replies.length}
                                </span>
                                <span>
                                    <i 
                                    class="fa-regular fa-heart"
                                    data-like="${tweetData.uuid}"
                                    ></i>
                                    ${tweetData.likes}
                                </span>
                                <span>
                                    <i
                                     class="fa-solid fa-retweet"
                                     data-retweet="${tweetData.uuid}"
                                     ></i>
                                    ${tweetData.retweets}
                                </span>
                                <span>
                                    <i
                                     class="fa-regular fa-trash-can"
                                     data-del="${tweetData.uuid}"
                                     ></i>
                                </span>
                            </section>

                        </section>
                    </div>

                    <section class="comments hide-comments" id="${tweetData.uuid}">
                        ${comments}
                    </section>
                  `
    tweetSectionEl.innerHTML += tweet;
}

function generateAddReplayHTML(id){
    const html = `
                    <div class="separator"></div>
                    <div class="tweet-input-area">
                        <img src="images/scrimbalogo.png" class="profile-pic">
                        <textarea placeholder="Tweet Your Replay" class="tweet-replay-input" id=${id}></textarea>
                    </div>
                    <button class="replay-btn" data-replay="${id}">Replay</button>
                `
    return html;
}

function generateCommentsHTML(commnets, id){
    let commentsHTML = ``;
    commentsHTML += generateAddReplayHTML(id);
    commnets.forEach(comment => {

        commentsHTML += ` 
                            <div class="separator"></div>
                            <section class="comment">
                                <img src="${comment.profilePic}" class="profile-pic">
                                <section>

                                    <span class="user-name">${comment.handle}</span>
                                    <p class="comment-text">
                                        ${comment.tweetText}
                                    </p>
                                    
                                </section>
                            </section>
                        `

    });

    return commentsHTML;
}

// ################################# TWEEET RENDERING FUNCTIONS END  ################################





function publishTweet(){
    const tweetTextArea = document.getElementById("tweet-input");
    if(!tweetTextArea.value) return;

    const tweetObj = {
        handle: '@' + userName,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetTextArea.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    }

    tweetsData.unshift(tweetObj);
    renderTweets();
    clearTweetTextArea(tweetTextArea);
}

function addReplay(uuid){
    const tweetTextArea = document.querySelector(`textarea[id='${uuid}']`);
    if(!tweetTextArea.value) return;

    const tweet = tweetsData.filter((tweet) => tweet.uuid == uuid)[0];
    const replayObj = {
        handle: '@' + userName,
        profilePic: `images/scrimbalogo.png`,
        tweetText: tweetTextArea.value
    }

    tweet.replies.unshift(replayObj);
    renderTweets();
    showComments(uuid);
    clearTweetTextArea(tweetTextArea);
}

function showComments(id){
    const commentsEl = document.getElementById(id);
    commentsEl.classList.toggle("hide-comments");
}


// renderTweets();


// ######################################## CLEAR FUNCTIONS ########################################

function clearTweets(){
    tweetSectionEl.innerHTML = '';
}

function clearTweetTextArea(textArea){
    textArea.value = '';
}

// ####################################### CLEAR FUNCTIONS END ######################################