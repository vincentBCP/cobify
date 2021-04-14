import IAttachment from "../interfaces/IAttachment";

type Task = {
    id: string,
    code: string,
    title: string,
    description?: string,
    columnID: string,
    boardID: string,
    accountID: string,
    attachments?: IAttachment[]
}

export default Task;