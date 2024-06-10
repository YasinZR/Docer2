package org.example.models.reportModels;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
public class AveragePriceBySeller {
    @Id
    private String sellerId;
    private double averagePrice;
}
