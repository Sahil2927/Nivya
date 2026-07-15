package app.nivya.kyc.repository;

import app.nivya.kyc.domain.KycRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface KycRecordRepository extends JpaRepository<KycRecord, UUID> {
    Optional<KycRecord> findByUserId(UUID userId);
}
