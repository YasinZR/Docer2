package org.example.models.reportModels;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
public class ProductCountBySeller {
    @Id
    private String sellerId;
    private long productCount;

    // getters and setters
}
