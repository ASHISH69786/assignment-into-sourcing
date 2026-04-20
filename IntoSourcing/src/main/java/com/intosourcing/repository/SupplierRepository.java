package com.intosourcing.repository;

import com.intosourcing.model.entity.Supplier;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupplierRepository extends MongoRepository<Supplier, String> {
    Optional<Supplier> findByCode(String code);
    Optional<Supplier> findByName(String name);
}

