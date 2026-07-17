package app.nivya.kyc.service.kyc.personalDetails;

import java.util.UUID;
import javax.security.auth.callback.Callback;

import org.springframework.stereotype.Service;
import app.nivya.kyc.domain.KycRecord;
import app.nivya.kyc.repository.KycRecordRepository;
import app.nivya.kyc.service.kyc.personalDetails.dto.PeronsalInformationPersistRequest;

@Service
public class PersonalDetailsKycService {
    private final KycRecordRepository kycRecordRepository;
    private KycRecord kycRecord;
    public PersonalDetailsKycService(KycRecordRepository kycRecordRepository) {
        this.kycRecordRepository = kycRecordRepository;
    }

    public void persistInformation(PeronsalInformationPersistRequest personalInformationPersistRequest, Callback callback) {
        kycRecord = kycRecordRepository.findByUserId(UUID.fromString(personalInformationPersistRequest.UUID()))
                .orElseThrow(() -> new RuntimeException("KYC record not found for user ID: " + personalInformationPersistRequest.UUID()));
        updateKycRecord(kycRecord, personalInformationPersistRequest);
        kycRecordRepository.save(kycRecord);
    }

    public void updateKycRecord(KycRecord kycRecord, PeronsalInformationPersistRequest personalInformationPersistRequest) {
        kycRecord.setFirstName(personalInformationPersistRequest.firstName());
        kycRecord.setMiddleName(personalInformationPersistRequest.middleName());
        kycRecord.setLastName(personalInformationPersistRequest.lastName());
        kycRecord.setDateOfBirth(personalInformationPersistRequest.dateOfBirth());
        kycRecord.setAddress(personalInformationPersistRequest.address());
        kycRecord.setCity(personalInformationPersistRequest.city());
        kycRecord.setState(personalInformationPersistRequest.state());
        kycRecord.setGender(personalInformationPersistRequest.gender());
    }
}
