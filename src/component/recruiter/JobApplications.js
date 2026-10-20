import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Modal,
  Avatar,
  Box,
  Divider,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import FilterListIcon from "@material-ui/icons/FilterList";
import DescriptionIcon from "@material-ui/icons/Description";
import PersonIcon from "@material-ui/icons/Person";
import SchoolIcon from "@material-ui/icons/School";

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
    padding: "24px 28px",
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
    width: 56,
    height: 56,
    backgroundColor: "#2563eb",
    fontWeight: 800,
    fontSize: "1.3rem",
  },
  skillChip: {
    margin: "3px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
    fontSize: "0.8rem",
  },
  statusChipApplied: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    fontWeight: 700,
  },
  statusChipShortlisted: {
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
    fontWeight: 700,
  },
  statusChipAccepted: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    fontWeight: 700,
  },
  statusChipRejected: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    fontWeight: 700,
  },
  actionBtn: {
    borderRadius: "10px",
    fontWeight: 700,
    textTransform: "none",
    padding: "8px 18px",
  },
  modalBox: {
    padding: "36px",
    borderRadius: "24px",
    backgroundColor: "#ffffff",
    width: "90%",
    maxWidth: "600px",
    outline: "none",
  },
}));

const ApplicationTile = ({ application, updateStatus }) => {
  const classes = useStyles();
  const [openSop, setOpenSop] = useState(false);

  const applicant = application.jobApplicant || {};
  const user = application.userId || {};

  const getStatusChipClass = (status) => {
    switch (status) {
      case "shortlisted":
        return classes.statusChipShortlisted;
      case "accepted":
        return classes.statusChipAccepted;
      case "rejected":
        return classes.statusChipRejected;
      default:
        return classes.statusChipApplied;
    }
  };

  return (
    <Paper className={classes.card} elevation={0}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={7}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar className={classes.avatar}>
              {applicant.name ? applicant.name.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" style={{ fontWeight: 800, color: "#0f172a" }}>
                  {applicant.name || user.name || "Candidate"}
                </Typography>
                <Chip
                  label={application.status.toUpperCase()}
                  size="small"
                  className={getStatusChipClass(application.status)}
                />
              </Box>
              <Typography variant="body2" style={{ color: "#64748b", marginTop: "2px" }}>
                Applied: {new Date(application.dateOfApplication).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Education Breakdown */}
          {applicant.education && applicant.education.length > 0 && (
            <Box display="flex" alignItems="center" gap={1} mt={2}>
              <SchoolIcon fontSize="small" style={{ color: "#64748b" }} />
              <Typography variant="body2" style={{ color: "#334155", fontWeight: 600 }}>
                {applicant.education[0].institutionName} (
                {applicant.education[0].startYear || "N/A"} - {applicant.education[0].endYear || "N/A"})
              </Typography>
            </Box>
          )}

          {/* Skills Breakdown */}
          {applicant.skills && applicant.skills.length > 0 && (
            <Box display="flex" flexWrap="wrap" mt={1.5}>
              {applicant.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} size="small" className={classes.skillChip} />
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Box display="flex" flexDirection="column" alignItems={{ xs: "flex-start", md: "flex-end" }} gap={1.5}>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DescriptionIcon />}
                onClick={() => setOpenSop(true)}
                className={classes.actionBtn}
              >
                View SOP
              </Button>
              {applicant.resume && (
                <Button
                  variant="outlined"
                  size="small"
                  href={applicant.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.actionBtn}
                  style={{ borderColor: "#2563eb", color: "#2563eb" }}
                >
                  Resume ↗
                </Button>
              )}
            </Box>

            {application.status === "applied" && (
              <Box display="flex" gap={1} mt={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => updateStatus(application._id, "shortlisted")}
                  className={classes.actionBtn}
                  style={{ backgroundColor: "#4338ca", color: "#fff" }}
                >
                  Shortlist
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => updateStatus(application._id, "rejected")}
                  className={classes.actionBtn}
                  style={{ backgroundColor: "#ef4444", color: "#fff" }}
                >
                  Reject
                </Button>
              </Box>
            )}

            {application.status === "shortlisted" && (
              <Box display="flex" gap={1} mt={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => updateStatus(application._id, "accepted")}
                  className={classes.actionBtn}
                  style={{ backgroundColor: "#10b981", color: "#fff" }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => updateStatus(application._id, "rejected")}
                  className={classes.actionBtn}
                  style={{ backgroundColor: "#ef4444", color: "#fff" }}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Statement of Purpose Modal */}
      <Modal
        open={openSop}
        onClose={() => setOpenSop(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper className={classes.modalBox}>
          <Typography variant="h5" style={{ fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            Candidate Statement of Purpose
          </Typography>
          <Typography variant="body2" style={{ color: "#64748b", marginBottom: "16px" }}>
            Submitted by {applicant.name || "Candidate"}
          </Typography>
          <Divider style={{ marginBottom: "16px" }} />
          <Typography variant="body1" style={{ color: "#334155", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {application.sop || "No specific Statement of Purpose provided with this application."}
          </Typography>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              onClick={() => setOpenSop(false)}
              className={classes.actionBtn}
              style={{ backgroundColor: "#0f172a", color: "#fff" }}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Paper>
  );
};

const JobApplications = () => {
  const classes = useStyles();
  const { jobId } = useParams();
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const getData = useCallback(() => {
    let address = `${apiList.applicants}?jobId=${jobId}`;
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching applications",
        });
      });
  }, [jobId, setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  const updateStatus = (id, status) => {
    axios
      .put(
        `${apiList.applications}/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message || `Application status set to ${status}`,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Failed to update status",
        });
      });
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  return (
    <Box className={classes.body}>
      <Grid container justify="center">
        <Grid item xs={11} md={9}>
          <Paper className={classes.headerCard} elevation={0}>
            <Typography variant="h4" style={{ fontWeight: 800 }}>
              Candidate Review Dashboard
            </Typography>
            <Typography variant="body1" style={{ color: "#94a3b8", marginTop: "6px" }}>
              Evaluate incoming talent, review Statements of Purpose, and manage hiring stages.
            </Typography>

            <Box display="flex" gap={1} mt={3} flexWrap="wrap">
              {["all", "applied", "shortlisted", "accepted", "rejected"].map((st) => (
                <Chip
                  key={st}
                  label={`${st.toUpperCase()} (${
                    st === "all" ? applications.length : applications.filter((a) => a.status === st).length
                  })`}
                  clickable
                  onClick={() => setFilterStatus(st)}
                  style={{
                    backgroundColor: filterStatus === st ? "#2563eb" : "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                />
              ))}
            </Box>
          </Paper>

          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ApplicationTile key={app._id} application={app} updateStatus={updateStatus} />
            ))
          ) : (
            <Paper className={classes.card} elevation={0} style={{ textAlign: "center", padding: "60px 20px" }}>
              <FilterListIcon style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "8px" }} />
              <Typography variant="h6" style={{ color: "#334155", fontWeight: 700 }}>
                No applications matching filter "{filterStatus.toUpperCase()}"
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobApplications;