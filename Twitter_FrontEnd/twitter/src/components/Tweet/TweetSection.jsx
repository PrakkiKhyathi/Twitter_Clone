import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TweetCard from "./TweetCard";
import TweetPageCard from "./TweetPageCard";

function TweetSection() {
  const userId = sessionStorage.getItem("user");
  const [valid, setValid] = useState(true);
  const token = sessionStorage.getItem("token");
  const [profileData, setProfileData] = useState({
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
  const navigate = useNavigate();
  const [tweetData, setTweetData] = useState({
    tweetText: "",
    image: "",
    video: "",
  });
  const [tweetInfoForUser, setTweetInfoForUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followingProfileData, setFollowingProfileData] = useState([]);
  const [tweetDataForFollowing, setTweetDataForFollowing] = useState([]);
  function fetchData() {
    axios
      .get("/user/" + userId, {
        Headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchTweetData() {
    axios
      .get("/tweets/" + userId)
      .then((response) => {
        setTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    const fetchFollowingData = async () => {
      try {
        setLoading(true);
        const followingResponse = await axios.get(
          "follows/followings/" + userId
        );

        setFollowing(followingResponse.data);

        const followingProfilesResponse = await axios.post(
          "user/profiles",
          followingResponse.data,
          {
            headers: {
              Authorization: `Bearer ${token}`,

              "Content-Type": "application/json",
            },
          }
        );
        setFollowingProfileData(followingProfilesResponse.data);
        const tweetDataForFollowingResponse = await axios.post(
          "/tweets/followersTweet",
          followingResponse.data
        );
        setTweetDataForFollowing(tweetDataForFollowingResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchTweetData();
    fetchFollowingData();
  }, []);
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
    );
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setError("");
    if (name === "tweetText") {
      if (value.length > 280) {
        setValid(false);
      } else {
        setValid(true);
      }
    }
    setTweetData((data) => ({ ...data, [name]: value }));
  }
  function handleDelete() {
    fetchTweetData();
  }
  function handleUpdate() {
    fetchTweetData();
  }
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result == string);
      reader.onerror = (error) => reject(error);
    });
  };
  function getBase64Size(base64String) {
    const base64Data = base64String.split(",")[1] || base64String;
    const padding = (base64Data.match(/=+$/) || [""])[0].length;
    return (base64Data.length * 3) / 4 - padding;
  }
  async function handleImageChange(event, field) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = await convertToBase64(file);
      const imageSize = getBase64Size(base64);
      if (imageSize > 26624) {
        setError("File size exceeds 26KB limit.");
        setTweetData((prev) => ({ ...prev, [field]: base64 }));
        setValid(false);
      } else {
        setError("");
        setTweetData((prev) => ({ ...prev, [field]: base64 }));
        setValid(true);
      }
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    const media = [];
    if (tweetData.image !== "") {
      media.push({
        mediaUrl: tweetData.image,
        mediaType: "IMAGE",
        createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      });
    }
    if (tweetData.video !== "") {
      media.push({
        mediaUrl: tweetData.video,
        mediaType: "VIDEO",
        createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      });
    }
    const tweetState = {
      userId: userId,
      tweetContent: tweetData.tweetText,
      type: "TWEET",
      likes: 0,
      createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      updatedAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      media: media,
    };
    axios
      .post("/tweets/create", tweetState)
      .then((response) => {
        fetchTweetData();
        setTweetData((state) => ({
          ...state,
          tweetText: "",
          image: "",
          video: "",
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleOpenEmoji() {
    setOpen((open) => !open);
  }
  function handleEmojiClick(value) {
    const { emoji } = value;
    handleEmojiChange("tweetText", emoji);
  }
  function handleEmojiChange(name, value) {
    setError("");
    setTweetData((prev) => {
      const data = prev.tweetText + value;
      if (data.length > 127) {
        console.log(value);
        setValid(false);
      } else {
        setValid(true);
      }
      return { prev, [name]: prev.tweetText + value };
    });
  }
  function handleClose(name) {
    setError("");
    setValid(true);
    setTweetData((prev) => ({ ...prev, [name]: "" }));
  }
  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  return (
    <div>
      <p
        className="p-2"
        style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Home
      </p>
      <div className="d-flex gap-3">
        <Avatar
          alt="Avatar"
          src={profileData.profilePicture}
          onClick={() => handleProfileClick(String(profileData.userId))}
        />

        <div className="w-100">
          <form onSubmit={handleSubmit}>
            <div>
              <textarea
                className="form-control border-0 bg-transparent fs-5 focus-ring-0 shadow-none"
                placeholder="What is Happening"
                maxLength={280}
                onChange={handleChange}
                name="tweetText"
                value={tweetData.tweetText}
              />
              <span>
                {280 - tweetData.tweetText.length}/{280} characters remaining
              </span>
              {error && <p className="text-danger">{error}</p>}
            </div>
            {tweetData.image && (
              <div className="position-relative">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => handleClose("image")}
                  aria-label="close"
                  className="position-absolute top-0 end-0 me-5"
                >
                  <CloseIcon />
                </IconButton>
                <img src={tweetData.image} alt="tweetImage" width={"60%"} />
              </div>
            )}
            {tweetData.video && (
              <div className="position-relative">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => handleClose("video")}
                  aria-label="close"
                  className="position-absolute top=0 end-0 me-5"
                >
                  <CloseIcon />
                </IconButton>
                <video src={tweetData.video} controls width={"80%"} />
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div className="d-flex gap-3 align-items-center">
                <label className="d-flex align-items-center gap-2 rounded-nd cursor-pointer">
                  <ImageIcon className="text-primary" />
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    style={{ display: "none" }}
                    id="image-upload"
                    onChange={(e) => handleImageChange(e, "image")}
                  />
                </label>
                <label className="flex align-items-center gap-2 rounded-md cursor-pointer">
                  <SlideshowIcon className="text-primary" />

                  <input
                    type="file"
                    accept="video/mp4, video/webm"
                    name="video"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, "video")}
                  />
                </label>
                <div className="position-relative">
                  <TagFacesIcon
                    onClick={handleOpenEmoji}
                    className="text-primary cursor-pointer"
                  />

                  {openEmoji && (
                    <div className="position-absolute custom-top-10 z-50 ">
                      <EmojiPicker
                        LazyLoadEmojis={true}
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="align-items-start">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#1d9bfe",
                    borderRadius: "20px",
                    paddingy: "8px",
                    paddingX: "20px",
                    color: "white",
                  }}
                  disabled={!valid}
                >
                  Tweet
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <section className="gap-3">
        {tweetInfoForUser.map((item) => (
          <TweetCard
            profileData={profileData}
            tweetItem={item}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            key={item}
          />
        ))}
        {tweetDataForFollowing.length > 0 &&
          tweetDataForFollowing.map((tweetItemForFollowing) => {
            const followingUserData = followingProfileData.find(
              (item) => item.userId == tweetItemForFollowing.userId
            );
            return (
              <TweetPageCard
                profileData={followingUserData}
                tweetItem={tweetItemForFollowing}
              />
            );
          })}
      </section>
    </div>
  );
}
export default TweetSection;
