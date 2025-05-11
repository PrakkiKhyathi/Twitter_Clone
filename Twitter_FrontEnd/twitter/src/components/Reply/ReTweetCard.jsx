function ReTweetCard({ reTweetData }) {
  const token = sessionStorage.getItem("token");
  const [replyedProfileData, setReplyedProfileData] = useState({
    bio: "",
    coverPhoto: "",
    dateOfBirth: "",
    emailId: "",
    firstName: "",
    joinedDate: "",
    lastName: "",
    location: "",
    profilePicture: "",
    userId: 0,
    website: "",
  });
  function fetchData() {
    axios
      .get("/user/" + reTweetData.userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setReplyedProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);
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
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user");
  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  function handleTweetPageClick() {
    navigate(
      "/home/replyTweetPage/" + reTweetData.tweetId + "/" + reTweetData.userId
    );
  }
  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div
            className="col-2"
            onClick={() =>
              handleProfileClick(String(replyedProfileData.userId))
            }
          >
            <Avatar
              alt="Avatar"
              src={replyedProfileData.profilePicture}
              className="cursor-pointer"
            />
          </div>
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center">
              <div
                className="d-flex cursor-pointer align-items-center gap-4"
                onClick={() =>
                  handleProfileClick(String(replyedProfileData.userId))
                }
              >
                <span className="text-dark" style={{ fontWeight: "700" }}>
                  {replyedProfileData.firstName}
                  {replyedProfileData.lastName}
                </span>
                <span className="text-gray-600">
                  @{replyedProfileData.firstName}
                  {"_"}
                  {replyedProfileData.lastName}
                  {""}
                </span>
                <span>
                  {formatTweetTimestamp(new Date(reTweetData.createdAt))}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="cursor-pointer" onClick={handleTweetPageClick}>
                <p className="mb-2 p-8">{reTweetData.tweetContent}</p>
                {reTweetData.media.length > 0 &&
                  reTweetData.media.map((media) => {
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReTweetCard;
