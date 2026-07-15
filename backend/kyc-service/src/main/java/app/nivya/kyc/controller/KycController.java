package app.nivya.kyc.controller;

import app.nivya.kyc.dto.KycStatusResponse;
import app.nivya.kyc.dto.VerifyPanRequest;
import app.nivya.kyc.service.KycService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/kyc")
public class KycController {

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @GetMapping("/status")
    public ResponseEntity<KycStatusResponse> getStatus(@RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(kycService.getStatus(userId));
    }

    @PostMapping("/pan")
    public ResponseEntity<KycStatusResponse> verifyPan(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody VerifyPanRequest verifyPanRequest) {
        return ResponseEntity.ok(kycService.verifyPan(userId, verifyPanRequest.pan()));
    }
}
