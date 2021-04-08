import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Avatar from '../../../widgets/Avatar';

import Board from '../../../models/types/Board';

import Aux from '../../../hoc/Auxi';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            height: 42,
            minWidth: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left'
        },
        list: {
            minWidth: 250
        }
    })
);

const BoardSelector: React.FC = props => {
    const classes = useStyles();

    const [selectedBoard, setSelectedBoard] = useState<Board | null>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const boards: Board[] = useSelector((state: any) => state.board.boards);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleSelect = (board: Board) => {
        setSelectedBoard(board);
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    
    return (
        <Aux>
            <Button
                variant="outlined"
                color="default"
                onClick={handleClick}
                className={classes.button}
                startIcon={
                    selectedBoard
                    ? <Avatar
                        firstName={selectedBoard.name}
                        lastName=""
                        color={selectedBoard.color}
                        size={30}
                    />
                    : null
                }
            >
                <Typography>
                    { selectedBoard ? selectedBoard.name : 'Select Board' }
                </Typography>
            </Button>

            <Popover
                id="board-selector-popup"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List className={classes.list}>
                    {
                        boards.map(board =>
                            <ListItem
                                button
                                key={board.id}
                                selected={(selectedBoard || {}).id === board.id}
                                onClick={() => { handleSelect(board) }}
                            >
                                <ListItemIcon>
                                    <Avatar
                                        firstName={board.name}
                                        lastName=""
                                        color={board.color}
                                        size={30}
                                    />
                                </ListItemIcon>

                                <Typography>{board.name}</Typography>
                            </ListItem>    
                        )
                    }
                </List>
            </Popover>
        </Aux>
    )
};

export default BoardSelector;