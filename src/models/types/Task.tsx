import IAttachment from "../interfaces/IAttachment";

type Task = {
    id: string,
    code: string,
    title: string,
    description?: string,
    columnID: string,
    boardID: string,
    creatorID: string,
    accountID: string,
    attachments?: IAttachment[],
    asigneeID?: string,
    created: string,
    updated: string
}

export default Task;