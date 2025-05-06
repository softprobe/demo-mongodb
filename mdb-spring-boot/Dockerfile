FROM eclipse-temurin:21-jre-jammy

COPY target/mdb-*.jar app.jar

# Download the OpenTelemetry Java Agent
# RUN curl -LO \
# https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar

# Download the SoftProbe Java Agent
RUN curl -L -o sp-agent.jar https://softprobe.oss-cn-hangzhou.aliyuncs.com/sp-agent-21.jar

# We also need to set the following environment variables. We'll set them in the Deployment.yaml file in the deployment repository.
# Please see https://github.com/softprobe/deployment-k8s/blob/main/pro/backend/recording/deployment.yaml

# export OTEL_SERVICE_NAME=my-service-name
# export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
# export OTEL_EXPORTER_OTLP_ENDPOINT="https://api.honeycomb.io"
# export OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=ecWFNAhSfmFRrq0RR3tPQK"

ENV SP_SERVICE_NAME="2ae4b9d431dfb747"
ENV SP_STORAGE_SERVICE_HOST="storage-onpremise-gcp.softprobe.ai"
ENV SPRING_DATA_MONGODB_URI="mongodb://localhost:27017/mygrocerylist"

ENTRYPOINT [ "sh", "-c", "java \
-javaagent:sp-agent.jar \
-Dsp.service.name=${SP_SERVICE_NAME} \
-Dsp.storage.service.host=${SP_STORAGE_SERVICE_HOST} \
-Dspring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI} \
-jar app.jar" \
]
