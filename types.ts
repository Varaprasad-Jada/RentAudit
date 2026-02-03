
export enum AuditType {
  MOVE_IN = 'Move-In',
  MOVE_OUT = 'Move-Out',
  GENERAL_REPAIR = 'General Repair'
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface PhotoRecord {
  id: string;
  imageUrl: string;
  timestamp: string;
  location: LocationData;
  note?: string;
  category: string;
}

export interface PropertyAudit {
  id: string;
  type: AuditType;
  propertyName: string;
  address: string;
  landlordName: string;
  createdAt: string;
  photos: PhotoRecord[];
  isCompleted: boolean;
}

export interface AppState {
  audits: PropertyAudit[];
  currentAuditId: string | null;
}
