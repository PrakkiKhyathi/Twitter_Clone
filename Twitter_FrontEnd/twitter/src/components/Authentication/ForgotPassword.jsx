import { useState } from "react";
import {
  validateConfirmPassword,
  validateEmailId,
  validatePassword,
} from "../../Validation/Validator";
import styles from "../../moduleCss/LoginForm.module.css";
import { ErrorSharp } from "@mui/icons-material";
import TwitterImage from "./TwitterImage";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [state, setState] = useState({
    emailId: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    passwordError: "",
    confirmPasswordError: "",
    emailError: "",
  });
  const [valid, setValid] = useState(false);
  const [mandatory, setMandatory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const messages = {
    PASSWORD_ERROR:
      "Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%?&).",
    CONFIRM_PASSWORD_ERROR: "ConfirmPassword should match with password",
    MANDATORY: "All fields are mandatory. Please complete them",
    EMAIL_ERROR: "Please Enter Valid Email Id",
    SUCCESS: "Reset Password Successfully",
  };
  function handleChange(e) {
    setMandatory(false);
    setSuccessMessage("");
    setErrorMessage("");
    const { name, value } = e.target;
    setState((state) => ({ ...state, [name]: value }));
    validateField(name, value);
  }
  function validateField(name, value) {
    let errors = formErrors;
    if (name === "emailId") {
      if (!validateEmailId(value)) {
        setFormErrors((errors) => ({
          ...errors,
          emailError: messages.EMAIL_ERROR,
        }));
        errors.emailError = messages.EMAIL_ERROR;
      } else {
        setFormErrors((errors) => ({ ...errors, emailError: "" }));
        errors.emailError = "";
      }
    } else if (name === "password") {
      if (!validatePassword(value)) {
        setFormErrors((errors) => ({
          ...errors,
          passwordError: messages.PASSWORD_ERROR,
        }));
        errors.passwordError = messages.PASSWORD_ERROR;
      } else {
        setFormErrors((errors) => ({ ...errors, passwordError: "" }));
        errors.passwordError = "";
      }
    } else if (name === "confirmPassword") {
      if (!validateConfirmPassword(state.password, value)) {
        setFormErrors((errors) => ({
          ...errors,
          confirmPasswordError: messages.CONFIRM_PASSWORD_ERROR,
        }));
        errors.confirmPasswordError = messages.CONFIRM_PASSWORD_ERROR;
      } else {
        setFormErrors((errors) => ({ ...errors, confirmPasswordError: "" }));
        errors.confirmPasswordError = "";
      }
    }
    if (Object.values(errors).every((val) => val === "")) {
      setValid(true);
    } else {
      setValid(false);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (
      state.emailId === "" ||
      state.password === "" ||
      state.confirmPassword === ""
    ) {
      setMandatory(true);
    } else {
      setMandatory(false);
      axios
        .put("/user/resetPassword", state)
        .then((response) => {
          setSuccessMessage(response.data);
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage(error.response.data.errorMessage);
          setSuccessMessage("");
        });
    }
  }
  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "100vh", overflow: "hidden" }}>
        <TwitterImage />
        <div className="col-md-5 p-3" style={{ backgroundColor: "#111" }}>
          <p
            className="text-white bold text-center"
            style={{ fontWeight: "bold", fontSize: "30px" }}
          >
            Password Reset
          </p>
          <form
            className={`ps-4 ${styles.formContainer}`}
            onSubmit={handleSubmit}
          >
            <p
              className="text-white"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Welcome
            </p>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="emailId"
              >
                Email Id:
              </label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                data-testid="emailId"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.emailId}
                onChange={handleChange}
              />
              {formErrors.emailError && (
                <span className="text-danger">{formErrors.emailError}</span>
              )}
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                data-testid="password"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.password}
                onChange={handleChange}
              />
              {formErrors.passwordError && (
                <span className="text-danger">{formErrors.passwordError}</span>
              )}
            </div>
            <div className="form-group">
              <label className={`form-label ${styles.formLabel}`}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                data-testid="confirmPassword"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPasswordError && (
                <span className="text-danger">
                  {formErrors.confirmPasswordError}
                </span>
              )}
            </div>
            <button
              className="btn btn-primary mt-1"
              style={{ fontSize: "14px" }}
              disabled={!valid}
            >
              RESET PASSWORD
            </button>
            {successMessage && (
              <p className="text-success" style={{ fontSize: "16px" }}>
                <b>{successMessage}</b>
                <Link to="/login">Please Login to continue</Link>
              </p>
            )}
            {mandatory && (
              <p className="text-danger" style={{ fontSize: "16px" }}>
                <b>{messages.MANDATORY}</b>
              </p>
            )}
            {errorMessage && (
              <p className="text-danger" style={{ fontSize: "16px" }}>
                <b>{errorMessage}</b>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
