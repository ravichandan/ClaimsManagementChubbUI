export interface OfficerWorkload {
  staffNumber: string;
  assignedClaims: number;
  underAssessment: number;
  assignedClaimNumbers: string[];
}

export interface WorkloadSummary {
  totalClaims: number;
  liabilityExposure: number;
  assignedClaims: number;
  underAssessment: number;
  unassignedClaims: number;
  outstandingClaims: number;
  officerWorkloads: OfficerWorkload[];
}

export interface WorkloadApiResponse {
  success: boolean;
  data: WorkloadSummary;
  message: string;
  timestamp: string;
}

export class WorkloadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkloadValidationError';
  }
}

export function validateWorkloadResponse(value: unknown): WorkloadApiResponse {
  if (!isRecord(value)) {
    throw new WorkloadValidationError('Workload response must be an object.');
  }

  if (value['success'] !== true) {
    throw new WorkloadValidationError('Workload response was not successful.');
  }

  if (typeof value['message'] !== 'string' || typeof value['timestamp'] !== 'string') {
    throw new WorkloadValidationError('Workload response metadata is invalid.');
  }

  return {
    success: true,
    data: validateWorkloadSummary(value['data']),
    message: value['message'],
    timestamp: value['timestamp']
  };
}

export function validateWorkloadSummary(value: unknown): WorkloadSummary {
  if (!isRecord(value)) {
    throw new WorkloadValidationError('Workload data must be an object.');
  }

  const numericFields = [
    'totalClaims',
    'liabilityExposure',
    'assignedClaims',
    'underAssessment',
    'unassignedClaims',
    'outstandingClaims'
  ] as const;

  for (const field of numericFields) {
    if (!isNonNegativeNumber(value[field])) {
      throw new WorkloadValidationError(`${field} must be a non-negative number.`);
    }
  }

  if (!Array.isArray(value['officerWorkloads'])) {
    throw new WorkloadValidationError('officerWorkloads must be an array.');
  }

  const officerWorkloads = value['officerWorkloads'].map((officer, index) => {
    if (!isRecord(officer) || typeof officer['staffNumber'] !== 'string') {
      throw new WorkloadValidationError(`officerWorkloads[${index}] has an invalid staff number.`);
    }

    if (
      !isNonNegativeNumber(officer['assignedClaims']) ||
      !isNonNegativeNumber(officer['underAssessment']) ||
      !Array.isArray(officer['assignedClaimNumbers']) ||
      !officer['assignedClaimNumbers'].every((claimNumber) => typeof claimNumber === 'string')
    ) {
      throw new WorkloadValidationError(`officerWorkloads[${index}] has invalid claim counts.`);
    }

    return {
      staffNumber: officer['staffNumber'],
      assignedClaims: officer['assignedClaims'],
      underAssessment: officer['underAssessment'],
      assignedClaimNumbers: officer['assignedClaimNumbers']
    };
  });

  return {
    totalClaims: value['totalClaims'] as number,
    liabilityExposure: value['liabilityExposure'] as number,
    assignedClaims: value['assignedClaims'] as number,
    underAssessment: value['underAssessment'] as number,
    unassignedClaims: value['unassignedClaims'] as number,
    outstandingClaims: value['outstandingClaims'] as number,
    officerWorkloads
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
