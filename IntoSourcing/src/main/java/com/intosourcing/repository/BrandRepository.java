package com.intosourcing.repository;

import com.intosourcing.model.entity.Brand;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BrandRepository extends MongoRepository<Brand, String> {
    Optional<Brand> findByCode(String code);
    Optional<Brand> findByName(String name);
}

