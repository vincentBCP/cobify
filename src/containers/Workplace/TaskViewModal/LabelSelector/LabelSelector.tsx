import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

import { useSelector, connect } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CloseIcon from '@material-ui/icons/Close';

import LabelFormModal from './LabelFormModal';

import Task from '../../../../models/types/Task';
import Label from '../../../../models/types/Label';
import LabelDTO from '../../../../models/dto/LabelDTO';
import User from '../../../../models/types/User';

import UserRole from '../../../../models/enums/UserRole';

import ErrorContext from '../../../../context/errorContext';

import * as actions from '../../../../store/actions';

interface ILabelSeletorProps {
    task: Task,
    fullScreen?: boolean,
    handleChange: (arg1: string[]) => void,
    createLabel: (arg1: LabelDTO) => Promise<any>
    deleteLabel: (arg1: string) => Promise<any>,
    updateTask: (arg1: Task) => Promise<any>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            '& .MuiPopover-paper': {
                borderRadius: 0,
                marginTop: 5
            }
        },
        root: {
            overflow: 'hidden',
            flexGrow: 1,
            display: 'flex'
        },
        button: {
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            padding: "5px 0 5px 10px",
            borderRadius: 0,
            border: "2px solid white",
            
            '&.open': {
                borderRadius: 3,
                border: "2px solid " + theme.palette.primary.main,
            },
            '& p': {
                fontSize: 14,
                fontWeight: 300,
                textAlign: 'left'
            }
        },
        listItem: {
            display: 'flex',
            alignItems: 'center',

           '& p': {
               flexGrow: 1,
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               whiteSpace: 'nowrap',
               fontSize: 14
           },
           '& svg': {
                width: 18,
                height: 18,
                padding: 2,
                cursor: 'pointer',
                marginLeft: 5,

                '&:hover': {
                    backgroundColor: 'lightgray',
                    borderRadius: '50%'
                }
           }
        },
        color: {
            padding: 5,
            borderRadius: '50%',
            marginRight: 7
        }
    })
);

const LabelSelector: React.FC<ILabelSeletorProps> = props => {
    const classes = useStyles();

    const elemRef = useRef(null);

    const errorContext = React.useContext(ErrorContext);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [listWidth, setListWidth] = useState<number>();
    const [addLabel, setAddLabel] = useState(false);

    const account: User = useSelector((state: any) => state.app.account);
    const labels: Label[] = useSelector((state: any) =>
        state.label.labels.filter((l: Label) => l.boardID === props.task.boardID));
    const tasks: Task[] = useSelector((state: any) =>
        state.task.tasks.filter((t: Task) => t.boardID === props.task.boardID));

    useEffect(() => {
        if (!(elemRef && elemRef.current)) return;

        const elem: any = elemRef.current || {};

        setListWidth(elem.offsetWidth);
    }, [ elemRef, props.fullScreen ]);

    const handlelistItemClick = (label: Label, remove?: boolean) => {
        const labels: string[] = [...(props.task.labels || [])];
        const index = labels.findIndex(l => l === label.name);

        if (index === -1 && !remove) {
            labels.push(label.name);
        } else {
            labels.splice(index, 1);
        }

        props.handleChange(labels);
    }

    const handleAddLabel = (data: any): [Promise<any>, (arg1: any) => void, (arg1: any) => void] => {
        const dto: LabelDTO = {
            ...data,
            boardID: props.task.boardID,
            accountID: props.task.accountID
        };

        return [
            props.createLabel(dto),
            response => {
                setAddLabel(false)
            },
            error => {
                errorContext.setError(error)
            }
        ]
    }

    const handleDeleteLabel = (label: Label) => {
        const c = window.confirm("Delete label?");

        if (!c) return;

        props.deleteLabel(label.id);
        handlelistItemClick(label, true);

        const promises: any[] = [];

        tasks.forEach(task => {
            if (!task.labels || task.labels.length < 1 || !task.labels.includes(label.name)) return;

            const labels: string[] = [...task.labels];
            const index = labels.findIndex(lName => lName === label.name);
            labels.splice(index, 1);

            const updatedTask: Task = {
                ...task,
                labels: [...labels]
            };

            promises.push(props.updateTask(updatedTask));
        });
    }

    return (
        <React.Fragment>
            <LabelFormModal
                open={addLabel}
                handleSubmit={handleAddLabel}
                handleCancel={() => setAddLabel(false)}
                boardID={props.task.boardID}
                labels={labels}
            />

            <div ref={elemRef} className={classes.root}>
                <Button
                    className={[classes.button, Boolean(anchorEl) ? "open" : ""].join(' ')}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                    }}
                >
                    <Typography>
                        {
                            props.task.labels && props.task.labels.length > 0
                            ? _.orderBy(props.task.labels).join(",")
                            : "None"
                        }
                    </Typography>
                </Button>
            </div>

            <Popover
                id="label-selector-popup"
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
                        width: listWidth,//!props.fullScreen ? (listWidth || 'auto') : 'auto',
                        maxWidth: listWidth,//props.fullScreen ? (listWidth || 'auto') : 'auto'
                    }}
                >
                    {
                        _.orderBy(labels, ["name"]).map(label => {
                            const isSelected = (props.task.labels || []).includes(label.name);

                            return (
                                <ListItem
                                    button
                                    selected={isSelected}
                                    className={classes.listItem}
                                    key={"label-selector-" + label.id}
                                    onClick={() => handlelistItemClick(label)}
                                >
                                    <div className={classes.color}
                                        style={{backgroundColor: label.color}}></div>
                                    <Typography>{label.name}</Typography>
                                    {
                                        account.role === UserRole.ADMIN ||
                                        account.role === UserRole.COADMIN
                                        ? <CloseIcon
                                            onClick={(ev: React.MouseEvent) => {
                                                ev.stopPropagation();

                                                handleDeleteLabel(label);
                                            }}
                                        />
                                        : null
                                    }
                                </ListItem>
                            );
                        })
                    }
                </List>
                {
                    account.role === UserRole.ADMIN ||
                    account.role === UserRole.COADMIN
                    ? <Button
                        fullWidth
                        style={{borderRadius: 0}}
                        onClick={() => setAddLabel(true)}
                    >
                        Add new label
                    </Button>
                    : null
                }
            </Popover>
        </React.Fragment>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        createLabel: (dto: LabelDTO) => dispatch(actions.createLabel(dto)),
        deleteLabel: (id: string) => dispatch(actions.deleteLabel(id)),
        updateTask: (task: Task) => dispatch(actions.updateTask(task))
    }
}

export default connect(null, mapDispatchToProps)(LabelSelector);