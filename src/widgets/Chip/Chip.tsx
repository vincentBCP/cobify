import React, { useState } from 'react';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import RemoveIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';

interface IChipProps {
    label: string,
    color: string,
    handleDelete?: () => [Promise<any>, () => void, () => void]
}

const CustomChip: React.FC<IChipProps> = props => {
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const contrast = theme.palette.getContrastText(props.color);

    const handleDelete = () => {
        if (!props.handleDelete) return;

        const [request, successCallback, failCallback] = props.handleDelete();

        setLoading(true);

        request
        .then(() => {
            successCallback()
        })
        .catch(error => failCallback());
    };

    return (
        <Chip
            label={props.label}
            clickable={false}
            onClick={(ev: React.MouseEvent) => { ev.stopPropagation(); }}
            onDelete={handleDelete}
            style={{
                marginRight: 5,
                marginBottom: 5,
                backgroundColor: props.color,
                color: contrast
            }}
            deleteIcon={
                loading
                ? <CircularProgress size={22} style={{ color: contrast }} />
                : <RemoveIcon style={{color: contrast}} fontSize="small" />
            }
        />
    );
};

export default CustomChip;