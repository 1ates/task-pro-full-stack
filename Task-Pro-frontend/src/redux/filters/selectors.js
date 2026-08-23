import { createSelector } from "@reduxjs/toolkit";
import { selectCards } from "../cards/selectors.js";

// ─── Raw filter value ───
export const selectFilterPriority = (state) => state.filters.priority;

// ─── Memoized: cards filtered by the current priority ───
export const selectFilteredCards = createSelector(
  [selectCards, selectFilterPriority],
  (cards, priority) => {
    if (priority === "all") return cards;
    return cards.filter((card) => card.priority === priority);
  }
);
