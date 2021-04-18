import React, { useState } from 'react';

import { createStyles, makeStyles, Theme, lighten } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import TableToolbar from './TableToolbar';
import TableHead from './TableHead';

export enum Order {
    ASC = "asc",
    DESC = "desc"
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === Order.DESC
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
    id: string;
    label: string;
    property?: string;
    disablePadding?: boolean;
    align?: "inherit" | "left" | "right" | "center";
    render?: (arg1: any) => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
            borderRadius: 7,
            boxShadow: "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px"
        },
        table: {
            width: '100%'
        },
        tableRow: {
            '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: lighten(theme.palette.primary.main, 0.85)
            }
        }
    }),
);

interface ITableProps {
    dataList: any[],
    headCells: HeadCell[],
    defaultOrderBy: string,
    title?: string,
    actions?: JSX.Element,
    handleDeleteSelectedRows: (arg1: string[]) => [Promise<any>, () => void, () => void]
}

const CustomTable: React.FC<ITableProps> = props => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>(Order.ASC);
    const [orderBy, setOrderBy] = React.useState<string>(props.defaultOrderBy);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);

    const filterDataList = () => {
        return stableSort(props.dataList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === Order.ASC;
        setOrder(isAsc ? Order.DESC : Order.ASC);
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = filterDataList().map((n: any) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setSelected([]);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = () => {
        const [request, successCallback, failCallback] = props.handleDeleteSelectedRows(selected);
        
        if (loading) return;
        setLoading(true);

        request
        .then(() => {
            setLoading(false);
            setSelected([]);
            successCallback();
        })
        .catch(() => failCallback());
    }

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.dataList.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <TableToolbar
                    title={props.title} 
                    numSelected={selected.length}
                    actions={props.actions}
                    handleDelete={handleDelete}
                    loading={loading}
                />
                <TableContainer>
                    <Table className={classes.table}>
                        <TableHead
                            headCells={props.headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={Math.min(props.dataList.length, rowsPerPage)}
                        />
                        <TableBody>
                            {filterDataList().map((row: any, index) => {
                                const isItemSelected = isSelected(row.id);

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        className={classes.tableRow}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                            />
                                        </TableCell>
                                        {props.headCells.map((headCell, ind) => 
                                            <TableCell
                                                key={row.id + "-cell-" + ind}
                                                padding={headCell.disablePadding ? "none" : "default"}
                                                align={headCell.align}
                                            >
                                                { headCell.property && !headCell.render ? row[headCell.property] : null}
                                                { headCell.render ? headCell.render(row) : null }
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={props.dataList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};

export default CustomTable;