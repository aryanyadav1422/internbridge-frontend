/* eslint-disable */
import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Avatar,
  Box,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PersonIcon from "@material-ui/icons/Person";
import SchoolIcon from "@material-ui/icons/School";
import WorkIcon from "@material-ui/icons/Work";
import StarIcon from "@material-ui/icons/Star";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles(() => ({
  body: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 20px 80px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    padding: "28px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
    marginBottom: "20px",
  },
  headerCard: {
    padding: "32px",
    borderRadius: "24px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    marginBottom: "32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#10b981",
    fontWeight: 800,
    fontSize: "1.4rem",
    color: "#ffffff",
  },
  skillChip: {
    margin: "3px",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    fontWeight: 600,
    fontSize: "0.8rem",
    border: "1px solid #bbf7d0",
  },
  actionBtn: {
    borderRadius: "10px",
    fontWeight: 700,
    textTransform: "none",
    padding: "8px 18px",
  },
}));

const AcceptedApplicants = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);

  const getData = useCallback(() => {
    axios
      .get(apiList.applicants, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const acceptedOnly = response.data.filter((app) => app.status === "accepted");
        setAcceptedCandidates(acceptedOnly);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching accepted applicants",
        });
      });
  }, [setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Box className={classes.body}>
      <Grid container justify="center">
        <Grid item xs={11} md={9}>
          <Paper className={classes.headerCard} elevation={0}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <CheckCircleIcon style={{ color: "#10b981", fontSize: "2rem" }} />
              <Typography variant="h4" style={{ fontWeight: 800 }}>
                Accepted Talent Cohort
              </Typography>
            </Box>
            <Typography variant="body1" style={{ color: "#94a3b8", marginTop: "8px" }}>
              Roster of verified interns and candidates onboarded across your direct listings.
            </Typography>
          </Paper>

          {acceptedCandidates.length > 0 ? (
            acceptedCandidates.map((app) => {
              const applicant = app.jobApplicant || {};
              const job = app.jobId || {};

              return (
                <Paper key={app._id} className={classes.card} elevation={0}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Box display="flex" alignItems="center" gap={2.5}>
                        <Avatar className={classes.avatar}>
                          {applicant.name ? applicant.name.charAt(0).toUpperCase() : <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" style={{ fontWeight: 800, color: "#0f172a" }}>
                            {applicant.name || "Candidate"}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <WorkIcon fontSize="small" style={{ color: "#2563eb" }} />
                            <Typography variant="body2" style={{ color: "#2563eb", fontWeight: 700 }}>
                              {job.title || "Direct Opportunity"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {applicant.education && applicant.education.length > 0 && (
                        <Box display="flex" alignItems="center" gap={1} mt={2}>
                          <SchoolIcon fontSize="small" style={{ color: "#64748b" }} />
                          <Typography variant="body2" style={{ color: "#334155", fontWeight: 600 }}>
                            {applicant.education[0].institutionName} (
                            {applicant.education[0].startYear || "N/A"} - {applicant.education[0].endYear || "N/A"})
                          </Typography>
                        </Box>
                      )}

                      {applicant.skills && applicant.skills.length > 0 && (
                        <Box display="flex" flexWrap="wrap" mt={1.5}>
                          {applicant.skills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" className={classes.skillChip} />
                          ))}
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems={{ xs: "flex-start", md: "flex-end" }}
                        gap={1.5}
                      >
                        <Chip
                          label="ONBOARDED"
                          style={{
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            fontWeight: 800,
                            padding: "4px 8px",
                          }}
                        />
                        <Typography variant="caption" style={{ color: "#64748b" }}>
                          Joined on: {new Date(app.dateOfJoining || app.dateOfApplication).toLocaleDateString()}
                        </Typography>

                        {applicant.resume && (
                          <Button
                            variant="outlined"
                            size="small"
                            href={applicant.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.actionBtn}
                            style={{ borderColor: "#0f172a", color: "#0f172a", marginTop: "8px" }}
                          >
                            View Candidate Resume ↗
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })
          ) : (
            <Paper className={classes.card} elevation={0} style={{ textAlign: "center", padding: "60px 20px" }}>
              <StarIcon style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "8px" }} />
              <Typography variant="h6" style={{ color: "#334155", fontWeight: 700 }}>
                No accepted candidates yet
              </Typography>
              <Typography variant="body2" style={{ color: "#64748b", marginTop: "4px" }}>
                Accepted applicants from your application pipeline will automatically populate here.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcceptedApplicants;