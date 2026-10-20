import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles(() => ({
  body: {
    height: "inherit",
  },
  paper: {
    padding: "30px",
    borderRadius: "20px",
    outline: "none",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  submitBtn: {
    borderRadius: "12px",
    padding: "12px",
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#fff",
    "&:hover": { background: "#2563eb" },
  },
}));

const CreateJobs = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    domainCategory: "management",
    location: "Flexible / Remote",
    maxApplicants: 100,
    maxPositions: 5,
    deadline: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 3,
    salary: 35000,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    if (jobDetails.title.trim() === "") {
      setPopup({
        open: true,
        severity: "error",
        message: "Job title is mandatory.",
      });
      return;
    }

    axios
      .post(apiList.jobs, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message || "Internship posted successfully!",
        });
        setJobDetails({
          title: "",
          company: "",
          domainCategory: "management",
          location: "Flexible / Remote",
          maxApplicants: 100,
          maxPositions: 5,
          deadline: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 3,
          salary: 35000,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Failed to post internship.",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "40px 20px", minHeight: "93vh", backgroundColor: "#f8fafc" }}
    >
      <Grid item xs={12} md={8} style={{ width: "100%", maxWidth: "800px" }}>
        <Paper className={classes.paper}>
          <Typography variant="h4" style={{ fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            Post a New Opportunity
          </Typography>
          <Typography variant="body2" style={{ color: "#64748b", marginBottom: "25px" }}>
            Publish an internship listing directly to the InternBridge candidate feed.
          </Typography>

          <Grid container direction="column" alignItems="stretch" spacing={3}>
            <Grid item>
              <TextField
                label="Role Title"
                value={jobDetails.title}
                onChange={(event) => handleInput("title", event.target.value)}
                variant="outlined"
                fullWidth
                placeholder="e.g. Strategic Management Intern"
              />
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hiring Organization / Company"
                  value={jobDetails.company}
                  onChange={(event) => handleInput("company", event.target.value)}
                  variant="outlined"
                  fullWidth
                  placeholder="e.g. KPMG Advisory Practice"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Specialized Domain Track"
                  variant="outlined"
                  value={jobDetails.domainCategory}
                  onChange={(event) => handleInput("domainCategory", event.target.value)}
                  fullWidth
                >
                  <MenuItem value="management">📊 Strategy & Management Consulting</MenuItem>
                  <MenuItem value="tech_consulting">⚡ Tech Strategy & Digital</MenuItem>
                  <MenuItem value="ma_strategy">💼 Corporate Strategy & M&A</MenuItem>
                  <MenuItem value="analytics_consulting">📈 Analytics & Insights</MenuItem>
                  <MenuItem value="tech">💻 Tech & AI Engineering</MenuItem>
                  <MenuItem value="finance">📈 Quant & Investment Banking</MenuItem>
                  <MenuItem value="design">🎨 Product & UI/UX</MenuItem>
                  <MenuItem value="operations">⚡ Operations & Growth</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid item>
              <ChipInput
                label="Required Skills / Keywords (Press Enter)"
                variant="outlined"
                helperText="Type skill and press Enter (e.g. Market Entry, SQL, Python)"
                value={jobDetails.skillsets}
                onAdd={(chip) =>
                  setJobDetails({
                    ...jobDetails,
                    skillsets: [...jobDetails.skillsets, chip],
                  })
                }
                onDelete={(_chip, index) => {
                  let commonSkills = [...jobDetails.skillsets];
                  commonSkills.splice(index, 1);
                  setJobDetails({
                    ...jobDetails,
                    skillsets: commonSkills,
                  });
                }}
                fullWidth
              />
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Work Format"
                  variant="outlined"
                  value={jobDetails.jobType}
                  onChange={(event) => handleInput("jobType", event.target.value)}
                  fullWidth
                >
                  <MenuItem value="Full Time">Full Time</MenuItem>
                  <MenuItem value="Part Time">Part Time</MenuItem>
                  <MenuItem value="Remote">Work From Home / Remote</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Duration (Months)"
                  type="number"
                  variant="outlined"
                  value={jobDetails.duration}
                  onChange={(event) => handleInput("duration", parseInt(event.target.value) || 0)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Monthly Stipend (₹)"
                  type="number"
                  variant="outlined"
                  value={jobDetails.salary}
                  onChange={(event) => handleInput("salary", parseInt(event.target.value) || 0)}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Application Deadline"
                  type="datetime-local"
                  value={jobDetails.deadline}
                  onChange={(event) => handleInput("deadline", event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  value={jobDetails.location}
                  onChange={(event) => handleInput("location", event.target.value)}
                  variant="outlined"
                  fullWidth
                  placeholder="e.g. Gurugram / Remote"
                />
              </Grid>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                fullWidth
                className={classes.submitBtn}
                onClick={handleUpdate}
              >
                Publish Opportunity
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;