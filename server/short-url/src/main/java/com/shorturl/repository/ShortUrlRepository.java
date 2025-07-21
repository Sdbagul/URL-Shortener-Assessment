package com.shorturl.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shorturl.entity.ShortUrl;

public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    ShortUrl findByShortCode(String shortCode);
} 