type CommentDTO = {
    content: string,
    attachments?: any,
    taskID: string,
    userID: string,
    accountID: string,
    date: string
}

export default CommentDTO;