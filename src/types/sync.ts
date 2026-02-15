export interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
  lastSyncedAt?: string;
}

export interface MigrationResult {
  migratedCount: number;
  errors: string[];
  timestamp: string;
}
