package com.intosourcing.repository;

import com.intosourcing.model.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findByCode(String code);
    Optional<Category> findByName(String name);
}

