import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReplyModal from "../Reply/ReplyModal";
import ReTweetModal from "../Reply/ReTweetModal";

function TweetPageCard({ profileData, tweetItem }) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const navigate = useNavigate();
  const [like, setLike] = useState(false);
  const timeUnits = [
    {
      unit: "year",
      seconds: 31536000,
    },
    {
      unit: "month",
      seconds: 2592000,
    },
    { unit: "week", seconds: 604800 },
    {
      unit: "day",
      seconds: 86400,
    },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];
  function getRelativeTime(secondsAgo) {
    for (const { unit, seconds } of timeUnits) {
      if (secondsAgo >= seconds || unit == "second") {
        const value = Math.floor(secondsAgo / seconds);
        return rtf.format(-value, unit);
      }
    }
  }
  function formatTweetTimestamp(timeStamp) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timeStamp) / 1000);
    if (diffInSeconds < 7 * 86400) {
      return getRelativeTime(diffInSeconds);
    } else {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
      }).format(timeStamp);
    }
  }
  const [openRetweetModel, setOpenRetweetModel] = useState();
  const handleCloseReplyModel = () => setOpenReplyModel(false);
  const [openReplyModel, setOpenReplyModel] = useState();
  const handleOpenReplyModel = () => {
    console.log("reply");
    setOpenReplyModel(true);
  };
  const handleCloseRetweetModel = () => setOpenRetweetModel(false);
  const handleOpenRetweetModel = () => {
    console.log("retweet");

    setOpenRetweetModel(true);
  };
  function handleTweetPageClick() {
    navigate(
      "/home/replyTweetPage/" + tweetItem.tweetId + "/" + tweetItem.userId
    );
  }
  function handleLikeClick() {
    setLike((like) => !like);
    if (like) {
      axios
        .put("/tweets/dislike/" + tweetItem.tweetId)
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put("/tweets/like/" + tweetItem.tweetId)
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  }
  const userId = sessionStorage.getItem("user");
  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-2">
            <Avatar
              alt="Avatar"
              src={profileData.profilePicture}
              className="cursor-pointer"
              onClick={() => handleProfileClick(profileData.userId)}
            />
          </div>
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center">
              <div
                className="d-flex cursor-pointer align-items-center gap-4"
                onClick={() => handleProfileClick(profileData.userId)}
              >
                <span className="text-dark" style={{ fontWeight: "700" }}>
                  {profileData.firstName}
                  {profileData.lastName}
                </span>
                <span className="text-gray-600">
                  @{profileData.firstName}
                  {"_"}
                  {profileData.lastName}
                  {""}
                </span>
                <span>
                  {formatTweetTimestamp(new Date(tweetItem.updatedAt))}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="cursor-pointer" onClick={handleTweetPageClick}>
                <p className="mb-2 p-0">{tweetItem.tweetContent}</p>
                {tweetItem.media.length > 0 &&
                  tweetItem.media.map((media) => {
                    if (media.mediaType === "IMAGE") {
                      return (
                        <img
                          className="w-[28rem] border border-gray-400 p-4 rounded-md"
                          src={media.mediaUrl}
                          alt=""
                        />
                      );
                    } else if (media.mediaType === "VIDEO") {
                      return (
                        <video
                          controls
                          className="w-[28rem] border border-gray-400 p-4 rounded-md"
                          src={media.mediaUrl}
                        />
                      );
                    }
                  })}
              </div>
              <div className="py-5 d-flex flex-wrap justify-content-start gap-5 align-items-center">
                <div className="gap-2 d-flex align-items-center text-secondary">
                  <ChatBubbleOutlineIcon
                    className="cursor-pointer"
                    onClick={handleOpenReplyModel}
                  />
                </div>

                <div className="gap-2 d-flex align-items-center text-secondary">
                  <RepeatIcon
                    className="cursor-pointer"
                    onClick={handleOpenRetweetModel}
                  />
                </div>

                <div
                  className={`${true ? "text-primary" : "text-secondary"}

gap-3 d-flex align-items-center`}
                  onClick={handleLikeClick}
                >
                  {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  {<p className="mb-0">{tweetItem.likes + Number(like)}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {openReplyModel && (
          <ReplyModal
            tweetItem={tweetItem}
            profileData={profileData}
            handleClose={handleCloseReplyModel}
            open={openReplyModel}
          />
        )}
        {openRetweetModel && (
          <ReTweetModal
            tweetItem={tweetItem}
            profileData={profileData}
            handleClose={handleCloseRetweetModel}
            open={openRetweetModel}
          />
        )}
      </div>
    </div>
  );
}
export default TweetPageCard;
