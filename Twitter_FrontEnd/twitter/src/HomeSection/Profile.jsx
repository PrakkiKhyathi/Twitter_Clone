import { Tab } from "bootstrap";
import EditProfile from "./EditProfile";

function Profile() {
  const token = sessionStorage.getItem("token");

  const userId = sessionStorage.getItem("user");

  const [open, setOpen] = useState(false);

  const [tabValue, setTabValue] = React.useState("1");

  const [tweetInfoForUser, setTweetInfoForUser] = useState([]);

  const [retweetInfoForUser, setReTweetInfoForUser] = useState([]);

  const [followers, setFollowers] = useState([]);

  const [following, setFollowing] = useState([]);

  const [followersProfileData, setFollowersProfileData] = useState([]);

  const [followingProfielData, setFollowingProfileData] = useState([]);
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
  function fetchData() {
    axios
      .get("/user/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
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
        console.log(response.data);
        setTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchReTweetData() {
    axios
      .get("tweets/retweet/" + userId)
      .then((response) => {
        console.log(response.data);
        setReTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleDelete() {
    fetchTweetData();

    fetchReTweetData();
  }

  function handleUpdate() {
    fetchTweetData();

    fetchReTweetData();
  }

  function fetchFollowersIds() {
    axios
      .get("/follow/followers/" + userId)
      .then((response) => {
        setFollowers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchFollowingIds() {
    axios
      .get("/follow/followings/" + userId)
      .then((response) => {
        console.log(response);
        setFollowing(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchFollowersUserData() {
    axios
      .post("/user/profiles", followers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTabValue("3");
        setFollowersProfileData(response.data);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }
  function fetchFollowingUserData() {
    axios
      .post("/user/profiles", following, {
        headers: {
          Authorization: `Bearer $(token)`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setTabValue("2");
        setFollowingProfileData(response.data);
      });
    I.catch((errors) => {
      console.log(errors);
    });
  }
  useEffect(() => {
    fetchData();
    fetchTweetData();
    fetchReTweetData();
    fetchFollowersIds();
    fetchFollowingIds();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === "2") {
      fetchFollowingUserData();
    } else if (newValue === "3") {
      fetchFollowersUserData();
    }
  };
  const navigate = useNavigate();
  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  const handleSave = () => {
    fetchData();
    setOpen(false);
  };
  return (
    <div>
      <section className="py-2" style={{ display: "flex", gap: "10px" }}>
        <KeyboardBackspaceIcon className="cursor-pointer" />
        <h5 className="">
          {profileData.firatName} {profileData.lastName}
        </h5>
      </section>
      <section>
        <img
          src={profileData.coverPhoto || "https://vie.placeholder.com/600x280"}
          alt="coverImage"
          width={500}
          height={250}
        />
      </section>
      <section className="p1-6">
        <div className="d-flex justify-content-between align-items-start mt-0 h-[5rem]">
          <Avatar
            alt="Avatar"
            src={profileData.profilePicture || ""}
            className="transform -translate-y-24"
            sx={{
              width: "Brem",
              height: "Brem",
              border: "4px solid white",
              transform: "translateY(-24%)",
            }}
            onClick={() => handleProfileClick(String(profileData.userId))}
          />

          <Button
            variant="contained"
            className="mt-2"
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
        <div onClick={() => handleProfileClick(String(profileData.userId))}>
          <p
            style={{
              fontSize: "20px",

              fontFamily: "sans-serif",

              fontweight: "bold",
            }}
            className="mb-0"
          >
            {profileData.firstName + " "} {profileData.lastName}
          </p>
          <p
            style={{
              fontSize: "16px",
              fontFamily: "sans-serif",
              color: "grey",
            }}
            className="mt-0"
          >
            {"@" + profileData.firstName}{" "}
            {profileData.lastName && "_" + profileData.lastName}
          </p>
        </div>
        <div className="mt-2 gap-3">
          {profileData.bio && (
            <p className="text-secondary " style={{ fontWeight: "400" }}>
              {profileData.bio}
            </p>
          )}
          <div className="py-1 d-flex gap-5">
            <div className="d-flex align-items-center text-secondary gap-2">
              <BusinessCenterSharp />
              <p className="mb-8">Education</p>
            </div>
            <div className="d-flex align-items-cerler text-secondary gap-2">
              <LocationOnIcon />
              <p className="mb-8">{profileData.location}</p>
            </div>
            <div className="d-flex align-items-center text-secondary gap-2">
              <CalendarMonthicon />
              <p className="mb-8">{profileData.joinedDate}</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-5 mt-2">
            <div
              className="d-flex align-items-center gap-2"
              style={{ fontweight: "bold" }}
            >
              <span>{following.length}</span>

              <span className="text-secondary" onClick={fetchFollowingUserData}>
                Following
              </span>
            </div>

            <div
              className="d-flex align-items-center gap-1 font-semibold"
              style={{ fontweight: "bold" }}
            >
              <span>{followers.length}</span>

              <span className="text-secondary" onClick={fetchFollowersUserData}>
                Followers
              </span>
            </div>
          </div>
        </div>
        <section>
          <Box sx={{ width: "100%", typography: "body1", marginTop: "20px" }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-Label="lab API tabs example"
                >
                  <Tab Label="Tweets" value="1" />
                  <Tab Label="Following" value="2" />
                  <Tab Label="Followers" value="3" />
                  <Tab Label="ReTweets" value="4" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {tweetInfoForUser.map((item) => (
                  <TweetCard
                    profileData={profileData}
                    tweetItem={item}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </TabPanel>
              <TabPanel value="2">
                {followingProfielData.map((following) => (
                  <FollowingSection profileData={following} />
                ))}
              </TabPanel>
              <TabPanel value="3">
                {followersProfileData.map((followers) => (
                  <FollowersSection profileData={followers} />
                ))}
              </TabPanel>
              <TabPanel value="4">
                {retweetInfoForUser.map((reTweetItem) => (
                  <TweetCard
                    profileData={profileData}
                    tweetItem={reTweetItem}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </TabPanel>
            </TabContext>
          </Box>
        </section>
      </section>
      {open && (
        <EditProfile
          open={open}
          handleClose={() => setOpen(false)}
          user={profileData}
          handleSave={handleSave}
        />
      )}
    </div>
  );
}
export default Profile;
