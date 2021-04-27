type NotificationDTO = {
    recipient: string,
    sender: string,
    title: string,
    message: string,
    taskID: string,
    boardID: string,
    accountID: string,
    date: string
}

export default NotificationDTO;