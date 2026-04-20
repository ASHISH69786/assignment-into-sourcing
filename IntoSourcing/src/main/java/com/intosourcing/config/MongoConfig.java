package com.intosourcing.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.intosourcing.repository")
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB configuration is handled through application.properties
    // Auto-indexing is enabled via spring.data.mongodb.auto-index-creation=true
}

