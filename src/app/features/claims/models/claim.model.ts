export type ClaimStatus = 'Submitted' | 'Under review' | 'Approved' | 'Rejected';
export type ClaimType = 'Vehicle' | 'Property';

export interface Claim {
  id: string;
  claimantName: string;
  claimantEmail: string;
  claimType: ClaimType;
  incidentDate: string;
  location: string;
  amount: number;
  description: string;
  status: ClaimStatus;
  submittedAt: string;
}

export type NewClaim = Omit<Claim, 'id' | 'status' | 'submittedAt'>;
