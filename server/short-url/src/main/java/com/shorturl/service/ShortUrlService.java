package com.shorturl.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shorturl.entity.ShortUrl;
import com.shorturl.repository.ShortUrlRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ShortUrlService {
    @Autowired
    private ShortUrlRepository shortUrlRepository;

    private static final Duration EXPIRY_DURATION = Duration.ofMinutes(1);
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int SHORT_CODE_LENGTH = 6;
    private final Random random = new Random();

    public ShortUrl createShortUrl(String originalUrl) {
        String shortCode;
        do {
            shortCode = generateShortCode();
        } while (shortUrlRepository.findByShortCode(shortCode) != null);
        ShortUrl shortUrl = new ShortUrl(originalUrl, shortCode);
        return shortUrlRepository.save(shortUrl);
    }

    private String generateShortCode() {
        StringBuilder sb = new StringBuilder(SHORT_CODE_LENGTH);
        for (int i = 0; i < SHORT_CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    public ShortUrl getByShortCode(String shortCode) {
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(shortCode);
        if (shortUrl != null) {
            Duration age = Duration.between(shortUrl.getCreatedAt(), LocalDateTime.now());
            if (age.compareTo(EXPIRY_DURATION) > 0) {
                return null;
            }
        }
        return shortUrl;
    }

    public boolean isExpired(ShortUrl shortUrl) {
        return Duration.between(shortUrl.getCreatedAt(), LocalDateTime.now())
                .compareTo(EXPIRY_DURATION) > 0;
    }
} 