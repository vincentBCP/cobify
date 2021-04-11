import React from 'react';

import clsx from 'clsx';

import { makeStyles, createStyles, Theme, lighten } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ITableToolbarProps {
    title?: string,
    numSelected: number,
    actions?: JSX.Element,
    loading?: boolean,
    handleDelete: () => void
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
            ? {
                color: theme.palette.primary.main,
                backgroundColor: lighten(theme.palette.primary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.dark,
            },
        title: {
            flex: '1 1 100%',
        },
    }),
);

const TableToolbar: React.FC<ITableToolbarProps> = props => {
    const classes = useStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {props.title}
                </Typography>
            )}
            {props.loading ? <CircularProgress size={30} color="inherit" /> : null}
            {(!props.loading && numSelected > 0) ? (
                <Tooltip title="Delete" onClick={props.handleDelete}>
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : null}
            {(!props.loading && numSelected < 1) ? props.actions : null}
        </Toolbar>
    )
};

export default TableToolbar;