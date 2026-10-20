import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  Avatar,
  Chip,
  Box,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import PersonIcon from "@material-ui/icons/Person";
import SchoolIcon from "@material-ui/icons/School";
import WorkIcon from "@material-ui/icons/Work";
import DescriptionIcon from "@material-ui/icons/Description";
import SaveIcon from "@material-ui/icons/Save";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 20px 80px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    padding: "32px",
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
    color: "#10b981",
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
  chipSkill: {
    margin: "4px",
    fontWeight: 600,
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
}));

const Profile = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [{ institutionName: "", startYear: "", endYear: "" }],
    skills: [],
    resume: "",
    profile: "",
  });

  const [newSkill, setNewSkill] = useState("");

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
          education:
            response.data.education && response.data.education.length > 0
              ? response.data.education
              : [{ institutionName: "", startYear: "", endYear: "" }],
          skills: response.data.skills || [],
          resume: response.data.resume || "",
          profile: response.data.profile || "",
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching profile",
        });
      });
  }, [setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleUpdate = () => {
    axios
      .put(apiList.user, profileDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message || "Profile updated successfully!",
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

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !profileDetails.skills.includes(newSkill.trim())) {
      setProfileDetails({
        ...profileDetails,
        skills: [...profileDetails.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setProfileDetails({
      ...profileDetails,
      skills: profileDetails.skills.filter((s) => s !== skillToDelete),
    });
  };

  const handleAddEducation = () => {
    setProfileDetails({
      ...profileDetails,
      education: [
        ...profileDetails.education,
        { institutionName: "", startYear: "", endYear: "" },
      ],
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEdu = [...profileDetails.education];
    updatedEdu[index][field] = value;
    setProfileDetails({ ...profileDetails, education: updatedEdu });
  };

  return (
    <Box className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={11} md={8}>
          {/* Top Header Card */}
          <Paper className={classes.card} elevation={0}>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar className={classes.headerAvatar}>
                {profileDetails.name ? profileDetails.name.charAt(0).toUpperCase() : <PersonIcon />}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5" style={{ fontWeight: 800, color: "#0f172a" }}>
                  {profileDetails.name || "Candidate Profile"}
                </Typography>
                <Typography variant="body2" style={{ color: "#64748b", marginTop: "4px" }}>
                  Early-Career Candidate • InternBridge Verified Hub
                </Typography>
              </Box>
              <Button
                variant="contained"
                className={classes.primaryBtn}
                startIcon={<SaveIcon />}
                onClick={handleUpdate}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>

          {/* Basic Details */}
          <Paper className={classes.card} elevation={0}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <PersonIcon style={{ color: "#2563eb" }} /> Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={profileDetails.name}
                  onChange={(e) =>
                    setProfileDetails({ ...profileDetails, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Resume / Portfolio Link (Google Drive / GitHub)"
                  variant="outlined"
                  fullWidth
                  value={profileDetails.resume}
                  onChange={(e) =>
                    setProfileDetails({ ...profileDetails, resume: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Education Timeline */}
          <Paper className={classes.card} elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" className={classes.sectionTitle} style={{ marginBottom: 0 }}>
                <SchoolIcon style={{ color: "#10b981" }} /> Education & Qualifications
              </Typography>
              <Button
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddEducation}
                style={{ fontWeight: 700, textTransform: "none", color: "#10b981" }}
              >
                Add Institution
              </Button>
            </Box>
            <Divider style={{ marginBottom: "20px" }} />

            {profileDetails.education.map((edu, idx) => (
              <Grid container spacing={2} key={idx} style={{ marginBottom: "16px" }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Institution #${idx + 1}`}
                    variant="outlined"
                    fullWidth
                    value={edu.institutionName}
                    onChange={(e) =>
                      handleEducationChange(idx, "institutionName", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Start Year"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={edu.startYear}
                    onChange={(e) =>
                      handleEducationChange(idx, "startYear", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="End Year"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={edu.endYear}
                    onChange={(e) =>
                      handleEducationChange(idx, "endYear", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            ))}
          </Paper>

          {/* Skills Hub */}
          <Paper className={classes.card} elevation={0}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <WorkIcon style={{ color: "#f59e0b" }} /> Core Skillsets & Disciplines
            </Typography>
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
              <TextField
                label="Add Skill (e.g., Python, Strategy, SQL, Financial Modeling)"
                variant="outlined"
                size="small"
                style={{ flex: 1, minWidth: "240px" }}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                style={{
                  backgroundColor: "#0f172a",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "10px",
                }}
              >
                Add
              </Button>
            </Box>

            <Box display="flex" flexWrap="wrap" mt={2}>
              {profileDetails.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                  className={classes.chipSkill}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;