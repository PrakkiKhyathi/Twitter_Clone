import { useState } from "react";

function TweetCard({profileData,tweetItem,onDelete,onUpdate}) {
  const[anchorEl,setAnchorEl]=useState(null);
  const[updatedTweet,setUpdatedTweet]=useState(false);
  const openDeleteMenu=Boolean(anchorEl);
  const
}
export default TweetCard;
