import React, { useRef } from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge'

import Label from '../../../models/types/Label';

interface ILabelFilterProps {
    boardID: string,
    labels?: string[],
    handleChange: (arg1: string[]) => void
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
            display: 'flex',
            marginLeft: 20
        },
        button: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: "8px 10px 8px 15px",
            borderRadius: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            
            '&.open': {
                backgroundColor: '#233044',

                '& *': {
                    color: 'rgba(255, 255, 255, 0.9)'
                }
            },
            '& p': {
                fontSize: 15,
                textAlign: 'left',
                color: '#777f8a',
                marginRight: 10
            },
            '& svg': {
                width: 20,
                height: 20,
                color: '#777f8a'
            }
        },
        badge: {
            marginLeft: 5,
            marginRight: 20
        },
        list: {
            minWidth: 200
        },
        listItem: {
            textAlign: 'left',

            '& p': {
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 14
            }
        },
        color: {
            padding: 5,
            borderRadius: '50%',
            marginRight: 7
        }
    })
);

const LabelFilter: React.FC<ILabelFilterProps> = props => {
    const classes = useStyles();

    const elemRef = useRef(null);

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const labels: Label[] = useSelector((state: any) =>
        state.label.labels.filter((l: Label) => l.boardID === props.boardID));

    const handlelistItemClick = (label: Label) => {
        const labels: string[] = [...(props.labels || [])];
        const index = labels.findIndex(l => l === label.name);

        if (index === -1) {
            labels.push(label.name);
        } else {
            labels.splice(index, 1);
        }

        props.handleChange(labels);
    }

    return (
        <React.Fragment>
            <div ref={elemRef} className={classes.root}>
                <Button
                    className={[classes.button, Boolean(anchorEl) ? "open" : ""].join(' ')}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                    }}
                >
                    <Typography>Label</Typography>
                    {
                        props.labels && props.labels.length > 0
                        ? <Badge color="primary" badgeContent={props.labels?.length} className={classes.badge}></Badge>
                        : null
                    }
                    <ExpandMoreIcon />
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
                <List className={classes.list}>
                    {
                        _.orderBy(labels, ["name"]).map(label => {
                            const isSelected = (props.labels || []).includes(label.name);

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
                                </ListItem>
                            );
                        })
                    }
                </List>
            </Popover>
        </React.Fragment>
    );
};

export default LabelFilter;