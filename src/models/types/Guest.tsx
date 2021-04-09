type Guest = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    color: string,
    hostID: string,
    // computed
    displayName?: string,
    initials?: string
};

export default Guest;