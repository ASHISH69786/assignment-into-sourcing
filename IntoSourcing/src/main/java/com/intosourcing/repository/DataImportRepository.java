package com.intosourcing.repository;

import com.intosourcing.model.entity.DataImport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DataImportRepository extends MongoRepository<DataImport, String> {
    Optional<DataImport> findBySourceFile(String sourceFile);
}

