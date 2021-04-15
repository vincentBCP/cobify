import React, { useRef, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';

import Auxi from '../../../../hoc/Auxi';

import Task from '../../../../models/types/Task';
import Column from '../../../../models/types/Column';
import Board from '../../../../models/types/Board';

interface IColumnSelectorProps {
    task: Task,
    board: Board,
    handleChange: (arg1: Column) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            '& .MuiPopover-paper': {
                borderRadius: 0
            }
        },
        root: {
            display: 'flex',
            marginBottom: 30,
        },
        button: {
            display: 'flex',
            justifyContent: 'flex-start',
            padding: "7px 15px",

            '& *': {
                color: 'white !important'
            }
        }
    })
);

const ColumnSelector: React.FC<IColumnSelectorProps> = props => {
    const classes = useStyles();

    const elemRef = useRef(null);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [listWidth, setListWidth] = useState<number>();

    useEffect(() => {
        if (!(elemRef && elemRef.current)) return;

        const elem: any = elemRef.current || {};

        setListWidth(elem.offsetWidth);
    }, [ elemRef ]);

    const columns: Column[] = useSelector((state: any) => 
        state.column.columns.filter((c: any) => c.boardID === props.task.boardID));
    const column = columns.find(c => c.id === props.task.columnID);

    const handlelistItemClick = (column: Column) => {
        setAnchorEl(null);
        props.handleChange(column);
    }

    return (
        <Auxi>
            <div ref={elemRef} className={classes.root}>
                <Button           
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                    }}
                >
                    <Typography>{column?.name}</Typography>
                    <ArrowDown />
                </Button>
            </div>

            <Popover
                id="column-selector-popup"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                className={classes.popover}
            >
                <List
                    style={{
                        width: listWidth || 'auto'
                    }}
                >
                    {
                        props.board.columnIDs.map(cID => {
                            const column = columns.find(c => c.id === cID);

                            if (!column) return null;

                            const isSelected = props.task.columnID === column.id;


                            return isSelected
                                ? <ListItem
                                    key={"column-selector-" + column.id}
                                    selected
                                >
                                    <Typography>{column.name}</Typography>
                                </ListItem>
                                : <ListItem
                                    button
                                    key={"column-selector-" + column.id}
                                    onClick={() => handlelistItemClick(column)}
                                >
                                    <Typography>{column.name}</Typography>
                                </ListItem>;
                        })
                    }
                </List>
            </Popover>
        </Auxi>
    );
}

export default ColumnSelector;