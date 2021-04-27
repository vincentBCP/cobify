type Notification = {
    id: string,
    recipientID: string,
    senderID: string,
    title: string,
    message: string,
    taskID: string,
    accountID: string,
    date: string,
    read?: boolean
}

export default Notification;