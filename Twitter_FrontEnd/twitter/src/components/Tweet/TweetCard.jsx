import { MenuItem } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateTweetModal from "./UpdateTweetModal";
import ReplyModal from "../Reply/ReplyModal";

function TweetCard({ profileData, tweetItem, onDelete, onUpdate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [updatedTweet, setUpdatedTweet] = useState(false);
  const openDeleteMenu = Boolean(anchorEl);
  const [like, setLike] = useState(false);
  function handleOpenDeleteMenu(e) {
    setAnchorEl(e.currentTarget);
  }
  function handleCloseDeleteMenu() {
    setAnchorEl(null);
  }
  const navigate = useNavigate();
  function handleDeleteTweet(tweetId) {
    axios
      .delete("/tweets/delete/" + tweetId)
      .then((response) => {
        onDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleUpdateTweet() {
    setUpdatedTweet((update) => !update);
  }
  function handleUpdate() {
    onUpdate();
  }
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
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
  const handleCloseReplyModel = () => setOpenReplyModel(false);
  const [openReplyModel, setOpenReplyModel] = useState();
  const handleOpenReplyModel = () => setOpenReplyModel(true);
  function handleTweetPageClick() {
    navigate(
      "/home/reply/TweetPage/" + tweetItem.tweetId + "/" + tweetItem.userId
    );
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
    <div className="d-flex gap-4 mt-4">
      <Avatar
        alt="Avatar"
        src={profileData.profilePicture}
        className="cursor-pointer"
        onClick={() => handleProfileClick(profileData.userId)}
      />

      <div className="w-100">
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
            <span>{formatTweetTimestamp(new Date(tweetItem.updatedAt))}</span>
          </div>
          <div>
            <Button onClick={handleOpenDeleteMenu}>
              <MoreHorizIcon
                id="basic-button"
                aria-controls={openDeleteMenu ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openDeleteMenu ? "true" : undefined}
              />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openDeleteMenu}
              onClose={handleCloseDeleteMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleDeleteTweet(tweetItem.tweetId);
                }}
              >
                Delete
              </MenuItem>
              <MenuItem onClick={handleUpdateTweet}>Update</MenuItem>
            </Menu>
          </div>
        </div>

        <div className="mt-2">
          <div className="cursor-pointer" onClick={handleTweetPageClick}>
            <p className="mb-2 p-0" onClick={handleTweetPageClick}>
              {tweetItem.tweetContent}
            </p>
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

            <div
              className={`${
                true ? "text-primary" : "text-secondary"
              } gap-3 d-flex
align-items-center`}
            >
              <RepeatIcon className={`cursor-pointer`} />
            </div>
            <div
              className={`${
                true ? "text-primary" : "text-secondary"
              } gap-3 d-flex align-items-center`}
              onClick={handleLikeClick}
            >
              {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}

              {<p className="mb-0">{tweetItem.likes + Number(like)}</p>}
            </div>
          </div>
        </div>
      </div>
      {updatedTweet && (
        <UpdateTweetModal
          open={updatedTweet}
          handleClose={handleUpdateTweet}
          tweetData={tweetItem}
          profileData={profileData}
          onUpdateTweet={handleUpdate}
        />
      )}
      {openReplyModel && (
        <ReplyModal
          tweetItem={tweetItem}
          profileData={profileData}
          handleClose={handleCloseReplyModel}
          open={openReplyModel}
        />
      )}
    </div>
  );
}
export default TweetCard;
