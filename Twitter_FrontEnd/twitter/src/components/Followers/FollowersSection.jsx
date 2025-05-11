import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

function FollowersSection({ profileData }) {
  const userId = sessionStorage.getItem("user");
  const navigate = useNavigate();
  function handleProfileClick(id) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  return (
    <div
      className="d-flex gap-3 mt-3 ms-2 justify-content-between"
      onClick={() => handleProfileClick(profileData.userId)}
    >
      <Avatar
        alt="Avator"
        src={profileData.profilePicture}
        className="cursor-pointer"
      />
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-md-10">
            <span className="text-dark" style={{ fontWeight: "700" }}>
              {profileData.firstName} {profileData.lastName}
            </span>
            <span className="text-secondary">
              @{profileData.firstName}
              {"_"}
              {profileData.lastName}
            </span>
            <p className="mb-0">{profileData.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FollowersSection;
