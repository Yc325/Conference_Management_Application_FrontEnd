package com.csci334.ConferenceMagment.web;

import com.csci334.ConferenceMagment.domain.User;
import com.csci334.ConferenceMagment.dto.AuthCredentialsRequest;
import com.csci334.ConferenceMagment.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(
//        allowCredentials = "true",
//        origins = "*",
//        allowedHeaders = "*",
//        methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT}
//)
public class AutController {
    @Autowired
    private AuthenticationManager  authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("login")
    public ResponseEntity<?> login (@RequestBody AuthCredentialsRequest request){
        try {
            Authentication authenticate = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getUsername(), request.getPassword()
                            )
                    );

            User user = (User) authenticate.getPrincipal();
            user.setPassword(null);
            HashMap<String, String> jwtToken =  new HashMap<String, String>();
            jwtToken.put("token",jwtUtil.generateToken(user));
            return ResponseEntity.ok()
//                    .body()
////                    .body(jwtUtil.generateToken(user));
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            jwtUtil.generateToken(user)
                    )
                    .body(user);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @GetMapping("validate")
    public ResponseEntity<?> validateToken(@RequestParam String token, @AuthenticationPrincipal User user) {
        try{
            Boolean isTokenValid = jwtUtil.validateToken(token,user);
            return ResponseEntity.ok(isTokenValid);
        }catch (ExpiredJwtException e){
            return ResponseEntity.ok(false);
        }
    }

}
