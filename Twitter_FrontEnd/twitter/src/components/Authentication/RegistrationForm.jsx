import { useEffect, useState } from "react";
import styles from "../../moduleCss/Registration.module.css";
import { Password } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  validateConfirmPassword,
  validateDateOfBirth,
  validateEmailId,
  validateFirstName,
  validatePassword,
} from "../../Validation/Validator";
import axios from "axios";
import TwitterImage from "./TwitterImage";
function RegistrationForm() {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    joinedDate: new Date().toISOString().split("T")[0],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [emailIds, setEmailIds] = useState([]);
  const [formErrors, setFormErrors] = useState({
    firstNameError: "",
    emailError: "",
    dateOfBirthError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  function fetchEmails() {
    axios.get("/user/userEmails").then((response) => {
      const date = response.data;
      setEmailIds(data);
    });
  }
  useEffect(() => {
    fetchEmails();
  }, []);
  function handleLoginPage() {
    navigate("/login");
  }
  const messages = {
    FIRST_NAME_ERROR: "Please Enter Valid Name",
    EMAIL_ERROR: "Please Enter Valid Email Id",
    dateOfBirth_ERROR: "You must be at lease 18 years old to create an account",
    PASSWORD_ERROR:
      "Password muse be 8-16 characters long and include at lease one uppercase letter, one lowercase letter, one digit, and one special character (@$!%?&)",
    CONFIRM_PASSWORD_ERROR: "ConfirmPassword should match with password",
    MANDATORY: "All fields are mandatory. Please complete them",
    ERROR_MESSAGE: "Something went wrong. Please tru again later",
    SUCCES_MESSAGE: "Account created Successfully",
    EMAIL_ALREADY_EXISTS:
      "This email is already registered. Please log in or use a differnt email.",
  };
  function handleChange(e) {
    const { name, value } = e.target;
    setSuccessMessage("");
    setErrorMessage("");
    setMandatory(false);
    setState((state) => ({ ...state, [name]: value }));
    validateField(name, value);
  }
  function validateField(name, value) {
    let errors = formErrors;
    if (name === "firstName") {
      if (!validateFirstName(value)) {
        setFormErrors((errors) => ({
          ...errors,
          firstNameError: messages.FIRST_NAME_ERROR,
        }));
        errors.firstNameError = messages.FIRST_NAME_ERROR;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          firstNameError: "",
        }));
        errors.firstNameError = "";
      }
    } else if (name === "emailId") {
      if (!validateEmailId(value)) {
        setFormErrors((errors) => ({
          ...errors,
          emailError: messages.EMAIL_ERROR,
        }));
        errors.emailError = messages.EMAIL_ERROR;
      } else if (emailIds.includes(value)) {
        setFormErrors((errors) => ({
          ...errors,
          emailError: messages.EMAIL_ALREADY_EXISTS,
        }));
        errors.emailError = messages.EMAIL_ALREADY_EXISTS;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          emailError: "",
        }));
        errors.emailError = "";
      }
    } else if (name === "dateOfBirth") {
      if (!validateDateOfBirth(value)) {
        setFormErrors((errors) => ({
          ...errors,
          dateOfBirthError: messages.dateOfBirth_ERROR,
        }));
        errors.dateOfBirthError = messages.dateOfBirth_ERROR;
      } else {
        setFormErrors((errors) => ({ ...errors, dateOfBirthError: "" }));
        errors.dateOfBirthError = "";
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
      state.firstName === "" ||
      state.password === "" ||
      state.emailId === "" ||
      state.dateOfBirth === "" ||
      state.confirmPassword === ""
    ) {
      setMandatory(true);
    } else {
      setMandatory(false);
      axios
        .post("/user/signup", state)
        .then((response) => {
          const data = response.data;
          setSuccessMessage(messages.SUCCES_MESSAGE);
          sessionStorage.setItem("user", data.userId);
          sessionStorage.setItem(
            "credentials",
            JSON.stringify({ emailId: data.emailId, password: data.password })
          );
          setState((state) => ({
            ...state,
            firstName: "",
            lastName: "",
            password: "",
            dateOfBirth: "",
            confirmPassword: "",
            emailId: "",
          }));
          setErrorMessage("");
          fetchEmails();
        })
        .catch((errors) => {
          setErrorMessage(messages.ERROR_MESSAGE);
          setSuccessMessage("");
        });
    }
  }
  return (
    <div className="container-fluid">
      <div className="row" style={{ display: "flex", height: "100vh" }}>
        <TwitterImage />
        <div className="col-md-5 p-3" style={{ backgroundColor: "#111" }}>
          <p className={`text-white bold text-center ${styles.crateAcc}`}>
            Create Your Account
          </p>
          <form
            className={`ps-4 ${styles.formContainer}`}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label className={`form-label ${styles.formLabel}`}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                data-testid="firstName"
                className={`form-control text-white`}
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.firstName}
                onChange={handleChange}
              />
              {formErrors.firstNameError && (
                <span className="text-danger">{formErrors.firstNameError}</span>
              )}
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="lastName"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                data-testid="lastName"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="emailId"
              >
                Email:
              </label>
              <input
                type="email"
                id="emaiId"
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
                htmlFor="dateOfBirth"
              >
                Date Of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                date-testid="dateOfBirth"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                  colorScheme: "light",
                }}
                value={state.dateOfBirth}
                onChange={handleChange}
              />
              {formErrors.dateOfBirthError && (
                <span className="text-danger">
                  {formErrors.dateOfBirthError}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className={`form-label ${styles.formLabel}`}>
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
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="confirmPassword"
              >
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
              type="submit"
              disabled={!valid}
              className="btn btn-primary mt-2 text-center"
            >
              SIGN UP
            </button>
          </form>
          <div className={`ps-4 form-group`} style={{ width: "80%" }}>
            <p className="text-center pt-2" style={{ color: "#999" }}>
              Already Have Account
            </p>
            <button
              className={`${styles.loginBtn}`}
              style={{ width: "100%" }}
              onClick={handleLoginPage}
            >
              SIGN IN
            </button>
            {successMessage && (
              <h5 className="text-success">
                <b>{successMessage}</b>
              </h5>
            )}
            {mandatory && (
              <h5 className="text-danger">
                <b>{messages.MANDATORY}</b>
              </h5>
            )}
            {errorMessage && (
              <h5 className="text-danger">
                <b>{messages.ERROR_MESSAGE}</b>
              </h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegistrationForm;
