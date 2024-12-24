import React, { createContext, useContext, useReducer } from 'react';
import type { HistoryAction, HistoryState } from '../types/history';

interface HistoryContextType {
  history: HistoryState;
  addAction: (action: HistoryAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const historyReducer = (state: HistoryState, action: any) => {
  switch (action.type) {
    case 'ADD_ACTION':
      return {
        ...state,
        actions: [...state.actions.slice(0, state.currentIndex + 1), action.payload],
        currentIndex: state.currentIndex + 1
      };
    case 'UNDO':
      if (state.currentIndex >= 0) {
        return {
          ...state,
          currentIndex: state.currentIndex - 1
        };
      }
      return state;
    case 'REDO':
      if (state.currentIndex < state.actions.length - 1) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1
        };
      }
      return state;
    default:
      return state;
  }
};

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, dispatch] = useReducer(historyReducer, {
    actions: [],
    currentIndex: -1
  });

  const addAction = (action: HistoryAction) => {
    dispatch({ type: 'ADD_ACTION', payload: action });
  };

  const undo = () => {
    if (canUndo) {
      const action = history.actions[history.currentIndex];
      if (action.undoData) {
        // Perform the undo operation
        dispatch({ type: 'UNDO' });
      }
    }
  };

  const redo = () => {
    if (canRedo) {
      const action = history.actions[history.currentIndex + 1];
      // Perform the redo operation
      dispatch({ type: 'REDO' });
    }
  };

  const canUndo = history.currentIndex >= 0;
  const canRedo = history.currentIndex < history.actions.length - 1;

  return (
    <HistoryContext.Provider value={{ history, addAction, undo, redo, canUndo, canRedo }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}; 