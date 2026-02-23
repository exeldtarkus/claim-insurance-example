from .constants import ClaimPermissions, InsurancePermissions

ROLE_PERMISSION_MATRIX: dict[str, set[str]] = {
    "user": {
        ClaimPermissions.CLAIM_CREATE,
        ClaimPermissions.CLAIM_READ,
        ClaimPermissions.CLAIM_SUBMIT,
        InsurancePermissions.INSURANCE_READ,
    },
    "verifier": {
        ClaimPermissions.CLAIM_READ,
        ClaimPermissions.CLAIM_REVIEW,
        InsurancePermissions.INSURANCE_CREATE,
        InsurancePermissions.INSURANCE_READ,
        InsurancePermissions.INSURANCE_UPDATE,
        InsurancePermissions.INSURANCE_DELETE,
    },
    "approver": {
        ClaimPermissions.CLAIM_READ,
        ClaimPermissions.CLAIM_APPROVE,
        ClaimPermissions.CLAIM_REJECT,
        InsurancePermissions.INSURANCE_CREATE,
        InsurancePermissions.INSURANCE_READ,
        InsurancePermissions.INSURANCE_UPDATE,
        InsurancePermissions.INSURANCE_DELETE,
    },
}
