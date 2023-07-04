import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { onValue, getDatabase, ref, get, set, push, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz-z-io0xdivckXvaPXBZQDEDIbi3fxGc",
    authDomain: "tweeter-by-siraj.firebaseapp.com",
    projectId: "tweeter-by-siraj",
    storageBucket: "tweeter-by-siraj.appspot.com",
    messagingSenderId: "1009800453691",
    appId: "1:1009800453691:web:dfad3eb32aa59dd297061e",
    databaseURL: 'https://tweeter-by-siraj-default-rtdb.asia-southeast1.firebasedatabase.app'
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const usersInDB = ref(db, "users");
const tweetsInDB = ref(db, "tweets");

function addUserToDB(userName, password){
    console.log(userName);
    set(ref(db, "users/"+ userName),
    {
        password: password,
        tweets: [],
        retweets: [],
        likes: []
    }
   );
}

export function authenticateUser(userName, password){

    return get(usersInDB).then((snapshot)=>{
        // Getting users from DB
        const users = snapshot.val();

        // if there is no user in DB then just add new user
        if(!users){
            const newPassword = generatePassword();
            addUserToDB(userName, newPassword);
            alert("Congradulations.... You have added as a users\n Your Password is: " + newPassword);
            return true;
        }

        // if password is available and userName is in the usersOBJ
        if(password && Object.hasOwn(users, userName)){
            if(users[userName].password === password)return true;
            alert("Invalid Password Entered");
            return false;
        }

        // if password is not available and userName is in the users OBJECT
        if(Object.hasOwn(users, userName)){
            alert("Please enter password");
            return false;
        }

        // if password is available or not but user is not in the users OBJECT
        const newPassword = generatePassword();
        addUserToDB(userName, newPassword);
        alert("Congradulations.... You have added as a users\n Your Password is: " + newPassword);
        return true;

    });
    
}

function generatePassword() {
    let length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function addTweetToDB(userName, tweetText)
{
    const tweetObj = {
        handle: '@' + userName,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetText,
        replies:[
        {
            handle: `@StackOverflower ☣️`,
            profilePic: `images/overflow.png`,
            tweetText: `No. Obviosuly not. Go get a job in McDonald's.`,
        }
        ],
    }

    push(tweetsInDB, tweetObj);
}

function addTweetReplay(tweetID, userName, replayText){
    const replayObj = {
        handle: '@' + userName,
        profilePic: `images/scrimbalogo.png`,
        tweetText: replayText
    }

    push(child(tweetsInDB, `${tweetID}/replies`), replayObj);
}



function likeUnlikeTweet(userName, tweetID){
    get(child(usersInDB, `${userName}/likes`)).then((data)=>{
        if(data.exits()){
            
        }
    })
}


// addTweetReplay("-NZUAKmrVTvTvU2N-Z3w", "siraj", "twet text")
// addTweetToDB("siraj", "this is a tweet") 