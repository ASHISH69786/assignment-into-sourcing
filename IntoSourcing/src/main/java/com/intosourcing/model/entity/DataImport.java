package com.intosourcing.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "data_imports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataImport {
    @Id
    private String id;

    @Indexed
    private String sourceFile;

    private ImportStatus status;

    private Integer totalRecords = 0;

    private Integer successfulRecords = 0;

    private Integer failedRecords = 0;

    private String errorLog;

    @CreatedDate
    @Indexed
    private LocalDateTime importDate;

    private LocalDateTime completionDate;

    private String importedBy;


    public enum ImportStatus {
        PENDING, IN_PROGRESS, COMPLETED, FAILED
    }
}

