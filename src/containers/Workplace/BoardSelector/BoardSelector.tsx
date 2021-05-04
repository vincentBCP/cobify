import React, { useEffect } from 'react';
import _ from 'lodash';

import { NavLink } from 'react-router-dom';

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Avatar from '../../../widgets/Avatar';

import Board from '../../../models/types/Board';
import User from '../../../models/types/User';

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
        },
        link: {
            display: "inline-block",
            color: 'inherit',
            width: '100%',
            textDecoration: 'none'
        }
    })
);

interface IBoardSelectorProps {
    board?: Board,
    boards: Board[]
}

const BoardSelector: React.FC<IBoardSelectorProps> = props => {
    const theme = useTheme();
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        setAnchorEl(null);
    }, [ props.board ]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    
    return (
        <React.Fragment>
            <Button
                variant="outlined"
                color="default"
                onClick={handleClick}
                className={classes.button}
                startIcon={
                    props.board
                    ? <Avatar
                        size={30}
                        account={{
                            color: props.board.color,
                            initials: props.board.code
                        } as User}
                    />
                    : <Avatar
                        size={30}
                        account={{
                            color: theme.palette.primary.main,
                            initials: "W"
                        } as User}
                    />
                }
            >
                <Typography>
                    { props.board ? props.board.name : 'Workplace' }
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
                        _.orderBy(props.boards, ["name"]).map(board =>
                            (props.board || {}).id === board.id
                            ? <ListItem
                                key={"board-selector-" + board.id}
                                selected={true}
                            >
                                <ListItemIcon>
                                    <Avatar
                                        size={30}
                                        account={{
                                            color: board.color,
                                            initials: board.code
                                        } as User}
                                    />
                                </ListItemIcon>

                                <Typography>{board.name}</Typography>
                            </ListItem>
                            : <NavLink
                                key={"board-selector-" + board.id}
                                to={"/workplace/" + board.code}
                                className={classes.link}
                            >
                                <ListItem
                                    button
                                    selected={false}
                                >
                                    <ListItemIcon>
                                        <Avatar
                                            size={30}
                                            account={{
                                                color: board.color,
                                                initials: board.code
                                            } as User}
                                        />
                                    </ListItemIcon>

                                    <Typography>{board.name}</Typography>
                                </ListItem>
                            </NavLink>
                        )
                    }
                </List>
            </Popover>
        </React.Fragment>
    )
};

export default BoardSelector;