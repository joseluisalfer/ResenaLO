package principal.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class S3PublicImageService {

    @Value("${app.s3.bucket}")
    private String bucket;

    @Value("${app.s3.region}")
    private String region;

    /**
     * Prefijo recomendado para minimizar riesgos:
     * todo va bajo "public/".
     */
    public String buildKey(String relative) {
        if (relative == null) relative = "";
        relative = relative.replace("\\", "/");
        if (relative.startsWith("/")) relative = relative.substring(1);
        if (relative.startsWith("public/")) return relative;
        return "public/" + relative;
    }

    /**
     * Sube por HTTP PUT sin firmar (requiere bucket policy que permita PutObject público).
     * Devuelve URL pública.
     */
    public String uploadAndGetPublicUrl(String key, byte[] bytes, String contentType) throws IOException {
        if (key == null || key.isBlank()) throw new IOException("Key vacía");
        if (bytes == null) bytes = new byte[0];
        if (contentType == null || contentType.isBlank()) contentType = "application/octet-stream";

        String encodedKey = encodeS3Key(key);
        String url = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + encodedKey;

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .PUT(HttpRequest.BodyPublishers.ofByteArray(bytes))
                .header("Content-Type", contentType)
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> resp;
        try {
            resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Interrumpido subiendo a S3", e);
        }

        int code = resp.statusCode();
        if (code < 200 || code >= 300) {
            throw new IOException("Error subiendo a S3 (HTTP " + code + "): " + resp.body());
        }

        return url;
    }

    /**
     * Encode “por segmentos” para mantener las / y codificar espacios, etc.
     */
    private String encodeS3Key(String key) {
        String[] parts = key.split("/");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            if (i > 0) sb.append("/");
            sb.append(URLEncoder.encode(parts[i], StandardCharsets.UTF_8)
                    .replace("+", "%20"));
        }
        return sb.toString();
    }
}