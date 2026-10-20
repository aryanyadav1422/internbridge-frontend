import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  Avatar,
  Box,
} from "@material-ui/core";
import axios from "axios";
import BusinessIcon from "@material-ui/icons/Business";
import SaveIcon from "@material-ui/icons/Save";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 20px 80px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    padding: "36px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    marginBottom: "24px",
  },
  headerAvatar: {
    width: 72,
    height: 72,
    backgroundColor: "#0f172a",
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#2563eb",
  },
  sectionTitle: {
    fontWeight: 800,
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  primaryBtn: {
    borderRadius: "12px",
    padding: "12px 28px",
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.25)",
    "&:hover": {
      background: "#2563eb",
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const getData = useCallback(() => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails({
          name: response.data.name || "",
          bio: response.data.bio || "",
          contactNumber: response.data.contactNumber || "",
        });
        if (response.data.contactNumber) {
          setPhone(response.data.contactNumber.replace("+", ""));
        }
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching recruiter details",
        });
      });
  }, [setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleUpdate = () => {
    const updatedDetails = {
      ...profileDetails,
      contactNumber: phone !== "" ? `+${phone}` : "",
    };

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message || "Recruiter profile updated successfully!",
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Failed to update profile",
        });
      });
  };

  return (
    <Box className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={11} md={8}>
          {/* Header Card */}
          <Paper className={classes.card} elevation={0}>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar className={classes.headerAvatar}>
                {profileDetails.name ? profileDetails.name.charAt(0).toUpperCase() : <BusinessIcon />}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5" style={{ fontWeight: 800, color: "#0f172a" }}>
                  {profileDetails.name || "Recruiter Profile"}
                </Typography>
                <Typography variant="body2" style={{ color: "#64748b", marginTop: "4px" }}>
                  Verified Hiring Partner • InternBridge Employer Network
                </Typography>
              </Box>
              <Button
                variant="contained"
                className={classes.primaryBtn}
                startIcon={<SaveIcon />}
                onClick={handleUpdate}
              >
                Save Details
              </Button>
            </Box>
          </Paper>

          {/* Form Card */}
          <Paper className={classes.card} elevation={0}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <BusinessIcon style={{ color: "#2563eb" }} /> Organization Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Recruiter / Company Name"
                  variant="outlined"
                  fullWidth
                  value={profileDetails.name}
                  onChange={(e) =>
                    setProfileDetails({ ...profileDetails, name: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company Bio / About Hiring Team"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={profileDetails.bio}
                  onChange={(e) =>
                    setProfileDetails({ ...profileDetails, bio: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" style={{ color: "#64748b", display: "block", marginBottom: "6px" }}>
                  Official Contact Phone Number
                </Typography>
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(p) => setPhone(p)}
                  inputStyle={{ width: "100%", height: "54px", borderRadius: "10px" }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;