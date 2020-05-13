import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


export default class NavBar extends React.Component {

    render() {
        return (
            <AppBar className="blue-dark-bg" position="sticky" >
                <Toolbar align="center">
                    <Typography variant="h5"  > Ensemble Energy </Typography>
                </Toolbar>
            </AppBar>
        );
    }
};


