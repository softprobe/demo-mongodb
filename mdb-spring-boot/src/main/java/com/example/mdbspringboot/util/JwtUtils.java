package com.example.mdbspringboot.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

public class JwtUtils {

    private final static long ACCESS_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L;
    private final static long REFRESH_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000L;

    private final static String TOKEN_SECRET = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6";

    public static String makeAccessToken(String username) {
        Date date = new Date(System.currentTimeMillis() + ACCESS_EXPIRE_TIME);
        Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
        return JWT.create()
                .withExpiresAt(date)
                .withClaim("username", username)
                .sign(algorithm);
    }

    public static String makeRefreshToken(String username) {
        Date date = new Date(System.currentTimeMillis() + REFRESH_EXPIRE_TIME);
        Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
        return JWT.create()
                .withExpiresAt(date)
                .withClaim("username", username)
                .sign(algorithm);

    }

    public static boolean verifyToken(String field) {
        if (isEmpty(field)) {
            return false;
        }
        return getToken(field) != null;
    }

    public static String getUserName(String token){
        if (isEmpty(token)) {
            return null;
        }
        try {
            Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
            JWTVerifier build = JWT.require(algorithm).build();
            DecodedJWT verify = build.verify(token);
            return verify.getClaim("username").asString();
        } catch (Exception e) {
            return null;
        }
    }

    private static DecodedJWT getToken(String token) {
        if (isEmpty(token)) {
            return null;
        }
        try {
            Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
            JWTVerifier build = JWT.require(algorithm).build();
            return build.verify(token);
        } catch (Exception e) {
            return null;
        }
    }

    private static boolean isEmpty(String token) {
        return token == null || token.isEmpty();
    }

}
