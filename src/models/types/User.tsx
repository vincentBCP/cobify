import IAttachment from '../interfaces/IAttachment';

type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    color: string,
    accountID: string,
    organization?: string,
    created: string,
    profilePicture?: IAttachment,
    // computed
    displayName?: string,
    initials?: string
};

export default User;