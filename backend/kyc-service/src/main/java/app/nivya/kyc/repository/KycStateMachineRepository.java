package app.nivya.kyc.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import app.nivya.kyc.stateMachine.KycStateMachine;

public interface KycStateMachineRepository extends JpaRepository<KycStateMachine, UUID> {
    Optional<KycStateMachine> findByUserId(UUID userId);
}
