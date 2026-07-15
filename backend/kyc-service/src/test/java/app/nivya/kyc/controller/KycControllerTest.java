package app.nivya.kyc.controller;

import app.nivya.kyc.dto.KycStatusResponse;
import app.nivya.kyc.domain.KycApplicationStatus;
import app.nivya.kyc.repository.KycRecordRepository;
import app.nivya.kyc.service.AuthServiceClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class KycControllerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("nivya_kyc_test")
            .withUsername("postgres")
            .withPassword("postgres");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @MockBean
    private AuthServiceClient authServiceClient;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private KycRecordRepository kycRecordRepository;

    private static final UUID USER_ID = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        kycRecordRepository.deleteAll();
        doNothing().when(authServiceClient).updateKycStatus(any(), any());
    }

    @Test
    void getStatus_returnsNoPendingForNewUser() {
        HttpHeaders headers = headersWithUserId(USER_ID);

        ResponseEntity<KycStatusResponse> response = restTemplate.exchange(
                "/v1/kyc/status",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                KycStatusResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().kycApplicationStatus()).isEqualTo(KycApplicationStatus.PENDING);
    }

    @Test
    void verifyPan_validPan_returnsValidated() {
        HttpHeaders headers = headersWithUserId(USER_ID);

        ResponseEntity<KycStatusResponse> response = restTemplate.exchange(
                "/v1/kyc/pan",
                HttpMethod.POST,
                new HttpEntity<>(Map.of("pan", "ABCDE1234F"), headers),
                KycStatusResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().kycApplicationStatus()).isEqualTo(KycApplicationStatus.VALIDATED);
        assertThat(response.getBody().ckycId()).startsWith("CKYC-MOCK-");
    }

    @Test
    void verifyPan_unregisteredPan_returnsPanVerified() {
        HttpHeaders headers = headersWithUserId(USER_ID);

        ResponseEntity<KycStatusResponse> response = restTemplate.exchange(
                "/v1/kyc/pan",
                HttpMethod.POST,
                new HttpEntity<>(Map.of("pan", "ZZZZZ1234F"), headers),
                KycStatusResponse.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().kycApplicationStatus()).isEqualTo(KycApplicationStatus.PAN_VERIFIED);
    }

    @Test
    void verifyPan_invalidFormat_returns400() {
        HttpHeaders headers = headersWithUserId(USER_ID);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/v1/kyc/pan",
                HttpMethod.POST,
                new HttpEntity<>(Map.of("pan", "invalid-pan"), headers),
                Void.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getStatus_afterVerification_reflectsUpdatedStatus() {
        HttpHeaders headers = headersWithUserId(USER_ID);

        restTemplate.exchange(
                "/v1/kyc/pan",
                HttpMethod.POST,
                new HttpEntity<>(Map.of("pan", "ABCDE1234F"), headers),
                KycStatusResponse.class
        );

        ResponseEntity<KycStatusResponse> statusResponse = restTemplate.exchange(
                "/v1/kyc/status",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                KycStatusResponse.class
        );

        assertThat(statusResponse.getBody()).isNotNull();
        assertThat(statusResponse.getBody().kycApplicationStatus()).isEqualTo(KycApplicationStatus.VALIDATED);
    }

    private HttpHeaders headersWithUserId(UUID userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId.toString());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
