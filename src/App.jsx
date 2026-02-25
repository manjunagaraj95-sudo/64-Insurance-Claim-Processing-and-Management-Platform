
import React, { useState, useEffect } from 'react';

// --- ROLES Configuration ---
const ROLES = {
    ADMIN: 'ADMIN',
    CLAIMS_OFFICER: 'CLAIMS_OFFICER',
    FINANCE: 'FINANCE',
    POLICYHOLDER: 'POLICYHOLDER',
};

// --- Standardized Status Keys and Mappings ---
const CLAIM_STATUSES = {
    PENDING_SUBMISSION: 'PENDING_SUBMISSION',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    VERIFICATION_NEEDED: 'VERIFICATION_NEEDED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SETTLED: 'SETTLED',
};

const CLAIM_STATUS_MAPPING = {
    [CLAIM_STATUSES.PENDING_SUBMISSION]: 'Pending Submission',
    [CLAIM_STATUSES.SUBMITTED]: 'Submitted',
    [CLAIM_STATUSES.UNDER_REVIEW]: 'Under Review',
    [CLAIM_STATUSES.VERIFICATION_NEEDED]: 'Verification Needed',
    [CLAIM_STATUSES.APPROVED]: 'Approved',
    [CLAIM_STATUSES.REJECTED]: 'Rejected',
    [CLAIM_STATUSES.SETTLED]: 'Settled',
};

const CLAIM_STATUS_COLORS = {
    [CLAIM_STATUSES.PENDING_SUBMISSION]: 'var(--status-pending-submission)',
    [CLAIM_STATUSES.SUBMITTED]: 'var(--status-submitted)',
    [CLAIM_STATUSES.UNDER_REVIEW]: 'var(--status-under-review)',
    [CLAIM_STATUSES.VERIFICATION_NEEDED]: 'var(--status-verification-needed)',
    [CLAIM_STATUSES.APPROVED]: 'var(--status-approved)',
    [CLAIM_STATUSES.REJECTED]: 'var(--status-rejected)',
    [CLAIM_STATUSES.SETTLED]: 'var(--status-settled)',
};

// --- Dummy Data ---
const dummyClaimsData = [
    {
        id: 'CLM001',
        policyId: 'POL101',
        policyholderName: 'Alice Johnson',
        type: 'Auto Accident',
        description: 'Rear-end collision on highway.',
        amount: 5500.00,
        submissionDate: '2023-10-26',
        status: CLAIM_STATUSES.APPROVED,
        documents: ['invoice.pdf', 'police_report.jpg'],
        verificationNotes: 'All documents verified. Minor discrepancies resolved.',
        workflowStage: 4, // 1: Submitted, 2: Under Review, 3: Verification Needed, 4: Approved, 5: Settled
        slaStatus: 'Met',
        auditTrail: [
            { timestamp: '2023-10-26T10:00:00Z', user: 'Alice Johnson', action: 'Claim Submitted' },
            { timestamp: '2023-10-27T09:15:00Z', user: 'Claims Officer', action: 'Review Initiated' },
            { timestamp: '2023-10-28T14:30:00Z', user: 'Claims Officer', action: 'Verification Approved' },
            { timestamp: '2023-10-29T11:00:00Z', user: 'Claims Officer', action: 'Claim Approved' },
        ],
    },
    {
        id: 'CLM002',
        policyId: 'POL102',
        policyholderName: 'Bob Williams',
        type: 'Home Burglary',
        description: 'Electronics stolen from home.',
        amount: 8200.00,
        submissionDate: '2023-10-25',
        status: CLAIM_STATUSES.UNDER_REVIEW,
        documents: ['inventory_list.pdf', 'photos.zip'],
        verificationNotes: 'Pending additional security footage.',
        workflowStage: 2,
        slaStatus: 'Within SLA',
        auditTrail: [
            { timestamp: '2023-10-25T11:30:00Z', user: 'Bob Williams', action: 'Claim Submitted' },
            { timestamp: '2023-10-26T08:00:00Z', user: 'Claims Officer', action: 'Review Initiated' },
        ],
    },
    {
        id: 'CLM003',
        policyId: 'POL103',
        policyholderName: 'Carol White',
        type: 'Medical Expense',
        description: 'Emergency appendectomy.',
        amount: 12500.00,
        submissionDate: '2023-10-24',
        status: CLAIM_STATUSES.REJECTED,
        documents: ['hospital_bill.pdf'],
        verificationNotes: 'Procedure not covered by current policy terms.',
        workflowStage: 4,
        slaStatus: 'Breached',
        auditTrail: [
            { timestamp: '2023-10-24T09:00:00Z', user: 'Carol White', action: 'Claim Submitted' },
            { timestamp: '2023-10-25T10:00:00Z', user: 'Claims Officer', action: 'Review Initiated' },
            { timestamp: '2023-10-26T15:00:00Z', user: 'Claims Officer', action: 'Claim Rejected' },
        ],
    },
    {
        id: 'CLM004',
        policyId: 'POL101',
        policyholderName: 'Alice Johnson',
        type: 'Dental Check-up',
        description: 'Routine dental visit.',
        amount: 250.00,
        submissionDate: '2023-10-20',
        status: CLAIM_STATUSES.SETTLED,
        documents: ['dentist_bill.pdf'],
        verificationNotes: 'All clear, payment processed.',
        workflowStage: 5,
        slaStatus: 'Met',
        auditTrail: [
            { timestamp: '2023-10-20T14:00:00Z', user: 'Alice Johnson', action: 'Claim Submitted' },
            { timestamp: '2023-10-21T09:00:00Z', user: 'Claims Officer', action: 'Review Initiated' },
            { timestamp: '2023-10-22T10:00:00Z', user: 'Finance Team', action: 'Payment Processed' },
            { timestamp: '2023-10-22T10:30:00Z', user: 'Finance Team', action: 'Claim Settled' },
        ],
    },
    {
        id: 'CLM005',
        policyId: 'POL104',
        policyholderName: 'David Green',
        type: 'Property Damage',
        description: 'Tree fell on garage during storm.',
        amount: 15000.00,
        submissionDate: '2023-10-28',
        status: CLAIM_STATUSES.SUBMITTED,
        documents: ['damage_photos.zip', 'repair_estimate.pdf'],
        verificationNotes: '',
        workflowStage: 1,
        slaStatus: 'Within SLA',
        auditTrail: [
            { timestamp: '2023-10-28T16:00:00Z', user: 'David Green', action: 'Claim Submitted' },
        ],
    },
    {
        id: 'CLM006',
        policyId: 'POL105',
        policyholderName: 'Eve Brown',
        type: 'Travel Cancellation',
        description: 'Flight cancelled due to airline strike.',
        amount: 1200.00,
        submissionDate: '2023-10-29',
        status: CLAIM_STATUSES.PENDING_SUBMISSION,
        documents: [],
        verificationNotes: '',
        workflowStage: 0, // Before submission
        slaStatus: 'N/A',
        auditTrail: [],
    },
    {
        id: 'CLM007',
        policyId: 'POL102',
        policyholderName: 'Bob Williams',
        type: 'Liability Claim',
        description: 'Visitor slipped on wet floor.',
        amount: 7000.00,
        submissionDate: '2023-10-27',
        status: CLAIM_STATUSES.VERIFICATION_NEEDED,
        documents: ['incident_report.pdf', 'witness_statement.doc'],
        verificationNotes: 'Require further investigation into witness account.',
        workflowStage: 3,
        slaStatus: 'Within SLA',
        auditTrail: [
            { timestamp: '2023-10-27T10:00:00Z', user: 'Bob Williams', action: 'Claim Submitted' },
            { timestamp: '2023-10-28T09:30:00Z', user: 'Claims Officer', action: 'Review Initiated' },
            { timestamp: '2023-10-28T15:00:00Z', user: 'Claims Officer', action: 'Marked for Verification' },
        ],
    },
];

const dummyPoliciesData = [
    {
        id: 'POL101',
        policyholderName: 'Alice Johnson',
        type: 'Comprehensive Auto',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
        status: 'Active',
        premium: 1200.00,
    },
    {
        id: 'POL102',
        policyholderName: 'Bob Williams',
        type: 'Homeowners',
        startDate: '2022-06-15',
        endDate: '2023-06-15',
        status: 'Renewed',
        premium: 2500.00,
    },
    {
        id: 'POL103',
        policyholderName: 'Carol White',
        type: 'Basic Health',
        startDate: '2023-03-01',
        endDate: '2024-03-01',
        status: 'Active',
        premium: 800.00,
    },
    {
        id: 'POL104',
        policyholderName: 'David Green',
        type: 'Property',
        startDate: '2023-05-20',
        endDate: '2024-05-20',
        status: 'Active',
        premium: 1800.00,
    },
    {
        id: 'POL105',
        policyholderName: 'Eve Brown',
        type: 'Travel',
        startDate: '2023-10-28',
        endDate: '2023-11-10',
        status: 'Active',
        premium: 150.00,
    },
];

const dummyAuditLogs = [
    { id: 'AL001', timestamp: '2023-11-01T09:30:00Z', user: 'Admin User', role: 'ADMIN', action: 'User "Bob Williams" role updated to Claims Officer' },
    { id: 'AL002', timestamp: '2023-11-01T09:25:00Z', user: 'Claims Officer', role: 'CLAIMS_OFFICER', action: 'Claim CLM001 approved' },
    { id: 'AL003', timestamp: '2023-10-31T14:00:00Z', user: 'Finance Team', role: 'FINANCE', action: 'Claim CLM004 settlement processed' },
    { id: 'AL004', timestamp: '2023-10-30T11:00:00Z', user: 'Policyholder', role: 'POLICYHOLDER', action: 'Claim CLM005 submitted' },
    { id: 'AL005', timestamp: '2023-10-29T16:00:00Z', user: 'Admin User', role: 'ADMIN', action: 'Policy POL104 reviewed' },
];

const currentUserData = {
    id: 'USR001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: ROLES.ADMIN, // Change this to test different roles: ADMIN, CLAIMS_OFFICER, FINANCE, POLICYHOLDER
};

const userSettingsData = {
    theme: 'light',
    notifications: true,
    savedViews: [
        { id: 'sv1', name: 'My Open Claims', icon: '✨' },
        { id: 'sv2', name: 'Claims Awaiting Verification', icon: '🔍' },
    ],
};

const CLAIM_WORKFLOW_STAGES = [
    { label: 'Submitted', role: ROLES.POLICYHOLDER },
    { label: 'Under Review', role: ROLES.CLAIMS_OFFICER },
    { label: 'Verification Needed', role: ROLES.CLAIMS_OFFICER },
    { label: 'Approved/Rejected', role: ROLES.CLAIMS_OFFICER },
    { label: 'Settled', role: ROLES.FINANCE },
];

// --- Core App Component ---
function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [claims, setClaims] = useState(dummyClaimsData);
    const [policies, setPolicies] = useState(dummyPoliciesData);
    const [currentUser, setCurrentUser] = useState(currentUserData);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Navigation handler
    const navigate = (screenName, params = {}) => {
        setView({ screen: screenName, params: params });
        setShowSuggestions(false); // Hide search suggestions on navigation
    };

    // Logout handler
    const handleLogout = () => {
        // In a real app, this would clear session, redirect to login, etc.
        console.log('User logged out.');
        setCurrentUser(null); // Simulate logout
        navigate('LOGIN'); // Assuming a login screen
    };

    // Dummy form submission handler
    const handleSubmitClaim = (updatedClaim) => {
        setClaims(prevClaims => {
            const index = prevClaims.findIndex(c => c.id === updatedClaim.id);
            if (index > -1) {
                // Update existing claim immutably
                return [
                    ...prevClaims.slice(0, index),
                    updatedClaim,
                    ...prevClaims.slice(index + 1),
                ];
            } else {
                // Add new claim immutably
                return [...prevClaims, { ...updatedClaim, id: `CLM${String(prevClaims.length + 1).padStart(3, '0')}` }];
            }
        });
        navigate('CLAIM_DETAILS', { claimId: updatedClaim.id });
    };

    // Global Search Logic
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 2) {
            const filteredClaims = claims?.filter(claim =>
                claim.id?.toLowerCase().includes(term.toLowerCase()) ||
                claim.policyholderName?.toLowerCase().includes(term.toLowerCase()) ||
                claim.type?.toLowerCase().includes(term.toLowerCase())
            ).map(claim => ({ type: 'claim', id: claim.id, name: `${claim.type} for ${claim.policyholderName}` }));

            const filteredPolicies = policies?.filter(policy =>
                policy.id?.toLowerCase().includes(term.toLowerCase()) ||
                policy.policyholderName?.toLowerCase().includes(term.toLowerCase()) ||
                policy.type?.toLowerCase().includes(term.toLowerCase())
            ).map(policy => ({ type: 'policy', id: policy.id, name: `${policy.type} for ${policy.policyholderName}` }));

            setSearchResults([...(filteredClaims || []), ...(filteredPolicies || [])]);
            setShowSuggestions(true);
        } else {
            setSearchResults([]);
            setShowSuggestions(false);
        }
    };

    const handleSearchSelect = (result) => {
        if (result?.type === 'claim') {
            navigate('CLAIM_DETAILS', { claimId: result.id });
        } else if (result?.type === 'policy') {
            navigate('POLICY_DETAILS', { policyId: result.id });
        }
        setSearchTerm('');
        setShowSuggestions(false);
    };

    // RBAC functions
    const hasRole = (roles) => currentUser?.role && roles.includes(currentUser.role);
    const canViewClaims = hasRole([ROLES.ADMIN, ROLES.CLAIMS_OFFICER, ROLES.FINANCE, ROLES.POLICYHOLDER]);
    const canManageClaims = hasRole([ROLES.ADMIN, ROLES.CLAIMS_OFFICER]);
    const canViewPolicies = hasRole([ROLES.ADMIN, ROLES.CLAIMS_OFFICER, ROLES.POLICYHOLDER]);
    const canViewFinance = hasRole([ROLES.ADMIN, ROLES.FINANCE]);
    const canViewAuditLogs = hasRole([ROLES.ADMIN]);
    const canViewSettings = hasRole([ROLES.ADMIN, ROLES.CLAIMS_OFFICER, ROLES.FINANCE, ROLES.POLICYHOLDER]);

    // Helper Components (defined within App for scope)
    const Breadcrumbs = ({ path }) => (
        <div className="breadcrumbs">
            <span onClick={() => navigate('DASHBOARD')}>Dashboard</span>
            {path.map((item, index) => (
                <React.Fragment key={item?.label || index}>
                    {' > '}
                    {index < path.length - 1 ? (
                        <span onClick={() => navigate(item.screen, item.params)}>{item.label}</span>
                    ) : (
                        <strong>{item.label}</strong>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const ClaimCard = ({ claim }) => {
        const statusClass = `status-${claim?.status?.toLowerCase()?.replace(/_/g, '-')}`;
        const statusBgClass = `status-${claim?.status?.toLowerCase()?.replace(/_/g, '-')}-bg`;
        const pulseClass = (claim?.status === CLAIM_STATUSES.SUBMITTED || claim?.status === CLAIM_STATUSES.UNDER_REVIEW) ? 'pulse-animation' : '';

        return (
            <div
                className={`card ${statusClass} ${pulseClass}`}
                onClick={() => navigate('CLAIM_DETAILS', { claimId: claim?.id })}
                style={{ cursor: 'pointer' }}
            >
                <h3 className="card-title">{claim?.type} - {claim?.id}</h3>
                <p className="card-meta">Policyholder: {claim?.policyholderName}</p>
                <p className="card-meta">Amount: ${claim?.amount?.toFixed(2)}</p>
                <p className="card-meta">Submitted: {claim?.submissionDate}</p>
                <div className={`card-status ${statusBgClass}`}>
                    {CLAIM_STATUS_MAPPING[claim?.status] || claim?.status}
                </div>
            </div>
        );
    };

    const PolicyCard = ({ policy }) => {
        return (
            <div
                className="card"
                onClick={() => navigate('POLICY_DETAILS', { policyId: policy?.id })}
                style={{ cursor: 'pointer', borderLeftColor: 'var(--color-info)' }}
            >
                <h3 className="card-title">{policy?.type} - {policy?.id}</h3>
                <p className="card-meta">Policyholder: {policy?.policyholderName}</p>
                <p className="card-meta">Period: {policy?.startDate} to {policy?.endDate}</p>
                <p className="card-meta">Status: {policy?.status}</p>
                <div className="card-status" style={{ backgroundColor: 'var(--color-info)' }}>
                    {policy?.status}
                </div>
            </div>
        );
    };

    const NoDataPlaceholder = ({ message, actionText, onAction }) => (
        <div className="no-data-placeholder">
            <img src="https://via.placeholder.com/150/f8f9fa/6c757d?text=No+Data" alt="No data illustration" />
            <h3>{message || 'No Data Found'}</h3>
            <p>It looks like there's nothing here yet.</p>
            {actionText && onAction && (
                <button className="btn btn-primary" onClick={onAction}>{actionText}</button>
            )}
        </div>
    );

    const renderScreen = () => {
        switch (view.screen) {
            case 'DASHBOARD':
                const kpiClaimsApproved = claims?.filter(c => c.status === CLAIM_STATUSES.APPROVED)?.length || 0;
                const kpiClaimsPending = claims?.filter(c => (c.status === CLAIM_STATUSES.UNDER_REVIEW || c.status === CLAIM_STATUSES.VERIFICATION_NEEDED))?.length || 0;
                const kpiTotalClaims = claims?.length || 0;
                const kpiAvgSettlementTime = '5 days'; // Dummy KPI

                const recentActivities = dummyAuditLogs.filter(log =>
                    (currentUser?.role === ROLES.ADMIN) ||
                    (currentUser?.role === ROLES.CLAIMS_OFFICER && (log?.action?.includes('Claim') || log?.action?.includes('Policy'))) ||
                    (currentUser?.role === ROLES.FINANCE && log?.action?.includes('settlement')) ||
                    (currentUser?.role === ROLES.POLICYHOLDER && log?.user === currentUser?.name)
                ).slice(0, 5);


                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>Dashboard</h2>
                            <div className="flex-gap-md">
                                <button className="btn btn-outline-primary">Export Report</button>
                                <button className="btn btn-primary pulse-animation">Live Refresh</button>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <h3>Claims Approved</h3>
                                <p className="kpi-value">{kpiClaimsApproved}</p>
                                <p className="kpi-description">Total claims successfully approved.</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Claims Under Review</h3>
                                <p className="kpi-value">{kpiClaimsPending}</p>
                                <p className="kpi-description">Claims requiring immediate attention.</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Total Claims</h3>
                                <p className="kpi-value">{kpiTotalClaims}</p>
                                <p className="kpi-description">All claims submitted to date.</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Avg. Settlement Time</h3>
                                <p className="kpi-value">{kpiAvgSettlementTime}</p>
                                <p className="kpi-description">Average time from submission to settlement.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
                            <div className="full-screen-page">
                                <h3>Claim Status Overview</h3>
                                <div className="chart-placeholder">Bar/Donut Chart for Claim Status Distribution</div>
                                <div className="margin-top-md flex-gap-md">
                                    <button className="btn btn-outline-primary">View Full Report</button>
                                    <button className="btn btn-secondary">Export Chart</button>
                                </div>
                            </div>
                            <div className="full-screen-page recent-activities">
                                <h3>Recent Activities</h3>
                                <ul>
                                    {(recentActivities && recentActivities.length > 0) ? (
                                        recentActivities.map(log => (
                                            <li key={log?.id}>
                                                <strong>{new Date(log?.timestamp).toLocaleDateString()} {new Date(log?.timestamp).toLocaleTimeString()}:</strong> {log?.action} by {log?.user}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No recent activities.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'CLAIMS_LIST':
                const filteredClaims = claims?.filter(claim =>
                    (claim?.policyholderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    claim?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    claim?.type?.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>Claims Management</h2>
                            <div className="flex-gap-md">
                                <button className="btn btn-outline-primary">Filters</button>
                                <button className="btn btn-outline-primary">Saved Views</button>
                                {canManageClaims && <button className="btn btn-primary" onClick={() => navigate('CLAIM_EDIT', { claimId: 'new' })}>New Claim</button>}
                            </div>
                        </div>
                        <Breadcrumbs path={[{ label: 'Claims List', screen: 'CLAIMS_LIST' }]} />

                        <div className="card-grid">
                            {(filteredClaims && filteredClaims.length > 0) ? (
                                filteredClaims.map(claim => (
                                    <ClaimCard key={claim?.id} claim={claim} />
                                ))
                            ) : (
                                <div style={{gridColumn: '1 / -1'}}>
                                    <NoDataPlaceholder message="No claims match your search." actionText="Clear Search" onAction={() => setSearchTerm('')} />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'CLAIM_DETAILS':
                const claimId = view.params?.claimId;
                const claim = claims?.find(c => c.id === claimId);
                const relatedPolicy = policies?.find(p => p.id === claim?.policyId);

                if (!claim) {
                    return (
                        <div className="full-screen-page">
                            <NoDataPlaceholder message="Claim not found." actionText="Go to Claims List" onAction={() => navigate('CLAIMS_LIST')} />
                        </div>
                    );
                }

                const currentWorkflowStage = CLAIM_WORKFLOW_STAGES.findIndex(stage => CLAIM_STATUS_MAPPING[claim?.status]?.includes(stage.label)) + 1;

                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>Claim Details: {claim?.id}</h2>
                            <div className="flex-gap-md">
                                {canManageClaims && <button className="btn btn-secondary" onClick={() => navigate('CLAIM_EDIT', { claimId: claim?.id })}>Edit Claim</button>}
                                {canManageClaims && <button className="btn btn-primary">Advance Workflow</button>}
                            </div>
                        </div>
                        <Breadcrumbs path={[{ label: 'Claims List', screen: 'CLAIMS_LIST' }, { label: `Claim ${claim?.id} Details` }]} />

                        <div className="detail-section">
                            <h3>Workflow Tracker</h3>
                            <div className="workflow-tracker">
                                {CLAIM_WORKFLOW_STAGES.map((stage, index) => (
                                    <div
                                        key={index}
                                        className={`workflow-stage 
                                            ${(index + 1) < currentWorkflowStage ? 'completed' : ''} 
                                            ${(index + 1) === currentWorkflowStage ? 'active' : ''}
                                            ${claim?.slaStatus === 'Breached' && (index + 1) === currentWorkflowStage ? 'sla-breach' : ''}
                                        `}
                                    >
                                        <div className="workflow-stage-icon">{(index + 1)}</div>
                                        <div className="workflow-stage-label">{stage.label}</div>
                                        {((index + 1) === currentWorkflowStage) && claim?.slaStatus !== 'N/A' && (
                                            <div className="sla-info">SLA: {claim?.slaStatus}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Claim Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item"><span>ID:</span><span>{claim?.id}</span></div>
                                <div className="detail-item"><span>Type:</span><span>{claim?.type}</span></div>
                                <div className="detail-item"><span>Policyholder:</span><span>{claim?.policyholderName}</span></div>
                                <div className="detail-item"><span>Amount:</span><span>${claim?.amount?.toFixed(2)}</span></div>
                                <div className="detail-item"><span>Status:</span><span style={{color: CLAIM_STATUS_COLORS[claim?.status]}}>{CLAIM_STATUS_MAPPING[claim?.status]}</span></div>
                                <div className="detail-item"><span>Submission Date:</span><span>{claim?.submissionDate}</span></div>
                                <div className="detail-item"><span>Description:</span><span>{claim?.description}</span></div>
                                <div className="detail-item"><span>Verification Notes:</span><span>{claim?.verificationNotes || 'N/A'}</span></div>
                            </div>
                        </div>

                        {relatedPolicy && (
                            <div className="detail-section">
                                <h3>Related Policy ({relatedPolicy?.id})</h3>
                                <div className="detail-grid">
                                    <div className="detail-item"><span>Policy Type:</span><span>{relatedPolicy?.type}</span></div>
                                    <div className="detail-item"><span>Start Date:</span><span>{relatedPolicy?.startDate}</span></div>
                                    <div className="detail-item"><span>End Date:</span><span>{relatedPolicy?.endDate}</span></div>
                                    <div className="detail-item"><span>Status:</span><span>{relatedPolicy?.status}</span></div>
                                </div>
                                <button
                                    className="btn btn-outline-primary margin-top-md"
                                    onClick={() => navigate('POLICY_DETAILS', { policyId: relatedPolicy?.id })}
                                >
                                    View Policy Details
                                </button>
                            </div>
                        )}

                        <div className="detail-section">
                            <h3>Supporting Documents</h3>
                            {(claim?.documents && claim?.documents.length > 0) ? (
                                <ul>
                                    {claim.documents.map((doc, index) => (
                                        <li key={index} className="detail-item" style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)'}}>
                                            <span>📄 {doc}</span>
                                            <button className="btn btn-outline-primary" style={{padding: 'var(--spacing-xxs) var(--spacing-sm)', fontSize: 'var(--font-size-sm)'}}>Preview</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No documents uploaded.</p>
                            )}
                        </div>

                        <div className="detail-section">
                            <h3>Audit Trail</h3>
                            {(claim?.auditTrail && claim?.auditTrail.length > 0) ? (
                                <ul style={{listStyle: 'none'}}>
                                    {claim.auditTrail.map((log, index) => (
                                        <li key={index} style={{marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)'}}>
                                            <strong>{new Date(log?.timestamp)?.toLocaleString()}:</strong> {log?.action} by {log?.user}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No audit entries for this claim.</p>
                            )}
                        </div>
                    </div>
                );

            case 'CLAIM_EDIT':
                const claimToEditId = view.params?.claimId;
                const isNewClaim = claimToEditId === 'new';
                const claimToEdit = isNewClaim ? {} : claims?.find(c => c.id === claimToEditId);

                const [formData, setFormData] = useState({
                    id: claimToEdit?.id || '',
                    policyId: claimToEdit?.policyId || '',
                    policyholderName: claimToEdit?.policyholderName || '',
                    type: claimToEdit?.type || '',
                    description: claimToEdit?.description || '',
                    amount: claimToEdit?.amount || 0,
                    submissionDate: claimToEdit?.submissionDate || new Date().toISOString().split('T')[0],
                    status: claimToEdit?.status || CLAIM_STATUSES.PENDING_SUBMISSION,
                    documents: claimToEdit?.documents || [],
                    verificationNotes: claimToEdit?.verificationNotes || '',
                    workflowStage: claimToEdit?.workflowStage || 0,
                    slaStatus: claimToEdit?.slaStatus || 'N/A',
                    auditTrail: claimToEdit?.auditTrail || [],
                });

                const handleChange = (e) => {
                    const { name, value } = e.target;
                    setFormData(prev => ({ ...prev, [name]: value }));
                };

                const handleFileChange = (e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData(prev => ({
                        ...prev,
                        documents: [...(prev?.documents || []), ...files.map(f => f.name)], // In real app, upload and get URLs
                    }));
                };

                const localHandleSubmit = (e) => {
                    e.preventDefault();
                    // Basic validation
                    if (!formData.policyId || !formData.policyholderName || !formData.type || !formData.amount) {
                        alert('Please fill in all mandatory fields.');
                        return;
                    }
                    handleSubmitClaim(formData);
                };

                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>{isNewClaim ? 'Submit New Claim' : `Edit Claim: ${claimToEdit?.id}`}</h2>
                        </div>
                        <Breadcrumbs path={[
                            { label: 'Claims List', screen: 'CLAIMS_LIST' },
                            { label: isNewClaim ? 'Submit New Claim' : `Edit Claim ${claimToEdit?.id}` }
                        ]} />

                        <form onSubmit={localHandleSubmit} style={{maxWidth: '800px'}}>
                            <div className="detail-grid">
                                <div className="form-group">
                                    <label htmlFor="policyId">Policy ID *</label>
                                    <input type="text" id="policyId" name="policyId" value={formData?.policyId || ''} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="policyholderName">Policyholder Name *</label>
                                    <input type="text" id="policyholderName" name="policyholderName" value={formData?.policyholderName || ''} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">Claim Type *</label>
                                    <input type="text" id="type" name="type" value={formData?.type || ''} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="amount">Amount *</label>
                                    <input type="number" id="amount" name="amount" value={formData?.amount || 0} onChange={handleChange} required min="0" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="submissionDate">Submission Date (Auto-populated)</label>
                                    <input type="date" id="submissionDate" name="submissionDate" value={formData?.submissionDate || ''} readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status (Read-only for most roles)</label>
                                    <select id="status" name="status" value={formData?.status || ''} onChange={handleChange} disabled={!canManageClaims}>
                                        {Object.values(CLAIM_STATUSES).map(statusKey => (
                                            <option key={statusKey} value={statusKey}>{CLAIM_STATUS_MAPPING[statusKey]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" value={formData?.description || ''} onChange={handleChange}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="verificationNotes">Verification Notes</label>
                                <textarea id="verificationNotes" name="verificationNotes" value={formData?.verificationNotes || ''} onChange={handleChange}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="documents">Upload Documents</label>
                                <input type="file" id="documents" name="documents" multiple onChange={handleFileChange} />
                                {formData?.documents?.length > 0 && (
                                    <div style={{marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-dark)'}}>
                                        Uploaded: {formData.documents.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    {isNewClaim ? 'Submit Claim' : 'Save Changes'}
                                </button>
                                <button type="button" className="btn btn-outline-primary" onClick={() => navigate('CLAIMS_LIST')}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'POLICIES_LIST':
                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>Policies Overview</h2>
                            <div className="flex-gap-md">
                                <button className="btn btn-outline-primary">Filters</button>
                                <button className="btn btn-outline-primary">Saved Views</button>
                            </div>
                        </div>
                        <Breadcrumbs path={[{ label: 'Policies List', screen: 'POLICIES_LIST' }]} />

                        <div className="card-grid">
                            {(policies && policies.length > 0) ? (
                                policies.map(policy => (
                                    <PolicyCard key={policy?.id} policy={policy} />
                                ))
                            ) : (
                                <div style={{gridColumn: '1 / -1'}}>
                                    <NoDataPlaceholder message="No policies available." />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'POLICY_DETAILS':
                const policyId = view.params?.policyId;
                const policy = policies?.find(p => p.id === policyId);
                const associatedClaims = claims?.filter(c => c.policyId === policyId);

                if (!policy) {
                    return (
                        <div className="full-screen-page">
                            <NoDataPlaceholder message="Policy not found." actionText="Go to Policies List" onAction={() => navigate('POLICIES_LIST')} />
                        </div>
                    );
                }

                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>Policy Details: {policy?.id}</h2>
                            <button className="btn btn-secondary">Edit Policy</button>
                        </div>
                        <Breadcrumbs path={[{ label: 'Policies List', screen: 'POLICIES_LIST' }, { label: `Policy ${policy?.id} Details` }]} />

                        <div className="detail-section">
                            <h3>Policy Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item"><span>ID:</span><span>{policy?.id}</span></div>
                                <div className="detail-item"><span>Policyholder:</span><span>{policy?.policyholderName}</span></div>
                                <div className="detail-item"><span>Type:</span><span>{policy?.type}</span></div>
                                <div className="detail-item"><span>Start Date:</span><span>{policy?.startDate}</span></div>
                                <div className="detail-item"><span>End Date:</span><span>{policy?.endDate}</span></div>
                                <div className="detail-item"><span>Status:</span><span>{policy?.status}</span></div>
                                <div className="detail-item"><span>Premium:</span><span>${policy?.premium?.toFixed(2)}</span></div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Associated Claims</h3>
                            {(associatedClaims && associatedClaims.length > 0) ? (
                                <div className="card-grid" style={{gridTemplateColumns: '1fr', gap: 'var(--spacing-sm)'}}>
                                    {associatedClaims.map(claim => (
                                        <ClaimCard key={claim?.id} claim={claim} />
                                    ))}
                                </div>
                            ) : (
                                <p>No claims associated with this policy.</p>
                            )}
                        </div>
                    </div>
                );

            case 'AUDIT_LOGS':
                // Role-based visibility for logs (example: only ADMIN can see all logs)
                const visibleAuditLogs = currentUser?.role === ROLES.ADMIN
                    ? dummyAuditLogs
                    : dummyAuditLogs?.filter(log => log?.role === currentUser?.role || log?.user === currentUser?.name);

                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>Audit Logs</h2>
                            <button className="btn btn-outline-primary">Export Logs</button>
                        </div>
                        <Breadcrumbs path={[{ label: 'Audit Logs', screen: 'AUDIT_LOGS' }]} />

                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 'var(--spacing-md)'}}>
                                <thead>
                                    <tr style={{backgroundColor: 'var(--color-background-light)', textAlign: 'left'}}>
                                        <th style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)'}}>Timestamp</th>
                                        <th style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)'}}>User</th>
                                        <th style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)'}}>Role</th>
                                        <th style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(visibleAuditLogs && visibleAuditLogs.length > 0) ? (
                                        visibleAuditLogs.map(log => (
                                            <tr key={log?.id}>
                                                <td style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)', fontSize: 'var(--font-size-sm)'}}>{new Date(log?.timestamp)?.toLocaleString()}</td>
                                                <td style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)', fontSize: 'var(--font-size-sm)'}}>{log?.user}</td>
                                                <td style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)', fontSize: 'var(--font-size-sm)'}}>{log?.role}</td>
                                                <td style={{padding: 'var(--spacing-sm)', borderBottom: 'var(--border-width) solid var(--color-border)', fontSize: 'var(--font-size-sm)'}}>{log?.action}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center" style={{padding: 'var(--spacing-md)'}}>No audit logs available for your role.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'USER_SETTINGS':
                return (
                    <div className="full-screen-page">
                        <div className="page-header">
                            <h2>User Settings</h2>
                            <button className="btn btn-primary">Save Settings</button>
                        </div>
                        <Breadcrumbs path={[{ label: 'User Settings', screen: 'USER_SETTINGS' }]} />

                        <div className="detail-section">
                            <h3>Profile Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item"><span>Name:</span><span>{currentUser?.name}</span></div>
                                <div className="detail-item"><span>Email:</span><span>{currentUser?.email}</span></div>
                                <div className="detail-item"><span>Role:</span><span>{currentUser?.role}</span></div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Personalization</h3>
                            <div className="detail-grid">
                                <div className="detail-item"><span>Theme:</span><span>{userSettingsData?.theme} (Light/Dark)</span></div>
                                <div className="detail-item"><span>Notifications:</span><span>{userSettingsData?.notifications ? 'Enabled' : 'Disabled'}</span></div>
                                <div className="detail-item">
                                    <span>Saved Views:</span>
                                    <span>
                                        {(userSettingsData?.savedViews && userSettingsData.savedViews.length > 0) ? (
                                            userSettingsData.savedViews.map(view => (
                                                <span key={view?.id} style={{marginRight: 'var(--spacing-xs)', display: 'inline-block'}}>{view?.icon} {view?.name}</span>
                                            ))
                                        ) : 'None'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="full-screen-page">
                        <NoDataPlaceholder message="Screen not found." actionText="Go to Dashboard" onAction={() => navigate('DASHBOARD')} />
                    </div>
                );
        }
    };

    if (!currentUser) {
        // Simple mock login screen if currentUser is null
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background-light)' }}>
                <div style={{ padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-card-background)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--box-shadow-lg)', textAlign: 'center' }}>
                    <h2>Welcome to Insurance Claim Platform</h2>
                    <p style={{marginTop: 'var(--spacing-sm)'}}>Please select a role to log in:</p>
                    <div style={{marginTop: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)'}}>
                        {Object.values(ROLES).map(role => (
                            <button
                                key={role}
                                className="btn btn-primary"
                                onClick={() => setCurrentUser({ id: `USR-${role.substring(0,3)}`, name: `${role.replace('_', ' ')} User`, email: `${role.toLowerCase()}@example.com`, role: role })}
                            >
                                Log in as {role.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="root">
            <header className="app-header">
                <h1 onClick={() => navigate('DASHBOARD')} style={{cursor: 'pointer'}}>ClaimFlow</h1>
                <nav>
                    <ul>
                        {canViewClaims && <li><a href="#" className={view.screen === 'CLAIMS_LIST' ? 'active' : ''} onClick={() => navigate('CLAIMS_LIST')}>Claims</a></li>}
                        {canViewPolicies && <li><a href="#" className={view.screen === 'POLICIES_LIST' ? 'active' : ''} onClick={() => navigate('POLICIES_LIST')}>Policies</a></li>}
                        {canViewFinance && <li><a href="#" className={view.screen === 'FINANCE_DASHBOARD' ? 'active' : ''} onClick={() => alert('Finance Dashboard Placeholder')}>Finance</a></li>}
                        {canViewAuditLogs && <li><a href="#" className={view.screen === 'AUDIT_LOGS' ? 'active' : ''} onClick={() => navigate('AUDIT_LOGS')}>Audit Logs</a></li>}
                    </ul>
                </nav>
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)'}}>
                    <div className="global-search-container">
                        <input
                            type="text"
                            placeholder="Global Search (Claims, Policies...)"
                            className="global-search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(searchTerm.length > 2)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay hide to allow click
                        />
                        {showSuggestions && searchResults?.length > 0 && (
                            <div className="global-search-suggestions">
                                {searchResults.slice(0, 5).map(result => (
                                    <div key={`${result?.type}-${result?.id}`} onMouseDown={() => handleSearchSelect(result)}>
                                        {result?.type?.toUpperCase()}: {result?.name} ({result?.id})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <span>{currentUser?.name} ({currentUser?.role?.replace('_', ' ')})</span>
                        <div className="user-dropdown">
                            {canViewSettings && <button onClick={() => navigate('USER_SETTINGS')}>Settings</button>}
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="main-content">
                {renderScreen()}
            </main>
        </div>
    );
}

export default App;