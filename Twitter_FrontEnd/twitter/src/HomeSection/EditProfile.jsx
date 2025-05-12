import { useEffect, useState } from "react";

function EditProfile({ open, handleClose, user, handleSave }) {
  const token = sessionStorage.getItem("token");
  const [profileData, setProfileData] = useState(user);
  useEffect(() => {
    setProfileData(user);
  }, []);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const convertToBase64 = (file) => {
    return (
      new Promise() <
      string >
      ((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      })
    );
  };
  const handleImageChange = async (event, field) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Convert and store Base64 image

      const base64 = await convertToBase64(file);

      setProfileData((prev) => ({ ...prev, [field]: base64 }));
    }
  };
  const handleSubmit = (profileDate) => {
    console.log(profileData);
    const updateProfile = {
      userId: profileData.userId,
      bio: profileData.bio,
      location: profileData.location,
      website: profileData.website,
      coverPhoto: profileDate.coverPhoto,
      profilePicture: profileData.profilePicture,
    };
    axios
      .put("user/update", updateProfile, {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        handleSave();
        setSuccessMessage(response.data);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage("Something went wrong please try again");
        setSuccessMessage("");
      });
  };
  return (
    <Dialog open={open} onClose={handleClose} fullwidth maxwidth="sm">
      <DialogTitle>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-Label="close"
        >
          <CloseIcon />
        </IconButton>
        Edit Profile
      </DialogTitle>

      <DialogContent>
        <div
          style={{
            position: "relative",

            textAlign: "center",

            marginTop: "40px",
          }}
        >
          <img
            src={
              profileData.coverPhoto || "https://via.placeholder.com/600x200"
            }
            alt="Cover"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <input
            type="file"
            accept="image/*"
            name="coverPhoto"
            style={{ display: "none" }}
            id="cover-image-upload"
            onChange={(e) => handleImageChange(e, "coverPhoto")}
          />
          <label html For="cover-image-upload">
            <IconButton
              style={{
                position: "absolute",

                bottom: "10px",

                right: "10px",

                backgroundColor: "rgba(0, 0, 0, 0.5)",

                color: "white",

                I,
              }}
              component="span"
            >
              <CameraAltIcon />
            </IconButton>
          </label>
        </div>
        <div
          style={{
            display: "flex",

            justifyContent: "center",

            marginTop: "-50px",
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="profile-image-upload"
            name="profilePicture"
            onChange={(e) => handlebageChange(e, "profilePicture")}
          />
          <label html For="profile-image-upload">
            <Avatar
              src={
                profileData.profilePicture || "https://via.placeholder.com/150"
              }
              alt="Profile"
              sx={{
                width: 100,
                height: 100,
                border: "4px solid white",
                cursor: "pointer",
              }}
            />
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            placeholder="FirstName"
            className="form-control"
            readOnly
          />

          <label className="form-label" htmlFor="firstName">
            FirstName
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
            placeholder="LastName"
            readOnly
            className="form-control"
          />
          <label className="form-label" htmlFor="lastName">
            LastName
          </label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            id="bio"
            name="bio"
            rows={7}
            cols={15}
            onChange={handleChange}
            className="form-control"
            value={profileData.bio}
            style={{ height: "100px" }}
            maxLength={280}
          />
          <label className="form-label" htmlFor="bio">
            Bio
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            id="location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
            placeholder="Location"
            className="form-control"
          />

          <label className="form-label" htmlFor="location">
            Location
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="url"
            id="website"
            name="website"
            value={profileData.website}
            onChange={handleChange}
            placeholder="Website"
            className="form-control"
          />

          <label className="form-label" htmlFor="website">
            Website
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={profileData.dateOfBirth}
            onChange={handleChange}
            placeholder="DateOfBirth"
            className="form-control"
            readOnly
          />

          <label className="form-label" htmlFor="dateOfBirth">
            DateOfBirth
          </label>
        </div>
      </DialogContent>
      <DialogActions>
        <button onClick={handleClose} className="btn btn-secondary">
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={() => handleSubmit(profileData)}
        >
          Save
        </button>
        {successMessage && <p className="text-success"> {successMessage}</p>}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </DialogActions>
    </Dialog>
  );
}
export default EditProfile;
