import React from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Column from '../../../models/types/Column';

import { SIDE_NAVIGATION_WIDTH } from '../../../components/SideNavigation/SideNavigation';

interface IColumnsProps {
    boardID: string
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            overflow: 'auto',
            whiteSpace: 'nowrap',
            padding: "0 50px 20px 50px"
        },
        column: {
            display: 'inline-flex',
            backgroundColor: 'white',
            borderRadius: 5,
            width: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            minWidth: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            maxWidth: 'calc((100vw - ' + SIDE_NAVIGATION_WIDTH + 'px - 140px) / 3)',
            marginRight: 20,
            padding: 15,
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
        <div className={classes.root}>
            {
                columns.map(col =>
                    <div key={"columns-" + col.id} className={classes.column}>
                        <Typography className={classes.columnTitle}>{col.name}</Typography>    
                    </div>    
                )
            }
        </div>
    );
};

export default Columns;