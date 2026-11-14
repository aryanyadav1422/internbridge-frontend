import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    history.push(location);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          className={classes.title}
          style={{ cursor: "pointer", fontWeight: 700, letterSpacing: "0.5px" }}
          onClick={() => handleClick("/")}
        >
          Intern<span style={{ color: "#4caf50" }}>Bridge</span>
        </Typography>
        <Button color="inherit" onClick={() => handleClick("/")}>
          Explore Internships
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
