import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

class TopNav extends Component {
  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static" color="white" style={{ borderBottom: '4px solid #feb70d' }}>
          <Toolbar>
            <Typography variant="title" color="inherit" style={{ fontSize: '2em' }}>
              <strong>Improve Detroit</strong>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default TopNav;
