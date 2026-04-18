package com.wd32._5.smart_campus.service; 
import com.wd32._5.smart_campus.entity.Role;
import com.wd32._5.smart_campus.entity.User;
import com.wd32._5.smart_campus.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    // Constructor injection for our database repository
    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Let Spring Security do the heavy lifting of fetching the Google profile
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract the data we need from Google's JSON response
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub"); // 'sub' is Google's unique user ID

        // Check if this user already exists in our PostgreSQL database
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            // If they are new, build a new User entity and save it to the database
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : "Unknown");
            newUser.setProvider("google");
            newUser.setProviderId(providerId);
            newUser.setRole(Role.USER);
            
            userRepository.save(newUser);
        }

        return oAuth2User;
    }
}