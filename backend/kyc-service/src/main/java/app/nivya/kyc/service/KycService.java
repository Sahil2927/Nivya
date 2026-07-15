package app.nivya.kyc.service;

import app.nivya.kyc.domain.KycApplicationStatus;
import app.nivya.kyc.domain.KycRecord;
import app.nivya.kyc.dto.KycStatusResponse;
import app.nivya.kyc.repository.KycRecordRepository;
import app.nivya.common.domain.KycStatus;
import app.nivya.kyc.vendor.KraAdapter;
import app.nivya.kyc.vendor.KraResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class KycService {

    private final KycRecordRepository kycRecordRepository;
    private final KraAdapter kraAdapter;
    private final AuthServiceClient authServiceClient;

    public KycService(KycRecordRepository kycRecordRepository, KraAdapter kraAdapter, AuthServiceClient authServiceClient) {
        this.kycRecordRepository = kycRecordRepository;
        this.kraAdapter = kraAdapter;
        this.authServiceClient = authServiceClient;
    }

    @Transactional(readOnly = true)
    public KycStatusResponse getStatus(UUID userId) {
        return kycRecordRepository.findByUserId(userId)
                .map(this::toResponse)
                .orElse(pendingResponse());
    }

    public KycStatusResponse verifyPan(UUID userId, String panNumber) {
        KycRecord kycRecord = findOrCreate(userId);

        if (kycRecord.getApplicationStatus() == KycApplicationStatus.VALIDATED) {
            return toResponse(kycRecord);
        }

        panNumber = panNumber.toUpperCase();
        KraResult kraResult = kraAdapter.lookup(panNumber);

        if (kraResult.validated()) {
            applyValidation(kycRecord, panNumber, kraResult);
            kycRecordRepository.save(kycRecord);
            authServiceClient.updateKycStatus(userId, KycStatus.registered);
        } else {
            applyPanVerification(kycRecord, panNumber, kraResult);
            kycRecordRepository.save(kycRecord);
        }

        return toResponse(kycRecord);
    }

    private KycRecord findOrCreate(UUID userId) {
        return kycRecordRepository.findByUserId(userId).orElseGet(() -> {
            KycRecord record = new KycRecord();
            record.setUserId(userId);
            return record;
        });
    }

    private void applyValidation(KycRecord kycRecord, String panNumber, KraResult kraResult) {
        kycRecord.setPan(panNumber);
        kycRecord.setApplicationStatus(KycApplicationStatus.VALIDATED);
        kycRecord.setKraStatus(kraResult.kraStatus());
        kycRecord.setCkycId(kraResult.ckycId());
        kycRecord.setValidatedAt(Instant.now());
    }

    private void applyPanVerification(KycRecord kycRecord, String panNumber, KraResult kraResult) {
        kycRecord.setPan(panNumber);
        kycRecord.setApplicationStatus(KycApplicationStatus.PAN_VERIFIED);
        kycRecord.setKraStatus(kraResult.kraStatus());
    }

    private KycStatusResponse toResponse(KycRecord kycRecord) {
        return new KycStatusResponse(kycRecord.getApplicationStatus(), kycRecord.getCkycId());
    }

    private KycStatusResponse pendingResponse() {
        return new KycStatusResponse(KycApplicationStatus.PENDING, null);
    }
}
