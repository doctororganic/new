# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git ca-certificates && update-ca-certificates
COPY go.mod go.sum ./
COPY vendor ./vendor
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -mod=vendor -a -installsuffix cgo -o main cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates && update-ca-certificates
WORKDIR /root/
COPY --from=builder /app/main ./main
COPY --from=builder /app/.env.example .env

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the application
CMD ["./main"]
