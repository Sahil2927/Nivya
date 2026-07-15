package app.nivya.kyc.service;

import app.nivya.common.domain.KycStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Component
public class AuthServiceClient {

    private final RestClient restClient;

    public AuthServiceClient(@Value("${nivya.auth-service.base-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public void updateKycStatus(UUID userId, KycStatus status) {
        restClient.put()
                .uri("/internal/users/{id}/kyc-status", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("kycStatus", status.name()))
                .retrieve()
                .toBodilessEntity();
    }
}
