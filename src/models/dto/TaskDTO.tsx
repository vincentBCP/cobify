type TaskDTO = {
    code: string,
    title: string,
    description?: string,
    columnID: string,
    boardID: string,
    creatorID: string,
    accountID: string,
    attachments?: any// [file, file] [IAttachment, IAttachment] [string, file]
    created: string,
    updated: string
}

export default TaskDTO;