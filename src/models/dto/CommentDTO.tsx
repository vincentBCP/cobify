type CommentDTO = {
    content: string,
    attachments?: any,
    taskID: string,
    columnID: string,
    boardID: string,
    userID: string,
    accountID: string
}

export default CommentDTO;