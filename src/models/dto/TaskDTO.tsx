import IAttachment from "../interfaces/IAttachment";

type TaskDTO = {
    title: string,
    description?: string,
    columnID: string,
    boardID: string,
    accountID: string,
    attachments?: File[] | IAttachment[]
}

export default TaskDTO;