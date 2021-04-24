import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';

import User from '../../models/types/User';

interface IAvatarProps {
    size: number,
    account: User
    /*src?: string,
    color?: string,
    initials?: string*/
};

const ProfileAvatar: React.FC<IAvatarProps> = props => {
    const theme = useTheme();

    return (
        <Avatar
            style={{
                width: props.size,
                height: props.size,
                fontSize: props.size / 2,
                backgroundColor: props.account.color ? props.account.color : deepPurple[500],
                color: theme.palette.getContrastText(props.account.color ? props.account.color : deepPurple[500])
            }}
            src={props.account.profilePicture ? props.account.profilePicture.downloadURL : ""}
        >
            {props.account.initials}
        </Avatar>
    );
};

export default ProfileAvatar;