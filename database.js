import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {getDatabase, ref, get, set, push, child, update, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


// #################################### DATABASE CONFIGURATION ####################################

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
export const tweetsInDB = ref(db, "tweets");

// ################################### DATABASE CONFIGURATION END ##################################






// ########################################## USER SECTION #########################################



function addUserToDB(userName, password){
    console.log(userName);
    set(ref(db, "users/"+ userName),
    password
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
            // Matching password
            if(users[userName] === password) return true;
            // if password doesn't match
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


// ######################################## USER SECTION END ########################################





// ########################################## TWEET SECTION #########################################

export function addTweetToDB(userName, tweetText)
{
    const profilePic = "images/scrimbalogo.png";
    if(userName === 'siraj') profilePic = "https://media.giphy.com/media/3oKIPcYayla0bcQr3q/giphy.gif";

    const tweetObj = {
        handle: userName,
        profilePic: profilePic,
        likes: JSON.stringify([]),
        retweets: JSON.stringify([]),
        tweetText: tweetText,
        replies: []
    }

    push(tweetsInDB, tweetObj);
}

export function addTweetReplay(tweetID, userName, replayText){

    const profilePic = "images/scrimbalogo.png";
    if(userName === 'siraj') profilePic = "https://media.giphy.com/media/3oKIPcYayla0bcQr3q/giphy.gif";

    const replayObj = {
        handle: userName,
        profilePic: profilePic,
        tweetText: replayText
    }

    push(child(tweetsInDB, `${tweetID}/replies`), replayObj);
}

export function deleteTweetFromDB(userName, tweetID){

    get(child(tweetsInDB, `${tweetID}/handle`)).then((data)=>{

        if(data.val() === userName){
            if(confirm("Are you really want to delete this tweet ???")) remove(ref(db, "tweets/"+tweetID));
            return;
        }

        alert("How can you delete this tweet ?? \nIt's not your.")
    });
}


export function addRemoveFromDB(userName, tweetID, likesOrRetweeets){
    get(child(tweetsInDB, `${tweetID}/${likesOrRetweeets}`)).then((data)=>{

        let users = JSON.parse(data.val());
        if(users.indexOf(userName) != -1){
            users = users.filter(user => user !== userName);
        }else{
            users.push(userName);
        }
        update(child(tweetsInDB, `${tweetID}`), {
            [likesOrRetweeets]: JSON.stringify(users)
        });
    });
}

// ######################################### TWEET SECTION END #######################################
