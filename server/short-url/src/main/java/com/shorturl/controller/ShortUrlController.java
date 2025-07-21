package com.shorturl.controller;

import com.shorturl.entity.ShortUrl;
import com.shorturl.service.ShortUrlService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/short")
@CrossOrigin(origins = "*")
public class ShortUrlController {
    @Autowired
    private ShortUrlService shortUrlService;

    @PostMapping("/generate")
    public ShortUrl generateShortUrl(@RequestBody UrlRequest request) {
        return shortUrlService.createShortUrl(request.getOriginalUrl());
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirectToOriginalUrl(@PathVariable String shortCode) {
        ShortUrl shortUrl = shortUrlService.getByShortCode(shortCode);

        if (shortUrl == null) {
            return ResponseEntity.status(404)
                    .body("The URL does not exist or has expired. <a href='http://localhost:3000'>Create a new one</a>");
        }

        if (shortUrlService.isExpired(shortUrl)) {
            return ResponseEntity.status(410).body("The short URL has expired. <a href='http://localhost:3000'>Generate new URL</a>");
        }

        return ResponseEntity.status(302).header("Location", shortUrl.getOriginalUrl()).build();
    }

    public static class UrlRequest {
        private String originalUrl;

        public String getOriginalUrl() {
            return originalUrl;
        }

        public void setOriginalUrl(String originalUrl) {
            this.originalUrl = originalUrl;
        }
    }
}
