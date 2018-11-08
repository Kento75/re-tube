import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const ResultDialog = ({ open, message, handleCloseDialog }) => (
  <Dialog
    open={open}
    onClose={handleCloseDialog}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
      { message }
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog} color="primary" autoFocus>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResultDialog;