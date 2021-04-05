import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';

interface IAvatarProps {
    size?: 'sm',
    src?: string,
    color?: string,
    firstName?: string,
    lastName?: string
};

const ProfileAvatar: React.FC<IAvatarProps> = props => {
    const theme = useTheme();

    const getInitials = (): string => {
        if (!props.firstName || !props.lastName) return '';

        return (props.firstName.charAt(0) + props.lastName.charAt(0)).toUpperCase();
    };

    return (
        <Avatar
            style={{
                width: props.size === 'sm' ? 30 : 130,
                height: props.size === 'sm' ? 30 : 130,
                fontSize: props.size === 'sm' ? 14 : 72,
                backgroundColor: props.color ? props.color : deepPurple[500],
                color: theme.palette.getContrastText(props.color ? props.color : deepPurple[500])
            }}
        >
            {getInitials()}
        </Avatar>
    );
};

export default ProfileAvatar;