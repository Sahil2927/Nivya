package app.nivya.auth.controller;

import app.nivya.auth.dto.UpdateKycStatusRequest;
import app.nivya.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/internal")
public class InternalUserController {

    private final UserService userService;

    public InternalUserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/users/{id}/kyc-status")
    public ResponseEntity<Void> updateKycStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateKycStatusRequest request) {
        userService.updateKycStatus(id, request.kycStatus());
        return ResponseEntity.noContent().build();
    }
}
