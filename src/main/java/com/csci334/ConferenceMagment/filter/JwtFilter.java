package com.csci334.ConferenceMagment.filter;

import com.csci334.ConferenceMagment.repository.UserRepository;
import com.csci334.ConferenceMagment.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        //get authorization header and validate
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(!StringUtils.hasText(header) || (StringUtils.hasText(header) && !header.startsWith("Bearer "))){
            chain.doFilter(request,response);
            return;
        }

        // Authorization -> [Bearer], [asdf.12312321341.341234fasdasd.s123123as]
        final String token = header.split(" ")[1].trim();

        // Get user identity and set it on the spring security context
        UserDetails userDetails = userRepo
                .findByUsername(jwtUtil.getUsernameFromToken(token))
                .orElse(null);

        //get jwt token and validate
        if(!jwtUtil.validateToken(token, userDetails)){
            chain.doFilter(request,response);
            return;
        }

        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,null,
                        userDetails == null ?
                                List.of(): userDetails.getAuthorities()
        );
        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        // this is where the authentication happens and the use now valid
        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(request,response);
    }
}
