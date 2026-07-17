package app.nivya.kyc.service.kyc.pan;

import app.nivya.kyc.domain.KycRecord;
import app.nivya.kyc.repository.KycRecordRepository;
import app.nivya.kyc.service.kyc.pan.dto.PanNumberPersistRequest;
import app.nivya.kyc.vendor.KraAdapter;
import app.nivya.kyc.vendor.KraResult;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class PanKycService {

    private final KycRecordRepository kycRecordRepository;
    private final KraAdapter kraAdapter;

    public PanKycService(KycRecordRepository kycRecordRepository, KraAdapter kraAdapter) {
        this.kycRecordRepository = kycRecordRepository;
        this.kraAdapter = kraAdapter;
    }

    public void persistPanNumber(PanNumberPersistRequest panNumberPersistRequest) {
        UUID userId = UUID.fromString(panNumberPersistRequest.userId());
        String panNumber = panNumberPersistRequest.pan().toUpperCase();

        KycRecord kycRecord = createIfNotExists(userId);
        updateKycRecord(kycRecord, panNumberPersistRequest);
        kycRecordRepository.save(kycRecord);
        verifyKra(kycRecord, panNumber);
    }

    private KycRecord createIfNotExists(UUID userId) {
        return kycRecordRepository.findByUserId(userId).orElseGet(() -> {
            KycRecord kycRecord = new KycRecord();
            kycRecord.setUserId(userId);
            return kycRecordRepository.save(kycRecord);
        });
    }

    @Async
    public void verifyKra(KycRecord kycRecord, String panNumber) {
        panNumber = panNumber.toUpperCase();
        KraResult kraResult = kraAdapter.lookup(panNumber);

        kycRecord.setPan(panNumber);
        kycRecord.setKraStatus(kraResult.kraStatus());

        if (kraResult.validated()) {
            kycRecord.setCkycId(kraResult.ckycId());
            kycRecord.setValidatedAt(Instant.now());
        }

        kycRecordRepository.save(kycRecord);
    }

    private void updateKycRecord(KycRecord kycRecord, PanNumberPersistRequest panNumberPersistRequest) {
        kycRecord.setUserId(UUID.fromString(panNumberPersistRequest.userId()));
        kycRecord.setPan(panNumberPersistRequest.pan());
    }
}
