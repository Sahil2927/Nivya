package app.nivya.auth.dto;

import app.nivya.common.domain.KycStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateKycStatusRequest(
        @NotNull KycStatus kycStatus
) {
}
