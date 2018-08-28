package ru.javabean.minimalg.xauth;

import com.google.common.collect.ImmutableMap;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.ReadOnlyJWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.joda.time.DateTime;

import java.text.ParseException;
import java.util.Map;

public final class AuthUtils {

    private static final JWSHeader JWT_HEADER = new JWSHeader(JWSAlgorithm.HS256);
    private static final String TOKEN_SECRET = "archcommpresentation";

    public static String getSubject(String authHeader) throws ParseException {
        return decodeToken(authHeader).getSubject();
    }

    public static ReadOnlyJWTClaimsSet decodeToken(String authHeader) throws ParseException {
        return SignedJWT.parse(getSerializedToken(authHeader)).getJWTClaimsSet();
    }

    public static Map<String, String> createToken(String host, String user) throws JOSEException {
        JWTClaimsSet claim = new JWTClaimsSet();
        claim.setSubject(user);
        claim.setIssuer(host);
        claim.setIssueTime(DateTime.now().toDate());
        claim.setExpirationTime(DateTime.now().plusDays(14).toDate());

        JWSSigner signer = new MACSigner(TOKEN_SECRET);
        SignedJWT jwt = new SignedJWT(JWT_HEADER, claim);
        jwt.sign(signer);

        return ImmutableMap.of("token", jwt.serialize());
    }

    public static String getSerializedToken(String authHeader) {
        return authHeader.split(" ")[1];
    }
}