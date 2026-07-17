package app.nivya.kyc.service.kyc.personalDetails.dto;

import java.time.*;

public record PeronsalInformationPersistRequest(
    String UUID,
    String firstName,
    String middleName,
    String lastName,
    LocalDate dateOfBirth,
    String address,
    String city,
    String state,
    String gender
) {
}
