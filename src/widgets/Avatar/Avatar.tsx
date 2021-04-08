import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';

interface IAvatarProps {
    size: number,
    src?: string,
    color?: string,
    initials?: string
};

const ProfileAvatar: React.FC<IAvatarProps> = props => {
    const theme = useTheme();

    return (
        <Avatar
            style={{
                width: props.size,
                height: props.size,
                fontSize: props.size / 2,
                backgroundColor: props.color ? props.color : deepPurple[500],
                color: theme.palette.getContrastText(props.color ? props.color : deepPurple[500])
            }}
        >
            {props.initials}
        </Avatar>
    );
};

export default ProfileAvatar;