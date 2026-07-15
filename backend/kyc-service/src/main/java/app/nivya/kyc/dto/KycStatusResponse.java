package app.nivya.kyc.dto;

import app.nivya.kyc.domain.KycApplicationStatus;

public record KycStatusResponse(KycApplicationStatus kycApplicationStatus, String ckycId) {
}
