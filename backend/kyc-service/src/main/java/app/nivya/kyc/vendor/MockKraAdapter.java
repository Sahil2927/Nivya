package app.nivya.kyc.vendor;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "nivya.kra.adapter", havingValue = "mock", matchIfMissing = true)
public class MockKraAdapter implements KraAdapter {

    // PAN prefix reserved for triggering NOT_REGISTERED in tests
    private static final String UNREGISTERED_PREFIX = "ZZZZZ";

    @Override
    public KraResult lookup(String pan) {
        if (pan.startsWith(UNREGISTERED_PREFIX)) {
            return new KraResult(false, "NOT_REGISTERED", null);
        }
        return new KraResult(true, "VALIDATED", "CKYC-MOCK-" + pan.substring(6, 10));
    }
}
