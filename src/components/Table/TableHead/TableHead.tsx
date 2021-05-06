import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { Order, HeadCell } from '../Table';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        sortLabel: {
            fontWeight: 'bold'
        },
        headLabel: {
            fontWeight: 'bold'
        }
    }),
);

interface ITableHeadProps {
    headCells: HeadCell[],
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

const CustomTableHead: React.FC<ITableHeadProps> = props => {
    const classes = useStyles();

    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'toggle rows selection' }}
                        color="primary"
                    />
                </TableCell>
                {props.headCells.map((headCell) => {
                    return headCell.property
                        ? <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === headCell.property ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.property}
                                direction={orderBy === headCell.property ? order : Order.ASC}
                                onClick={createSortHandler(headCell.property)}
                                className={classes.sortLabel}
                            >
                                {headCell.label}
                                {orderBy === headCell.property ? (
                                <span className={classes.visuallyHidden}>
                                    {order === Order.DESC ? 'sorted descending' : 'sorted ascending'}
                                </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                        : <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            className={classes.headLabel}
                        >
                            {headCell.label}
                        </TableCell>
                })}
            </TableRow>
        </TableHead>
    );
};

export default CustomTableHead;