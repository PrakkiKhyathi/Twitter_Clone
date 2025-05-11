import { useNavigate } from "react-router-dom";

function ReplyTweetDetail({ profileData, tweetItem }) {
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
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
  function handleTweetPageClick() {
    navigate(
      "/home/replyTweetPage/" + tweetItem.tweetId + "/" + tweetItem.userId
    );
  }
  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  return (
    <>
      {profileData && (
        <div>
          {" "}
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-2">
                <Avatar
                  alt="Avatar"
                  src={replyedProfileData.profilePicture}
                  className="cursor-pointer"
                  onClick={() => handleProfileClick(profileData.userId)}
                />
              </div>
              <div className="col-10">
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="d-flex cursor-pointer align-items-center gap-4"
                    onClick={() =>
                      handleProfileClick(String(profileData.userId))
                    }
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
                      {tweetItem.updatedAt &&
                        formatTweetTimestamp(new Date(tweetItem.updatedAt))}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div
                    className="cursor-pointer"
                    onClick={handleTweetPageClick}
                  >
                    <p className="mb-2 p-8">
                      {tweetItem && tweetItem.tweetContent}
                    </p>
                    {tweetItem &&
                      tweetItem?.media.length > 0 &&
                      tweetItem?.media?.map((media) => {
                        if (media.mediaType === "IMAGE") {
                          return (
                            <img
                              className="w-[28rem] border border-gray-400 p-4 rounded-md"
                              src={media.mediaUrl}
                              alt=""
                            />
                          );
                        }
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ReplyTweetDetail;
