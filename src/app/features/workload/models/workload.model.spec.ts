import { WorkloadValidationError, validateWorkloadResponse, validateWorkloadSummary } from './workload.model';

describe('validateWorkloadSummary', () => {
  it('returns a typed workload summary for a valid response', () => {
    const response = validateWorkloadResponse({
      success: true,
      message: 'Workload retrieved successfully',
      timestamp: '2026-08-16T05:09:33.438Z',
      data: {
        totalClaims: 12,
        liabilityExposure: 45000,
        assignedClaims: 8,
        underAssessment: 4,
        unassignedClaims: 4,
        outstandingClaims: 10,
        officerWorkloads: [
          {
            staffNumber: 'STF-001',
            assignedClaims: 8,
            underAssessment: 4,
            assignedClaimNumbers: ['CLM-1001', 'CLM-1002']
          }
        ]
      }
    });

    expect(response.data.totalClaims).toBe(12);
    expect(response.data.officerWorkloads[0].staffNumber).toBe('STF-001');
    expect(response.data.officerWorkloads[0].assignedClaimNumbers).toEqual(['CLM-1001', 'CLM-1002']);
  });

  it('rejects negative totals', () => {
    expect(() =>
      validateWorkloadSummary({
        totalClaims: -1,
        liabilityExposure: 45000,
        assignedClaims: 8,
        underAssessment: 4,
        unassignedClaims: 4,
        outstandingClaims: 10,
        officerWorkloads: []
      })
    ).toThrow(WorkloadValidationError);
  });

  it('rejects missing officer workload data', () => {
    expect(() =>
      validateWorkloadSummary({
        totalClaims: 12,
        liabilityExposure: 45000,
        assignedClaims: 8,
        underAssessment: 4,
        unassignedClaims: 4,
        outstandingClaims: 10
      })
    ).toThrow(WorkloadValidationError);
  });

  it('rejects an unsuccessful API envelope', () => {
    expect(() =>
      validateWorkloadResponse({ success: false, data: {}, message: 'Failed', timestamp: 'now' })
    ).toThrow(WorkloadValidationError);
  });
});