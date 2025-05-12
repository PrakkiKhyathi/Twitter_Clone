import { Search } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function RightPart() {
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("user");
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [finalResult, setFinalResult] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDeleteMenu = Boolean(anchorEl);
  const handleOpenDeleteMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDeleteMenu = () => {
    setAnchorEl(null);
  };
  function handleChange(e) {
    setSearch(e.target.value);

    setFinalResult([]);

    if (e.target.value === "") {
      setSearchResult([]);
      navigate("/home");
      dispatch({
        type: "TWEET_DATA",
        payload: { tweets: [], userIdsProfileData: [] },
      });
      return;
    }
    axios
      .get("/search/user?query=" + e.target.value, {
        headers: {
          Authorization: `Bearer $(token)`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSearchResult(response.data);
        const data = response.data;
        let userIds = [];
        data.forEach((ele) => userIds.push(ele.userIds));
        axios
          .get("/follow/followings/" + userId)
          .then((response) => {
            setFollowingIds(response.data);
            I;
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    fetchTweetData();
  }
  function fetchTweetData() {
    axios
      .get("/search/tweets?query=" + search, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.length > 0) {
          let userIds = [];
          data.forEach((ele) => userIds.push(ele.userId));
          axios
            .post("/user/profiles", userIds, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              navigate("/home/tweetPage");
              dispatch({
                type: "TWEET_DATA",
                payload: { tweets: data, userIdsProfileData: response.data },
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
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
  const [isLocationEnabled, setLocationEnabled] = useState(false);
  function handleLocationChange(e) {
    setLocationEnabled((enable) => !enable);

    axios
      .get("/user/privacy/" + userId + "Penabled=" + String(e.target.checked), {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchUserData() {
    axios
      .get("/user/" + userId, {
        headers: {
          Authorization: `Bearer $(token)`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setLocationEnabled(
          (res.data.isLocationEnabled = "TRUE" ? true : false)
        );
        setProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="py-5 sticky-top overflow-hidden">
      <div className="overflow-auto">
        <div className="position-relative d-flex align-items-center ms-4">
          <div className="form-group d-flex justify-content-between gap-4 align-items-center">
            <input
              value={search}
              onChange={handleChange}
              type="text"
              placeholder="Search"
              className="form-control"
              style={{
                paddingTop: "13px",
                paddingBottom: "13px",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
              onkeyup={handlekeyButton}
            />
            <div>
              <Button onClick={handleOpenDeleteMenu}>
                <Brightness4Icon
                  id="basic-button"
                  aria-controls={openDeleteMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDeleteMenu ? "true" : undefined}
                  className="ml-3 cursor-pointer"
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
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={isLocationEnabled}
                    onChange={handleLocationChange}
                  />
                  <MenuItem>Location</MenuItem>
                </div>
              </Menu>
            </div>
          </div>
          <span className="position-absolute top-0 start-0 left-8 ps-1 pt-2">
            <Search className="text-secondary" />
          </span>
        </div>
        {searchResult.length > 0
          ? searchResult.map((data) => (
              <div
                onClick={() => handleProfileClick(data.userId)}
                className="d-flex align-items-center gap-2 ms-3 p-3 cursor-pointer"
              >
                <Avatar alt={data.firstName} src={data.profilePicture} />

                <div className="ms-2">
                  <p className="mb-0">
                    {data.firstName + ""}
                    (data.lastName)
                  </p>

                  <p className="text-sm text-secondary mb-8">
                    @{data.firstName + "_"}
                    {data.lastName}
                  </p>
                </div>
              </div>
            ))
          : search !== "" &&
            finalResult.length === 0 && (
              <p
                style={{ fontSize: "35px", fontWeight: "bold" }}
                className="mt-3 ps-3"
              >
                No Users Found
              </p>
            )}
        {finalResult.length > 0 &&
          finalResult.map((data) => (
            <div
              className="d-flex gap-3 mt-3 m3-2"
              onClick={() => handleProfileClick(data.userId)}
            >
              <Avatar
                alt="Avatar"
                src={data.profilePicture}
                className="cursor-pointer"
              />
              <div className="w-100">
                <div className="d-flex gap-1 align-items-start justify-content-between ">
                  <div
                    className="d-flex flex-column cursor-pointer justify-content-center
align-items-start gap-0"
                  >
                    {""}

                    <span className="text-dark" style={{ fontweight: "700" }}>
                      {data.firstName} {data.lastName}
                    </span>
                    <span className="text-secondary">
                      @{data.firstName} {"_"}
                      {data.lastName}.
                    </span>
                    <p className="mb-0">{data.bio}</p>
                  </div>
                  {userId != data.userId && (
                    <button className="btn btn-primary">
                      {followingIds.filter((ele) => data.userId == ele)
                        .length == 1
                        ? "UNFOLLOW"
                        : "FOLLOW"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default RightPart;
