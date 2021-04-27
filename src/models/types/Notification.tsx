type Notification = {
    id: string,
    recipient: string,
    sender: string,
    title: string,
    message: string,
    taskID: string,
    boardID: string,
    accountID: string,
    date: string,
    read?: boolean
}

export default Notification;