import { useNavigate } from "react-router-dom";
import TwitterImage from "./TwitterImage";
import styles from "../../moduleCss/Authentication.module.css";

function Authentication() {
  const navigate = useNavigate();
  function handleCreateAccount() {
    navigate("/register");
  }
  function handleLoginPage() {
    navigate("/login");
  }
  return (
    <div className="container-fluid">
      <div className="row p-0" style={{ height: "100vh" }}>
        <TwitterImage />
        <div className="col-md-5 p-5" style={{ backgroundColor: "#111" }}>
          <p className={styles.happeningNow}>Happening now</p>
          <p className={styles.joinTwitter}>Join Twitter Today</p>
          <button
            className={`${styles.createBtn} bg-primary rounded text-center text-white`}
            onClick={handleCreateAccount}
          >
            CREATE ACCOUNT
          </button>
          <span className="text-white">
            By signing up, you agree to the Terms of service and Privacy Policy
            including cookie use
          </span>
          <p className={`text-white mt-4 ${styles.alreadyAcc}`}>
            Already Have Account?
          </p>
          <button className={`${styles.loginBtn}`} onClick={handleLoginPage}>
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
}
export default Authentication;
