package com.example.mdbspringboot.model;

public class HealthResponse {
    private ResponseStatusType responseStatusType;
    private String body;

    public ResponseStatusType getResponseStatusType() {
        return responseStatusType;
    }

    public void setResponseStatusType(ResponseStatusType responseStatusType) {
        this.responseStatusType = responseStatusType;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public static class ResponseStatusType {
        private int responseCode;
        private String responseDesc;
        private long timestamp;

        public int getResponseCode() {
            return responseCode;
        }

        public void setResponseCode(int responseCode) {
            this.responseCode = responseCode;
        }

        public String getResponseDesc() {
            return responseDesc;
        }

        public void setResponseDesc(String responseDesc) {
            this.responseDesc = responseDesc;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
