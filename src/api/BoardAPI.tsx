import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import Board from '../models/types/Board';
import BoardDTO from '../models/dto/BoardDTO';

class BoardAPI {
    public static createBoard(dto: BoardDTO): Promise<Board> {
        return axios.post('board', dto)
            .then(response => {
                return {
                    id: uuidv4(),
                    ...dto,
                    columnIDs: [
                        uuidv4(),
                        uuidv4(),
                        uuidv4()
                    ]
                } as Board;
            });
    };

    public static updateBoard(board: Board): Promise<Board> {
        return axios.put('board/' + board.id, board)
            .then(response => board);
    };
};

export default BoardAPI;