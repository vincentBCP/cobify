type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    color: string,
    accountID: string,
    created: string,
    // computed
    displayName?: string,
    initials?: string
};

export default User;