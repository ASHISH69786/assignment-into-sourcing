package com.intosourcing.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "data_imports", indexes = {
    @Index(name = "idx_import_source_file", columnList = "sourceFile"),
    @Index(name = "idx_import_import_date", columnList = "importDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataImport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sourceFile;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ImportStatus status;

    @Column(nullable = false)
    private Integer totalRecords = 0;

    @Column(nullable = false)
    private Integer successfulRecords = 0;

    @Column(nullable = false)
    private Integer failedRecords = 0;

    @Column(columnDefinition = "TEXT")
    private String errorLog;

    @Column(nullable = false, updatable = false)
    private LocalDateTime importDate;

    @Column
    private LocalDateTime completionDate;

    @Column(length = 100)
    private String importedBy;

    @PrePersist
    protected void onCreate() {
        importDate = LocalDateTime.now();
    }

    public enum ImportStatus {
        PENDING, IN_PROGRESS, COMPLETED, FAILED
    }
}

