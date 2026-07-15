package app.nivya.kyc.service;

import app.nivya.common.domain.KycStatus;
import app.nivya.kyc.domain.KycApplicationStatus;
import app.nivya.kyc.domain.KycRecord;
import app.nivya.kyc.dto.KycStatusResponse;
import app.nivya.kyc.repository.KycRecordRepository;
import app.nivya.kyc.vendor.KraResult;
import app.nivya.kyc.vendor.MockKraAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KycServiceTest {

    @Mock
    private KycRecordRepository kycRecordRepository;

    @Mock
    private AuthServiceClient authServiceClient;

    private KycService kycService;

    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        kycService = new KycService(kycRecordRepository, new MockKraAdapter(), authServiceClient);
    }

    @Test
    void getStatus_returnsPendingWhenNoRecord() {
        when(kycRecordRepository.findByUserId(userId)).thenReturn(Optional.empty());

        KycStatusResponse response = kycService.getStatus(userId);

        assertThat(response.kycApplicationStatus()).isEqualTo(KycApplicationStatus.PENDING);
        assertThat(response.ckycId()).isNull();
    }

    @Test
    void getStatus_returnsExistingRecord() {
        KycRecord record = existingRecord(KycApplicationStatus.PAN_VERIFIED, null);
        when(kycRecordRepository.findByUserId(userId)).thenReturn(Optional.of(record));

        KycStatusResponse response = kycService.getStatus(userId);

        assertThat(response.kycApplicationStatus()).isEqualTo(KycApplicationStatus.PAN_VERIFIED);
    }

    @Test
    void verifyPan_validatedKraResult_setsValidatedAndNotifiesAuth() {
        when(kycRecordRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(kycRecordRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // MockKraAdapter returns validated=true for any PAN not starting with ZZZZZ
        KycStatusResponse response = kycService.verifyPan(userId, "ABCDE1234F");

        assertThat(response.kycApplicationStatus()).isEqualTo(KycApplicationStatus.VALIDATED);
        assertThat(response.ckycId()).startsWith("CKYC-MOCK-");
        verify(authServiceClient).updateKycStatus(userId, KycStatus.registered);
    }

    @Test
    void verifyPan_unregisteredPan_setsPanVerifiedAndSkipsAuthNotification() {
        when(kycRecordRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(kycRecordRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // PAN starting with ZZZZZ triggers NOT_REGISTERED in MockKraAdapter
        KycStatusResponse response = kycService.verifyPan(userId, "ZZZZZ1234F");

        assertThat(response.kycApplicationStatus()).isEqualTo(KycApplicationStatus.PAN_VERIFIED);
        assertThat(response.ckycId()).isNull();
        verifyNoInteractions(authServiceClient);
    }

    @Test
    void verifyPan_alreadyValidated_skipsKraLookup() {
        KycRecord record = existingRecord(KycApplicationStatus.VALIDATED, "CKYC-EXISTING");
        when(kycRecordRepository.findByUserId(userId)).thenReturn(Optional.of(record));

        KycStatusResponse response = kycService.verifyPan(userId, "ABCDE1234F");

        assertThat(response.kycApplicationStatus()).isEqualTo(KycApplicationStatus.VALIDATED);
        assertThat(response.ckycId()).isEqualTo("CKYC-EXISTING");
        verifyNoInteractions(authServiceClient);
        verify(kycRecordRepository, never()).save(any());
    }

    private KycRecord existingRecord(KycApplicationStatus status, String ckycId) {
        KycRecord record = new KycRecord();
        record.setUserId(userId);
        record.setApplicationStatus(status);
        record.setCkycId(ckycId);
        return record;
    }
}
