// Importing tweetsData array and uuidv4 function from external modules
import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Adding a click event listener to the document
document.addEventListener('click', function(e){
    // Handling click events based on the target's dataset properties
    if(e.target.dataset.like){
        // If the target has a 'like' dataset property, call handleLikeClick with the tweet's ID
        handleLikeClick(e.target.dataset.like);
    }
    else if(e.target.dataset.retweet){
        // If the target has a 'retweet' dataset property, call handleRetweetClick with the tweet's ID
        handleRetweetClick(e.target.dataset.retweet);
    }
    else if(e.target.dataset.reply){
        // If the target has a 'reply' dataset property, call handleReplyClick with the reply's ID
        handleReplyClick(e.target.dataset.reply);
    }
    else if(e.target.id === 'tweet-btn'){
        // If the target has an id of 'tweet-btn', call handleTweetBtnClick to handle tweet submission
        handleTweetBtnClick();
    }
});

// Function to handle like button click event for a specific tweet
function handleLikeClick(tweetId){
    // Finding the tweet object with the given ID from tweetsData array
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];

    // Toggling the like status and updating likes count accordingly
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--;
    }
    else{
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    // Re-rendering the tweet feed after the like status is updated
    render();
}

// Function to handle retweet button click event for a specific tweet
function handleRetweetClick(tweetId){
    // Finding the tweet object with the given ID from tweetsData array
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];

    // Toggling the retweet status and updating retweets count accordingly
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    }
    else{
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    // Re-rendering the tweet feed after the retweet status is updated
    render();
}

// Function to handle reply button click event for a specific tweet
function handleReplyClick(replyId){
    // Toggling the visibility of replies section for the specific tweet
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

// Function to handle tweet submission when the tweet button is clicked
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input');

    // Checking if the tweet input is not empty
    if(tweetInput.value){
        // Creating a new tweet object and adding it to the beginning of the tweetsData array
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: '/images/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4() // Generating a unique ID for the new tweet
        });
        // Re-rendering the tweet feed after adding a new tweet
        render();
        // Clearing the tweet input field after submitting the tweet
        tweetInput.value = '';
    }
}

// Function to generate HTML for the entire tweet feed
function getFeedHtml(){
    let feedHtml = ``;
    
    // Iterating through each tweet in the tweetsData array and generating HTML for each tweet
    tweetsData.forEach(function(tweet){
        let likeIconClass = '';

        // Checking if the tweet is liked and updating the class accordingly
        if (tweet.isLiked){
            likeIconClass = 'liked';
        }

        let retweetIconClass = '';

        // Checking if the tweet is retweeted and updating the class accordingly
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted';
        }

        let repliesHtml = '';

        // Generating HTML for each reply in the tweet's replies array
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
            });
        }

        // Generating HTML for the main tweet, including its handle, text, icons, and reply section
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
    });
    return feedHtml; // Returning the generated HTML for the entire tweet feed
}

// Function to render the tweet feed by updating the inner HTML of the 'feed' element
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
}

// Initial rendering of the tweet feed when the page loads
render();
