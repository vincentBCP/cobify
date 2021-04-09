import React, { useState } from 'react';

import {makeStyles, createStyles, Theme} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import './Workplace.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';

import BoardSelector from './BoardSelector';
import GuestList from './GuestList';

import Board from '../../models/types/Board';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0,
            padding: '30px 25px',
            backgroundColor: 'transparent'
        },
        button: {
            marginRight: 10
        }
    })
);

const Workplace: React.FC = props => {
    const classes = useStyles();

    const [board, setBoard] = useState<Board>();

    const handleBoardChange = (board: Board) => {
        setBoard(board);
    }

    return (
        <Auxi>
            <ApplicationBar
                title="Workplace"
                component={<BoardSelector handleChange={handleBoardChange} />}
            />
            {
                board
                ? <Paper elevation={0} className={classes.root}>
                    <Grid container direction="row">
                        <Button
                            variant="contained"
                            className={classes.button}
                            startIcon={<AddIcon />}
                            color="primary"
                        >Column</Button>
                        <Button
                            variant="contained" 
                            className={classes.button}
                            startIcon={<AddIcon />}
                            color="primary"
                        >Task</Button>
                        <span style={{flexGrow: 1}}></span>
                        <GuestList
                            boardID={board?.id}
                        />
                    </Grid>
                    
                </Paper>
                : null
            }
        </Auxi>
    );
};

export default Workplace;