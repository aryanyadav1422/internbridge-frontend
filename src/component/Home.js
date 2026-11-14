import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
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

import { server } from "../lib/apiList";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    paddingBottom: "80px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    width: "100%",
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
  emptyStateBox: {
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px dashed #cbd5e1",
    marginTop: "20px",
  },
}));
const JobTile = ({ job }) => {
  const classes = useStyles();

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

  const targetUrl =
    job.applyUrl ||
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      `${job.title || ""} ${job.company || ""}`.trim()
    )}`;

  return (
    <Paper className={classes.jobCard} elevation={0}>
      <Grid container spacing={2} alignItems="center">
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

                {job.featured && (
                  <Chip
                    icon={<FlashOnIcon style={{ color: "#f59e0b", fontSize: "0.95rem" }} />}
                    label="Verified India Feed"
                    size="small"
                    style={{ backgroundColor: "#fef3c7", color: "#92400e", fontWeight: 700, height: 22 }}
                  />
                )}

                <Chip
                  label="Live API Posting"
                  size="small"
                  style={{ backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: 700, height: 22 }}
                />
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={0.5} mb={1.5}>
                <Typography variant="subtitle2" style={{ color: "#475569", fontWeight: 600 }}>
                  {job.recruiter?.name || job.company || "Enterprise Partner"}
                </Typography>
                <CheckCircleIcon style={{ color: "#10b981", fontSize: "1rem" }} />
              </Box>

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

              <Box display="flex" flexWrap="wrap">
                {job.skillsets?.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" className={classes.tagChip} />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} style={{ textAlign: "right" }}>
          <Box display="flex" flexDirection="column" alignItems={{ xs: "flex-start", md: "flex-end" }} gap={1.5}>
            <Typography variant="caption" style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.82rem" }}>
              ⏳ {formatDeadline(job.deadline)}
            </Typography>
            <Button
              variant="contained"
              className={classes.applyButtonPrimary}
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply on Posting ↗
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const Home = () => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const applyClientFilters = useCallback(
    (list) => {
      let filtered = [...list];
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title?.toLowerCase().includes(q) ||
            j.company?.toLowerCase().includes(q) ||
            j.location?.toLowerCase().includes(q) ||
            j.skillsets?.some((s) => s.toLowerCase().includes(q))
        );
      }
      return filtered;
    },
    [searchQuery]
  );

  const getData = useCallback(async () => {
    setLoading(true);

    try {
      // Primary: Live multi-source aggregator on Render (Adzuna India + Remotive + Arbeitnow)
      const backendRes = await axios.get(
        `${server}/api/jobs/external?category=${encodeURIComponent(categoryFilter)}`,
        { timeout: 12000 }
      );

      if (Array.isArray(backendRes.data) && backendRes.data.length > 0) {
        setJobs(applyClientFilters(backendRes.data));
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Primary backend waking up, falling back to direct live feeds:", err.message);
    }

    // Fallback: Direct live API calls if Render cold-start takes >12s
    try {
      const [remotiveRes, arbeitnowRes] = await Promise.allSettled([
        axios.get("https://remotive.com/api/remote-jobs?limit=25", { timeout: 8000 }),
        axios.get("https://www.arbeitnow.com/api/job-board-api", { timeout: 8000 }),
      ]);

      let fallbackJobs = [];

      if (remotiveRes.status === "fulfilled" && Array.isArray(remotiveRes.value.data?.jobs)) {
        fallbackJobs.push(
          ...remotiveRes.value.data.jobs.map((job) => ({
            _id: `ext_rem_${job.id}`,
            title: job.title,
            company: job.company_name,
            domainCategory: "management",
            location: job.candidate_required_location || "Worldwide (Remote)",
            jobType: job.job_type === "full_time" ? "Full Time" : "Internship / Contract",
            salary: job.salary || 45000,
            duration: 3,
            deadline: "Active Opportunity",
            skillsets:
              Array.isArray(job.tags) && job.tags.length > 0
                ? job.tags.slice(0, 4)
                : ["Strategy", "Analytics", "Operations"],
            isExternal: true,
            applyUrl: job.url,
            avatarColor: "#0f766e",
            featured: false,
          }))
        );
      }

      if (arbeitnowRes.status === "fulfilled" && Array.isArray(arbeitnowRes.value.data?.data)) {
        fallbackJobs.push(
          ...arbeitnowRes.value.data.data.slice(0, 20).map((job, idx) => ({
            _id: `ext_arb_${idx}`,
            title: job.title,
            company: job.company_name,
            domainCategory: "management",
            location: job.location || "Remote / Global",
            salary: 50000,
            duration: 6,
            jobType: job.remote ? "Remote" : "Hybrid",
            deadline: "Active Opportunity",
            skillsets:
              Array.isArray(job.tags) && job.tags.length > 0
                ? job.tags.slice(0, 4)
                : ["Management", "Consulting", "Strategy"],
            applyUrl: job.url,
            isExternal: true,
            avatarColor: "#1d4ed8",
            featured: false,
          }))
        );
      }

      if (categoryFilter !== "all") {
        fallbackJobs = fallbackJobs.filter((j) => {
          const text = `${j.title} ${(j.skillsets || []).join(" ")}`.toLowerCase();
          if (categoryFilter === "management") return /consulting|strategy|management|advisory|analyst|business|operations|growth/i.test(text);
          if (categoryFilter === "tech_consulting") return /tech|digital|architecture|systems|cloud|solutions|enterprise/i.test(text);
          if (categoryFilter === "ma_strategy") return /m&a|due diligence|corporate|strategy|valuation/i.test(text);
          if (categoryFilter === "analytics_consulting") return /analytics|data|insights|bi|sql|tableau/i.test(text);
          if (categoryFilter === "tech") return /developer|software|data|python|engineer|ai|ml|cloud|react|node/i.test(text);
          if (categoryFilter === "finance") return /finance|quant|investment|banking|portfolio|accounting/i.test(text);
          if (categoryFilter === "design") return /design|ui|ux|figma|product/i.test(text);
          if (categoryFilter === "operations") return /operations|growth|supply chain|logistics/i.test(text);
          return true;
        });
      }

      setJobs(applyClientFilters(fallbackJobs));
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, applyClientFilters]);

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
      <Box className={classes.heroBanner}>
        <Typography variant="h3" style={{ fontWeight: 900, letterSpacing: "-0.8px" }}>
          Intern<span style={{ color: "#10b981" }}>Bridge</span>
        </Typography>
        <Typography variant="body1" className={classes.heroTagline}>
          Real-time internship & early-career aggregator pulling live openings directly from Adzuna India, Remotive, and Arbeitnow.
        </Typography>

        <Box className={classes.searchWrapper}>
          <SearchIcon style={{ color: "#64748b", marginRight: "12px", fontSize: "1.4rem" }} />
          <TextField
            placeholder="Search roles, companies, locations, or skills..."
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

      <Grid container justify="center">
        <Grid item xs={11} md={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Typography variant="h6" style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
              Live API Opportunities ({jobs.length})
            </Typography>
            <Typography variant="body2" style={{ color: "#64748b", fontWeight: 500 }}>
              Direct Source Links Enabled
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress style={{ color: "#10b981" }} />
            </Box>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobTile key={job._id} job={job} />)
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
