type Board = {
    id: string,
    name: string,
    code: string,
    accountID: string,
    color: string,
    // computed
    columnCount?: number,
    taskCount?: number,
    guestCount?: number
}

export default Board;