import React from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Column from '../../../models/types/Column';

interface IColumnsProps {
    boardID: string
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 20
        },
        column: {
            backgroundColor: 'white',
            borderRadius: 5,
            width: 300,
            marginRight: 20,
            padding: 12,
            boxShadow: "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px",
            '&:last-of-type': {
                marginRight: 0
            }
        },
        columnTitle: {

        }
    })
);

const Columns: React.FC<IColumnsProps> = props => {
    const classes = useStyles();

    const columns: Column[] = useSelector((state: any) => 
        state.column.columns.filter((c: Column) => c.boardID === props.boardID));

    return (
        <Grid container className={classes.root}>
            {
                columns.map(col =>
                    <Grid key={"columns-" + col.id} item className={classes.column}>
                        <Typography className={classes.columnTitle}>{col.name}</Typography>    
                    </Grid>    
                )
            }
        </Grid>
    );
};

export default Columns;