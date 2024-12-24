export interface HistoryAction {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete';
  module: 'visa' | 'worker' | 'organization' | 'financial';
  entityId: string;
  entityType: string;
  description: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  user: string;
  canUndo: boolean;
  undoData?: any;
}

export interface HistoryState {
  actions: HistoryAction[];
  currentIndex: number;
} 