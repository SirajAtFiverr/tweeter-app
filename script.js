import {authenticateUser, tweetsInDB, addRemoveFromDB, deleteTweetFromDB, addTweetToDB, addTweetReplay} from '/database.js';
import { onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


const tweetSectionEl = document.querySelector(".tweets-section");
const dialogBoxEl = document.getElementById("dialog-box");
const form = document.querySelector("form");

let userName = null;


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

        onValue(tweetsInDB, (snapshot)=>{
            if(!snapshot.exists()) return;
            renderTweets(snapshot.val());
        });
    });
});

document.addEventListener("click", (event) =>{

    if(!userName) return;

    if(event.target.dataset.comment){
        const commentsEl = document.getElementById(event.target.dataset.comment);
        commentsEl.classList.toggle("hide-comments");
        return;
    }

    if(event.target.dataset.like){
        addRemoveFromDB(userName, event.target.dataset.like, "likes");
        return;
    }

    if(event.target.dataset.retweet){
        addRemoveFromDB(userName, event.target.dataset.retweet, "retweets");
        return;
    }

    if(event.target.dataset.del){
        deleteTweetFromDB(userName, event.target.dataset.del);
        return;
    }
    
    if(event.target.classList.contains("tweet-btn")){
        publishTweet(userName);
        return;
    }

    if(event.target.dataset.replay){
        addReplay(userName, event.target.dataset.replay);
        return;
    }
});

// ####################################### EVENT LISTENER END ######################################




// ################################## TWEEET RENDERING FUNCTIONS  ##################################


function renderTweets(tweets){
    clearTweets();
    for (let tweet of Object.entries(tweets)) {
        renderTweet(tweet[0], tweet[1]);
    }
}

function renderTweet(tweetID, tweetData){

    let tweetReplies = [];
    try{
        tweetReplies = Object.values(tweetData.replies)
    }catch{}

    const comments = generateCommentsHTML(tweetReplies, tweetID);
    let likedUtitliyClass = null;
    let heartShape = 'fa-regular';
    let retweetedUtitliyClass = null;

    if(JSON.parse(tweetData.likes).indexOf(userName) != -1) likedUtitliyClass = 'color-red', heartShape = 'fa-solid';
    if(JSON.parse(tweetData.retweets).indexOf(userName) != -1) retweetedUtitliyClass = "color-blue";

    const tweet = `
                    <div class="separator"></div>
                    <div class="tweet">
                        <img src="${tweetData.profilePic}" class="profile-pic">
                        <section>

                            <span class="user-name">@${tweetData.handle}</span>
                            <p class="tweet-text">
                                ${tweetData.tweetText}
                            </p>

                            <section class="tweet-options">
                                <span>
                                    <i
                                     class="fa-regular fa-comment-dots "
                                     data-comment="${tweetID}"
                                    ></i>
                                    ${tweetReplies.length}
                                </span>
                                <span>
                                    <i 
                                    class="${heartShape} fa-heart ${likedUtitliyClass}"
                                    data-like="${tweetID}"
                                    ></i>
                                    ${JSON.parse(tweetData.likes).length}
                                </span>
                                <span>
                                    <i
                                     class="fa-solid fa-retweet ${retweetedUtitliyClass}"
                                     data-retweet="${tweetID}"
                                     ></i>
                                    ${JSON.parse(tweetData.retweets).length}
                                </span>
                                <span>
                                    <i
                                     class="fa-regular fa-trash-can"
                                     data-del="${tweetID}"
                                     ></i>
                                </span>
                            </section>

                        </section>
                    </div>

                    <section class="comments hide-comments" id="${tweetID}">
                        ${comments}
                    </section>
                  `
    tweetSectionEl.innerHTML += tweet;
}

function generateAddReplayHTML(id){
    let profilePic = "images/scrimbalogo.png";
    if(userName === 'siraj') profilePic = 'https://media.giphy.com/media/3oKIPcYayla0bcQr3q/giphy.gif'
    const html = `
                    <div class="separator"></div>
                    <div class="tweet-input-area">
                        <img src=${profilePic} class="profile-pic">
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

                                    <span class="user-name">@${comment.handle}</span>
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




// ######################################## TWEET AND REPLAY ########################################


function publishTweet(userName){
    const tweetTextArea = document.getElementById("tweet-input");
    if(!tweetTextArea.value) return;

    addTweetToDB(userName, tweetTextArea.value);
    clearTweetTextArea(tweetTextArea);
}

function addReplay(userName, tweetID){
    const tweetTextArea = document.querySelector(`textarea[id='${tweetID}']`);
    if(!tweetTextArea.value) return;

    addTweetReplay(tweetID, userName, tweetTextArea.value);
    showComments(tweetID);
    clearTweetTextArea(tweetTextArea);
}

function showComments(id){
    const commentsEl = document.getElementById(id);
    commentsEl.classList.toggle("hide-comments");
}

// ##################################### TWEET AND REPLAY END ######################################





// ######################################## CLEAR FUNCTIONS ########################################

function clearTweets(){
    tweetSectionEl.innerHTML = '';
}

function clearTweetTextArea(textArea){
    textArea.value = '';
}

// ####################################### CLEAR FUNCTIONS END ######################################