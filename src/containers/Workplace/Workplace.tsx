import React, { useState } from 'react';

import { connect } from 'react-redux';

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
import Columns from './Columns';
import ColumnFormModal from './ColumnFormModal';

import Board from '../../models/types/Board';
import ColumnDTO from '../../models/dto/ColumnDTO';

import * as actions from '../../store/actions';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            backgroundColor: 'transparent',
            height: '100%'
        },
        header: {
            padding: "30px 20px 20px 20px"
        },
        button: {
            marginRight: 10
        }
    })
);

interface IWorkplaceProps {
    createColumn: (arg1: ColumnDTO) => Promise<any>
}

const Workplace: React.FC<IWorkplaceProps> = props => {
    const classes = useStyles();

    const [openColumnFormModal, setOpenColumnFormModal] = useState(false);
    const [board, setBoard] = useState<Board>();

    const handleBoardChange = (board: Board) => {
        setBoard(board);
    }

    const handleSumbitColumn = (data: any): [Promise<any>, () => void, () => void] => {
        return [
            props.createColumn({
                name: data.name,
                boardID: board?.id,
                hostID: "1"
            } as ColumnDTO),
            () => {
                setOpenColumnFormModal(false)
            },
            () => {
                console.log("failed?");
            }
        ];
    }

    const handleCancelCreateColumn = () => {
        setOpenColumnFormModal(false);
    }

    return (
        <Auxi>
            <ApplicationBar
                title="Workplace"
                component={<BoardSelector handleChange={handleBoardChange} />}
            />

            <ColumnFormModal
                open={openColumnFormModal}
                handleSubmit={handleSumbitColumn}
                handleCancel={handleCancelCreateColumn}
            />

            {
                board
                ? <Paper elevation={0} className={classes.root}>
                    <Grid container direction="row" className={classes.header}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            startIcon={<AddIcon />}
                            color="primary"
                            onClick={() => setOpenColumnFormModal(true)}
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
                    <Columns
                        boardID={board.id}
                    />
                </Paper>
                : null
            }
        </Auxi>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        createColumn: (dto: ColumnDTO) => dispatch(actions.createColumn(dto))
    }
}

export default connect(null, mapDispatchToProps)(Workplace);