import React from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

interface ISearchBarProps {
    placeholder: string,
    handleChange: (arg1: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '3px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 230,
            boxShadow: "rgba(0,0,0,0.2) 0px 0px 1px 1px"
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            height: 30,
            width: 30
        }
    })
);

const SearchBar: React.FC<ISearchBarProps> = props => {
    const classes = useStyles();

    return (
        <Paper component="form" className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder={props.placeholder}
                inputProps={{ 'aria-label': props.placeholder }}
                onChange={(ev: React.ChangeEvent) => props.handleChange((ev.target as HTMLInputElement).value)}
            />
            <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;