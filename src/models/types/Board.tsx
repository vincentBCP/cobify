type Board = {
    id: string,
    name: string,
    accountID: string,
    color: string,
    // computed
    columnCount?: number,
    taskCount?: number,
    guestCount?: number
}

export default Board;