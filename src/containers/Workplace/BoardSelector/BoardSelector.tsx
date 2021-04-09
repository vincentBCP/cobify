import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';
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

interface IBoardSelectorProps {
    handleChange: (arg1: Board) => void
}

const BoardSelector: React.FC<IBoardSelectorProps> = props => {
    const theme = useTheme();
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
        props.handleChange(board);
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
                        initials={selectedBoard.code}
                        color={selectedBoard.color}
                        size={30}
                    />
                    : <Avatar
                        initials="W"
                        color={theme.palette.primary.main}
                        size={30}
                    />
                }
            >
                <Typography>
                    { selectedBoard ? selectedBoard.name : 'Workplace' }
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
                                        initials={board.code}
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