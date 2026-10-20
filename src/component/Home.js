import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Box,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import ScheduleOutlinedIcon from "@material-ui/icons/ScheduleOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import StarsIcon from "@material-ui/icons/Stars";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    paddingBottom: "80px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  heroBanner: {
    width: "100%",
    background: "radial-gradient(circle at 10% 20%, rgb(18, 24, 38) 0%, rgb(10, 14, 26) 90.2%)",
    color: "#ffffff",
    padding: "70px 24px 50px 24px",
    borderRadius: "0 0 32px 32px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
    marginBottom: "40px",
    position: "relative",
    overflow: "hidden",
  },
  heroTagline: {
    color: "#94a3b8",
    fontSize: "1.1rem",
    marginTop: "12px",
    maxWidth: "650px",
    margin: "12px auto 0 auto",
    lineHeight: 1.6,
  },
  searchWrapper: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    borderRadius: "60px",
    padding: "8px 16px 8px 24px",
    display: "flex",
    alignItems: "center",
    maxWidth: "720px",
    margin: "35px auto 15px auto",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  searchInput: {
    flex: 1,
    "& .MuiInput-underline:before": { borderBottom: "none" },
    "& .MuiInput-underline:after": { borderBottom: "none" },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
    "& input": { fontSize: "1rem", color: "#1e293b" },
  },
  searchBtn: {
    borderRadius: "30px",
    padding: "10px 28px",
    fontWeight: 700,
    textTransform: "none",
    fontSize: "0.95rem",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    },
  },
  domainPillActive: {
    backgroundColor: "#10b981 !important",
    color: "#ffffff !important",
    fontWeight: 700,
    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
    transform: "scale(1.04)",
    transition: "all 0.2s ease-in-out",
  },
  domainPillInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.08) !important",
    color: "#cbd5e1 !important",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    fontWeight: 500,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.16) !important",
      color: "#fff !important",
    },
  },
  jobCard: {
    padding: "24px 28px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    marginBottom: "20px",
    position: "relative",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
      borderColor: "#3b82f6",
    },
  },
  companyAvatar: {
    width: 52,
    height: 52,
    borderRadius: "14px",
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#ffffff",
    backgroundColor: "#1e293b",
  },
  tagChip: {
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontWeight: 600,
    fontSize: "0.78rem",
    marginRight: "6px",
    marginBottom: "6px",
    border: "1px solid #e2e8f0",
  },
  salaryBadge: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
    padding: "6px 12px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "0.9rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  applyButtonPrimary: {
    borderRadius: "12px",
    padding: "10px 24px",
    fontWeight: 700,
    textTransform: "none",
    fontSize: "0.95rem",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
    "&:hover": {
      background: "#2563eb",
      boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
    },
  },
  modalBox: {
    padding: "36px",
    outline: "none",
    width: "90%",
    maxWidth: "540px",
    borderRadius: "24px",
    backgroundColor: "#ffffff",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  emptyStateBox: {
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px dashed #cbd5e1",
    marginTop: "20px",
  },
}));

// Skill match calculation algorithm
const calculateSkillMatch = (userSkills = [], jobSkills = []) => {
  if (!userSkills || userSkills.length === 0 || !jobSkills || jobSkills.length === 0) {
    return 0;
  }

  const normalizedUserSkills = userSkills.map((s) => s.trim().toLowerCase());
  const normalizedJobSkills = jobSkills.map((s) => s.trim().toLowerCase());

  let matchCount = 0;
  normalizedJobSkills.forEach((jobSkill) => {
    const isMatched = normalizedUserSkills.some(
      (userSkill) =>
        userSkill.includes(jobSkill) ||
        jobSkill.includes(userSkill) ||
        userSkill === jobSkill
    );
    if (isMatched) matchCount++;
  });

  const percentage = Math.round((matchCount / normalizedJobSkills.length) * 100);
  return Math.min(percentage, 100);
};

const JobTile = ({ job, userSkills }) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleApply = () => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        { sop },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setPopup({ open: true, severity: "success", message: "Application submitted successfully!" });
        setOpen(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Failed to submit application.",
        });
        setOpen(false);
      });
  };

  const getCompanyInitials = (name) => {
    if (!name) return "IB";
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDeadline = (dl) => {
    if (!dl) return "Active Opportunity";
    if (typeof dl === "string") {
      if (dl.includes("Active") || dl.includes("Closing") || dl.includes("Source")) {
        return dl;
      }
      const parsedDate = new Date(dl);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return dl;
    }
    const d = new Date(dl);
    return !isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Active Opportunity";
  };

  // Compute matching score for applicants
  const matchScore = calculateSkillMatch(userSkills, job.skillsets);

  let matchBg = "#f1f5f9";
  let matchColor = "#64748b";
  if (matchScore >= 60) {
    matchBg = "#d1fae5";
    matchColor = "#065f46";
  } else if (matchScore >= 30) {
    matchBg = "#fef3c7";
    matchColor = "#92400e";
  }

  return (
    <Paper className={classes.jobCard} elevation={0}>
      <Grid container spacing={2} alignItems="center">
        {/* Left: Avatar & Information */}
        <Grid item xs={12} md={8}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar
              className={classes.companyAvatar}
              style={{ backgroundColor: job.avatarColor || "#1e293b" }}
            >
              {getCompanyInitials(job.recruiter?.name || job.company)}
            </Avatar>

            <Box flex={1}>
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="h6" style={{ fontWeight: 700, color: "#0f172a", fontSize: "1.15rem" }}>
                  {job.title}
                </Typography>

                {userType() === "applicant" && job.skillsets && job.skillsets.length > 0 && (
                  <Chip
                    icon={<StarsIcon style={{ color: matchColor, fontSize: "0.95rem" }} />}
                    label={`${matchScore}% Match`}
                    size="small"
                    style={{
                      backgroundColor: matchBg,
                      color: matchColor,
                      fontWeight: 800,
                      height: 22,
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {job.featured && (
                  <Chip
                    icon={<FlashOnIcon style={{ color: "#f59e0b", fontSize: "0.95rem" }} />}
                    label="Featured"
                    size="small"
                    style={{ backgroundColor: "#fef3c7", color: "#92400e", fontWeight: 700, height: 22 }}
                  />
                )}

                {job.isExternal && (
                  <Chip
                    label="Live Web Feed"
                    size="small"
                    style={{ backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: 700, height: 22 }}
                  />
                )}
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={0.5} mb={1.5}>
                <Typography variant="subtitle2" style={{ color: "#475569", fontWeight: 600 }}>
                  {job.recruiter?.name || job.company || "Direct Partner"}
                </Typography>
                <CheckCircleIcon style={{ color: "#10b981", fontSize: "1rem" }} />
              </Box>

              {/* Badges Metadata */}
              <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={1.5}>
                <Box className={classes.salaryBadge}>
                  <MonetizationOnOutlinedIcon fontSize="small" />
                  {typeof job.salary === "number"
                    ? `₹ ${job.salary.toLocaleString()} / mo`
                    : job.salary || "Competitive Stipend"}
                </Box>
                <Typography variant="body2" style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <LocationOnOutlinedIcon fontSize="small" />
                  {job.location || "Remote / Global"}
                </Typography>
                <Typography variant="body2" style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ScheduleOutlinedIcon fontSize="small" />
                  {job.duration ? `${job.duration} Months` : job.jobType || "Full Time"}
                </Typography>
              </Box>

              {/* Skills Tags */}
              <Box display="flex" flexWrap="wrap">
                {job.skillsets?.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" className={classes.tagChip} />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right: Actions */}
        <Grid item xs={12} md={4} style={{ textAlign: "right" }}>
          <Box display="flex" flexDirection="column" alignItems={{ xs: "flex-start", md: "flex-end" }} gap={1.5}>
            <Typography variant="caption" style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.82rem" }}>
              ⏳ {formatDeadline(job.deadline)}
            </Typography>
            {job.isExternal ? (
              <Button
                variant="contained"
                className={classes.applyButtonPrimary}
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply on Source ↗
              </Button>
            ) : (
              <Button
                variant="contained"
                className={classes.applyButtonPrimary}
                onClick={() => setOpen(true)}
                disabled={userType() === "recruiter"}
              >
                Easy Apply Now
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Application Modal */}
      <Modal open={open} onClose={() => setOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper className={classes.modalBox}>
          <Typography variant="h5" style={{ fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
            Submit Application
          </Typography>
          <Typography variant="body2" style={{ color: "#64748b", marginBottom: "20px" }}>
            Applying for <strong>{job.title}</strong> at {job.recruiter?.name || job.company}.
          </Typography>
          <TextField
            label="Statement of Purpose / Why are you a great fit?"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            value={sop}
            onChange={(e) => setSop(e.target.value)}
            style={{ marginBottom: "24px" }}
          />
          <Box display="flex" justifyContent="flex-end" gap={1.5}>
            <Button onClick={() => setOpen(false)} style={{ textTransform: "none", fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant="contained" className={classes.applyButtonPrimary} onClick={handleApply}>
              Confirm & Submit
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Home = () => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userSkills, setUserSkills] = useState([]);

  // Fetch logged-in user's profile skills for matching calculations
  useEffect(() => {
    if (userType() === "applicant") {
      axios
        .get(apiList.user, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          if (res.data?.skills) {
            setUserSkills(res.data.skills);
          }
        })
        .catch(() => setUserSkills([]));
    }
  }, []);

  const getData = useCallback(() => {
    setLoading(true);

    const internalReq = axios.get(apiList.jobs, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const externalReq = axios.get(`${apiList.externalJobs}?category=${categoryFilter}`);

    Promise.allSettled([internalReq, externalReq])
      .then((results) => {
        const dbJobs =
          results[0].status === "fulfilled" && Array.isArray(results[0].value.data)
            ? results[0].value.data
            : [];

        const liveExtJobs =
          results[1].status === "fulfilled" && Array.isArray(results[1].value.data)
            ? results[1].value.data
            : [];

        let combined = [...dbJobs, ...liveExtJobs];

        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          combined = combined.filter(
            (j) =>
              j.title?.toLowerCase().includes(q) ||
              j.skillsets?.some((s) => s.toLowerCase().includes(q))
          );
        }

        if (categoryFilter !== "all") {
          combined = combined.filter(
            (j) =>
              j.category === categoryFilter ||
              j.domainCategory === categoryFilter ||
              (categoryFilter === "management" &&
                /consulting|strategy|management|advisory|analyst|business|mba|operations|growth/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "tech_consulting" &&
                /tech consulting|digital transformation|architecture|systems/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "ma_strategy" &&
                /m&a|due diligence|corporate strategy/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "analytics_consulting" &&
                /analytics|decision science|insights|data/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "tech" &&
                /developer|software|data|python|engineer|ai|ml|tech|cloud/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "finance" &&
                /finance|quant|investment|banking|portfolio/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "design" &&
                /design|ui|ux|figma|product design/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                )) ||
              (categoryFilter === "operations" &&
                /operations|growth|supply chain|logistics/i.test(
                  (j.title || "") + " " + (j.skillsets || []).join(" ")
                ))
          );
        }

        setJobs(combined);
        setLoading(false);
      })
      .catch(() => {
        setJobs([]);
        setLoading(false);
      });
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    getData();
  }, [getData]);

  const domainCategories = [
    { id: "all", label: "🌟 All Disciplines" },
    { id: "management", label: "📊 Strategy & Consulting" },
    { id: "tech_consulting", label: "⚡ Tech Strategy & Digital" },
    { id: "ma_strategy", label: "💼 Corporate Strategy & M&A" },
    { id: "analytics_consulting", label: "📈 Analytics & Insights" },
    { id: "tech", label: "💻 Tech & AI Engineering" },
    { id: "finance", label: "📈 Quant & Investment Banking" },
    { id: "design", label: "🎨 Product & UI/UX" },
    { id: "operations", label: "⚡ Operations & Growth" },
  ];

  return (
    <Box className={classes.root}>
      {/* Hero Header */}
      <Box className={classes.heroBanner}>
        <Typography variant="h3" style={{ fontWeight: 900, letterSpacing: "-0.8px" }}>
          Intern<span style={{ color: "#10b981" }}>Bridge</span>
        </Typography>
        <Typography variant="body1" className={classes.heroTagline}>
          The curated early-career portal connecting ambitious talent with top-tier internships in Technology, Consulting, and Strategy.
        </Typography>

        {/* Search Bar */}
        <Box className={classes.searchWrapper}>
          <SearchIcon style={{ color: "#64748b", marginRight: "12px", fontSize: "1.4rem" }} />
          <TextField
            placeholder="Search roles, required skills (e.g. Python, Consulting, ML)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && getData()}
            className={classes.searchInput}
            InputProps={{ disableUnderline: true }}
          />
          <Button variant="contained" className={classes.searchBtn} onClick={getData}>
            Explore
          </Button>
        </Box>

        {/* Domain Filter Pills */}
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={3}>
          {domainCategories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              clickable
              className={categoryFilter === cat.id ? classes.domainPillActive : classes.domainPillInactive}
              onClick={() => setCategoryFilter(cat.id)}
              style={{ margin: "4px" }}
            />
          ))}
        </Box>
      </Box>

      {/* Main Listings */}
      <Grid container justify="center">
        <Grid item xs={11} md={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Typography variant="h6" style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
              Active Opportunities ({jobs.length})
            </Typography>
            <Typography variant="body2" style={{ color: "#64748b", fontWeight: 500 }}>
              Live & Verified Listings
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress style={{ color: "#10b981" }} />
            </Box>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobTile key={job._id} job={job} userSkills={userSkills} />)
          ) : (
            <Paper className={classes.emptyStateBox} elevation={0}>
              <WorkOutlineIcon style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "12px" }} />
              <Typography variant="h6" style={{ fontWeight: 700, color: "#334155" }}>
                No active openings found
              </Typography>
              <Typography variant="body2" style={{ color: "#64748b", marginTop: "4px" }}>
                Try switching the discipline category or clear your search terms.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;