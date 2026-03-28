# Resilience4j YAML Configuration Templates

## 1. BOOKING SERVICE
File: `bookingService/src/main/resources/application.yaml`

Add the following after the `feign` section:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, circuitbreaker, circuitbreakers
  endpoint:
    health:
      show-details: always
  health:
    circuitbreakers:
      enabled: true


resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 15000
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
    instances:
      hotelServiceCB:
        baseConfig: default

  retry:
    configs:
      default:
        maxAttempts: 3
        waitDuration: 1000
        retryExceptions:
          - java.net.ConnectException
          - java.io.IOException
    instances:
      hotelServiceRetry:
        baseConfig: default

  timelimiter:
    configs:
      default:
        timeoutDuration: 3s
    instances:
      hotelServiceTL:
        baseConfig: default
```

---

## 2. PAYMENT SERVICE
File: `paymentService/src/main/resources/application.yaml`

Add the following after the `feign` section:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, circuitbreaker, circuitbreakers
  endpoint:
    health:
      show-details: always
  health:
    circuitbreakers:
      enabled: true


resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 15000
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
    instances:
      bookingServiceCB:
        baseConfig: default

  retry:
    configs:
      default:
        maxAttempts: 3
        waitDuration: 1000
        retryExceptions:
          - java.net.ConnectException
          - java.io.IOException
    instances:
      bookingServiceRetry:
        baseConfig: default

  timelimiter:
    configs:
      default:
        timeoutDuration: 3s
    instances:
      bookingServiceTL:
        baseConfig: default
```

---

## 3. HOTEL SERVICE
File: `hotelService/src/main/resources/application.yaml`

Add the following after the `gemini` section:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, circuitbreaker, circuitbreakers
  endpoint:
    health:
      show-details: always
  health:
    circuitbreakers:
      enabled: true


resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 15000
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
    instances:
      hotelSearchCB:
        baseConfig: default
      reviewSearchCB:
        baseConfig: default

  retry:
    configs:
      default:
        maxAttempts: 3
        waitDuration: 1000
        retryExceptions:
          - java.net.ConnectException
          - java.io.IOException
    instances:
      hotelSearchRetry:
        baseConfig: default

  timelimiter:
    configs:
      default:
        timeoutDuration: 3s
    instances:
      hotelSearchTL:
        baseConfig: default
      reviewSearchTL:
        baseConfig: default

  bulkhead:
    configs:
      default:
        maxConcurrentCalls: 10
        maxWaitDuration: 2s
    instances:
      hotelSearchBulkhead:
        baseConfig: default
      reviewSearchBulkhead:
        baseConfig: default
```

---

## 4. USER SERVICE
File: `userService/src/main/resources/application.yaml`

Add the following after the `app` section:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, circuitbreaker, circuitbreakers
  endpoint:
    health:
      show-details: always
  health:
    circuitbreakers:
      enabled: true


resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 15000
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
    instances:
      hotelClientCB:
        baseConfig: default
      bookingClientCB:
        baseConfig: default

  retry:
    configs:
      default:
        maxAttempts: 3
        waitDuration: 1000
        retryExceptions:
          - java.net.ConnectException
          - java.io.IOException
    instances:
      hotelClientRetry:
        baseConfig: default
      bookingClientRetry:
        baseConfig: default

  timelimiter:
    configs:
      default:
        timeoutDuration: 3s
    instances:
      hotelClientTL:
        baseConfig: default
      bookingClientTL:
        baseConfig: default
```

---

## 5. API GATEWAY
File: `apiGateway/src/main/resources/application.yaml`

Add the following after the `eureka` section:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, ratelimiters
  endpoint:
    health:
      show-details: always


resilience4j:
  ratelimiter:
    configs:
      default:
        registerHealthIndicator: true
        limitRefreshPeriod: 1m
        limitForPeriod: 100
        timeoutDuration: 5s
    instances:
      authRateLimiter:
        baseConfig: default
        limitForPeriod: 10
        limitRefreshPeriod: 1m
```

---

## Parameter Explanations

### Circuit Breaker Parameters
- `slidingWindowSize: 10` → Evaluate last 10 calls
- `failureRateThreshold: 50` → Open if 50%+ fail
- `waitDurationInOpenState: 15000` → Wait 15 seconds before testing
- `permittedNumberOfCallsInHalfOpenState: 3` → Allow 3 test calls
- `automaticTransitionFromOpenToHalfOpenEnabled: true` → Auto-transition

### Retry Parameters
- `maxAttempts: 3` → Try max 3 times (original + 2 retries)
- `waitDuration: 1000` → Wait 1 second between retries
- `retryExceptions` → Only retry on these exceptions

### Time Limiter Parameters
- `timeoutDuration: 3s` → Abort if request takes > 3 seconds

### Bulkhead Parameters
- `maxConcurrentCalls: 10` → Max 10 concurrent calls
- `maxWaitDuration: 2s` → Max 2 seconds to acquire slot

### Rate Limiter Parameters
- `limitRefreshPeriod: 1m` → Reset limit every 1 minute
- `limitForPeriod: 10` → Allow 10 requests per period
- `timeoutDuration: 5s` → Max 5 seconds to acquire permission

---

## Verification Commands

### Build all services
```bash
cd bookingService && mvn clean compile -DskipTests
cd paymentService && mvn clean compile -DskipTests
cd hotelService && mvn clean compile -DskipTests
cd userService && mvn clean compile -DskipTests
cd apiGateway && mvn clean compile -DskipTests
```

### Check health endpoints (after starting services)
```bash
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
curl http://localhost:8080/actuator/health
```

### Monitor circuit breakers
```bash
curl http://localhost:8083/actuator/circuitbreaker
```

### Check rate limiter
```bash
curl http://localhost:8080/actuator/ratelimiters
```

---

## Tuning Guidelines

### If Circuit Breaker opens too frequently
- Increase `failureRateThreshold` (e.g., 60, 70)
- Increase `slidingWindowSize` (e.g., 15, 20)
- Increase `waitDurationInOpenState` (e.g., 30000, 60000)

### If Retries timeout
- Increase `timeoutDuration` (e.g., 5s, 10s)
- Decrease `maxAttempts` if failures take too long

### If Rate Limiter is too strict
- Increase `limitForPeriod`
- Increase `limitRefreshPeriod`

### If Bulkhead rejects too many calls
- Increase `maxConcurrentCalls`
- Increase `maxWaitDuration`

---

**Last Generated:** March 27, 2026

