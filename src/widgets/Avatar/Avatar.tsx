import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';

interface IAvatarProps {
    size: number,
    textSize: number,
    src?: string,
    color?: string,
    firstName?: string,
    lastName?: string
};

const ProfileAvatar: React.FC<IAvatarProps> = props => {
    const theme = useTheme();

    const getInitials = (): string => {
        if (!props.firstName && !props.lastName) return '';

        return ((props.firstName || '').charAt(0).toUpperCase() + 
                (props.lastName || '').charAt(0)).toUpperCase();
    };

    return (
        <Avatar
            style={{
                width: props.size,
                height: props.size,
                fontSize: props.textSize,
                backgroundColor: props.color ? props.color : deepPurple[500],
                color: theme.palette.getContrastText(props.color ? props.color : deepPurple[500])
            }}
        >
            {getInitials()}
        </Avatar>
    );
};

export default ProfileAvatar;