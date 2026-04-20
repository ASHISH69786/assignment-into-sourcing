package com.intosourcing.repository;

import com.intosourcing.model.entity.Buyer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BuyerRepository extends MongoRepository<Buyer, String> {
    Optional<Buyer> findByCode(String code);
    Optional<Buyer> findByName(String name);
}

