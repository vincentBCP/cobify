import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import RemoveIcon from '@material-ui/icons/Cancel';

interface IChipProps {
    label: string,
    color: string,
    handleDelete?: () => void
}

const CustomChip: React.FC<IChipProps> = props => {
    const theme = useTheme();

    const contrast = theme.palette.getContrastText(props.color);

    return (
        <Chip
            label={props.label}
            clickable={false}
            onClick={(ev: React.MouseEvent) => { ev.stopPropagation(); }}
            onDelete={props.handleDelete}
            style={{
                marginRight: 5,
                marginBottom: 5,
                backgroundColor: props.color,
                color: contrast
            }}
            deleteIcon={
                <RemoveIcon style={{color: contrast}} fontSize="small" />
            }
        />
    );
};

export default CustomChip;