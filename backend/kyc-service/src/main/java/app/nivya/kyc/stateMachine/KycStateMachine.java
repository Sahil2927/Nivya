package app.nivya.kyc.stateMachine;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import app.nivya.kyc.domain.KycApplicationStatus;

public class KycStateMachine {
    private static Map<KycApplicationStatus, Set<KycApplicationStatus>> stateTransitions;

    KycStateMachine() {
        stateTransitions = new HashMap<>();
        stateTransitions.put(KycApplicationStatus.PENDING, Set.of(KycApplicationStatus.PAN_VERIFIED, KycApplicationStatus.VALIDATED));
        stateTransitions.put(KycApplicationStatus.PAN_VERIFIED, Set.of(KycApplicationStatus.PERSONAL_DETAILS_COLLECTED));
        stateTransitions.put(KycApplicationStatus.PERSONAL_DETAILS_COLLECTED, Set.of(KycApplicationStatus.DOCUMENTS_UPLOADED));
        stateTransitions.put(KycApplicationStatus.DOCUMENTS_UPLOADED, Set.of(KycApplicationStatus.IPV_COMPLETE));
        stateTransitions.put(KycApplicationStatus.IPV_COMPLETE, Set.of(KycApplicationStatus.SUBMITTED));
        stateTransitions.put(KycApplicationStatus.SUBMITTED, Set.of(KycApplicationStatus.VALIDATED, KycApplicationStatus.REJECTED, KycApplicationStatus.IN_PROGRESS));
    }

    public Set<KycApplicationStatus> getNextState(KycApplicationStatus currentState) {
        Set<KycApplicationStatus> allowedTransitions = stateTransitions.get(currentState);
        if (allowedTransitions != null) {
            return allowedTransitions;
        } else {
            throw new IllegalArgumentException("No available next transitions for the current state: " + currentState);
        }
    }    

    
}
