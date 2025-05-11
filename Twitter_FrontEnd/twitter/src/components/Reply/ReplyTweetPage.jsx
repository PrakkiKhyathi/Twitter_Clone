import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReplyTweetDetail from "./ReplyTweetDetail";
import { Divider } from "@mui/material";
import ReplyTweetCard from "./ReplyTweetCard";

function ReplyTweetPage() {
  const { tweetId, userId } = useParams();
  const token = sessionStorage.getItem("token");
  const [tweetProfileData, setTweetProfileData] = useState({});
  const [tweetInfoForUser, setTweetInfoForUser] = useState({});
  const [replyTweetData, setReplyTweetData] = useState([]);
  async function fetchTweetReplyData() {
    axios
      .get("/tweets/reply/" + tweetId)
      .then((response) => {
        setReplyTweetData(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fecthData() {
    axios
      .get("/user/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTweetProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchTweetData() {
    axios
      .get("/tweets/tweet/" + tweetId)
      .then((response) => {
        setTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchTweetReplyData();
    fecthData();
    fetchTweetData();
  }, [tweetId, userId]);
  return (
    <div>
      {tweetProfileData && tweetInfoForUser && (
        <ReplyTweetDetail
          profileData={tweetProfileData}
          tweetItem={tweetInfoForUser}
        />
      )}
      <Divider sx={{ margin: "3rem 0rem", backgroundColor: "black" }} />
      {replyTweetData.map((replyTweetData, index) => (
        <ReplyTweetCard replyTweetData={replyTweetData} key={index} />
      ))}
    </div>
  );
}
export default ReplyTweetPage;
