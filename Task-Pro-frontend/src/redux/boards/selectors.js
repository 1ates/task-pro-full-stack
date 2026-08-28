export const selectBoards = (state) => state.boards.items;
export const selectCurrentBoard = (state) => state.boards.current;
export const selectBoardsLoading = (state) => state.boards.isLoading;
export const selectCurrentBoardLoading = (state) => state.boards.isLoadingCurrent;
export const selectBoardsError = (state) => state.boards.error;
