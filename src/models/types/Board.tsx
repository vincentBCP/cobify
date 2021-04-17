type Board = {
    id: string,
    name: string,
    code: string,
    accountID: string,
    color: string,
    columnIDs: string[],
    // computed
    columnCount?: number,
    taskCount?: number,
    userCount?: number
}

export default Board;