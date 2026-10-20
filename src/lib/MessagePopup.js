import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const MessagePopup = (props) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={props.severity}
        elevation={6}
        variant="filled"
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;