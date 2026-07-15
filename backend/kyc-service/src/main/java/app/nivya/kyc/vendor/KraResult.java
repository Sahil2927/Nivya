package app.nivya.kyc.vendor;

public record KraResult(boolean validated, String kraStatus, String ckycId) {
}
