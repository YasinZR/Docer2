package org.example.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    @Indexed
    private String buyerName;
    private String buyerEmail;
    @JsonProperty
    @Indexed
    private List<Product> selectedProducts;
}
