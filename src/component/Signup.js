//import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  MenuItem,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 20px",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    padding: "40px 36px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    maxWidth: "520px",
    width: "100%",
  },
  title: {
    fontWeight: 900,
    letterSpacing: "-0.5px",
    color: "#0f172a",
    marginBottom: "6px",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "28px",
    textAlign: "center",
    fontSize: "0.95rem",
  },
  submitButton: {
    padding: "12px",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.25)",
    marginTop: "20px",
    "&:hover": {
      background: "#2563eb",
    },
  },
  inputField: {
    marginBottom: "16px",
  },
}));

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { untouched: true, required: true, error: false, message: "" },
    password: { untouched: true, required: true, error: false, message: "" },
    name: { untouched: true, required: true, error: false, message: "" },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleSignup = () => {
    let check = Object.keys(inputErrorHandler).every((i) => {
      return inputErrorHandler[i].error === false;
    });

    let updatedDetails = {
      ...signupDetails,
      contactNumber: phone !== "" ? `+${phone}` : "",
    };

    if (check) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Account created successfully!",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response?.data?.message || "Signup failed. Please try again.",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Please fill in all mandatory fields correctly.",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Box className={classes.body}>
      <Paper elevation={0} className={classes.card}>
        <Typography variant="h4" className={classes.title}>
          Create Account
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          Join InternBridge to discover verified roles and launch your career.
        </Typography>

        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              select
              label="I am joining as a..."
              variant="outlined"
              fullWidth
              value={signupDetails.type}
              onChange={(e) => handleInput("type", e.target.value)}
              className={classes.inputField}
            >
              <MenuItem value="applicant">🎓 Student / Job Seeker</MenuItem>
              <MenuItem value="recruiter">🏢 Recruiter / Organization</MenuItem>
            </TextField>
          </Grid>

          <Grid item>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={signupDetails.name}
              onChange={(e) => handleInput("name", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError("name", true, "Name is required");
                } else {
                  handleInputError("name", false, "");
                }
              }}
              error={inputErrorHandler.name.error}
              helperText={inputErrorHandler.name.message}
              className={classes.inputField}
            />
          </Grid>

          <Grid item>
            <TextField
              label="Official Email Address"
              variant="outlined"
              type="email"
              fullWidth
              value={signupDetails.email}
              onChange={(e) => handleInput("email", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError("email", true, "Email is required");
                } else {
                  handleInputError("email", false, "");
                }
              }}
              error={inputErrorHandler.email.error}
              helperText={inputErrorHandler.email.message}
              className={classes.inputField}
            />
          </Grid>

          <Grid item>
            <TextField
              label="Password (min. 6 characters)"
              variant="outlined"
              type="password"
              fullWidth
              value={signupDetails.password}
              onChange={(e) => handleInput("password", e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError("password", true, "Password is required");
                } else if (e.target.value.length < 6) {
                  handleInputError("password", true, "Password must be at least 6 characters");
                } else {
                  handleInputError("password", false, "");
                }
              }}
              error={inputErrorHandler.password.error}
              helperText={inputErrorHandler.password.message}
              className={classes.inputField}
            />
          </Grid>

          {signupDetails.type === "recruiter" && (
            <>
              <Grid item>
                <TextField
                  label="Short Bio / Company Description"
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  value={signupDetails.bio}
                  onChange={(e) => handleInput("bio", e.target.value)}
                  className={classes.inputField}
                />
              </Grid>
              <Grid item style={{ marginBottom: "16px" }}>
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{ width: "100%", height: "54px", borderRadius: "10px" }}
                />
              </Grid>
            </>
          )}

          <Grid item>
            <Button
              variant="contained"
              fullWidth
              className={classes.submitButton}
              onClick={handleSignup}
            >
              Complete Registration
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Signup;