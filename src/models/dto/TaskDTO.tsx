type TaskDTO = {
    code: string,
    title: string,
    description?: string,
    columnID: string,
    boardID: string,
    creatorID: string,
    accountID: string,
    attachments?: any// [file, file] [IAttachment, IAttachment] [string, file]
}

export default TaskDTO;