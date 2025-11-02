package com.revamp.customer.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  @Value("${security.jwt.secret}")
  private String secret;

  @Value("${security.jwt.issuer}")
  private String issuer;

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {

    String auth = req.getHeader("Authorization");
    if (auth != null && auth.startsWith("Bearer ")) {
      String token = auth.substring(7);
      try {
        Claims claims = Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
            .requireIssuer(issuer)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        // verify expiration
        Date exp = claims.getExpiration();
        if (exp != null && exp.before(new Date())) throw new RuntimeException("JWT expired");

        String sub = claims.getSubject(); // userId
        String role = (String) claims.get("role");

        List<GrantedAuthority> authorities = new ArrayList<>();
        if (role != null && !role.isBlank())
          authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

        var authToken = new UsernamePasswordAuthenticationToken(sub, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authToken);
      } catch (Exception ex) {
        SecurityContextHolder.clearContext(); // invalid JWT
      }
    }

    chain.doFilter(req, res);
  }
}
