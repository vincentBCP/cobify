type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    color: string,
    accountID: string,
    // computed
    displayName?: string,
    initials?: string
};

export default User;