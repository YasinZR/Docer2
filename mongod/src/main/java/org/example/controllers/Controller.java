package org.example.controllers;

import org.example.models.Order;
import org.example.models.Product;
import org.example.models.Seller;
import org.example.models.reportModels.AveragePriceBySeller;
import org.example.models.reportModels.PriceRange;
import org.example.models.reportModels.ProductCountBySeller;
import org.example.services.MongoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

@RestController   
public class Controller {
    public static MongoTemplate mongoTemplate;
    @Autowired
    MongoService mongoService;
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String name, @RequestParam String password) {
        mongoTemplate = mongoService.mongoTemplate(name, password);
        System.out.println(mongoTemplate.getCollectionNames());
        return ResponseEntity.ok("Аунтефикация прошла успешно");
    }
    @PostMapping("/api/orders")
    public Order createOrder(@RequestBody Order order) {
        return mongoTemplate.save(order);
    }

    @GetMapping("/api/orders/{id}")
    public Order getOrderById(@PathVariable String id) {
        return mongoTemplate.findById(id, Order.class);
    }

    @GetMapping("/api/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> list = mongoTemplate.findAll(Order.class);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/api/orders/{id}")
    public Order updateOrder(@PathVariable String id, @RequestBody Order order) {
        order.setId(id);
        return mongoTemplate.save(order);
    }

    @DeleteMapping("/api/orders/{id}")
    public void deleteOrder(@PathVariable String id) {
        Order order = mongoTemplate.findById(id, Order.class);
        if (order != null) {
            mongoTemplate.remove(order);
        }
    }

    @GetMapping("/api/orders/search")
    public List<Order> searchOrders(@RequestParam String query) {
        // Example of a simple search query using MongoTemplate
        return mongoTemplate.find(
                Query.query(Criteria.where("buyerName").regex(query, "i")), // Case-insensitive regex search on the 'name' field
                Order.class
        );
    }

    @PostMapping("/api/products")
    public Product createProduct(@RequestBody Product product) {
        return mongoTemplate.save(product);
    }

    @GetMapping("/api/products/{id}")
    public Product getProductById(@PathVariable String id) {
        return mongoTemplate.findById(id, Product.class);
    }

    @GetMapping("/api/products")
    public List<Product> getAllProducts(@RequestParam(required = false) String sortBy,
                                        @RequestParam(required = false) String order) {
        Sort.Direction direction = Sort.Direction.ASC;
        if (order != null && order.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }
        Sort sort = Sort.by(direction, sortBy != null ? sortBy : "_id");
        return mongoTemplate.find(org.springframework.data.mongodb.core.query.Query.query(new org.springframework.data.mongodb.core.query.Criteria()).with(sort), Product.class);
    }

    @PutMapping("/api/products/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        return mongoTemplate.save(product);
    }

    @DeleteMapping("/api/products/{id}")
    public void deleteProduct(@PathVariable String id) {
        Product product = mongoTemplate.findById(id, Product.class);
        if (product != null) {
            mongoTemplate.remove(product);
        }
    }
    @PostMapping("/api/sellers")
    public Seller createSeller(@RequestBody Seller seller) {
        return mongoTemplate.save(seller);
    }

    @GetMapping("/api/sellers/{id}")
    public Seller getSellerById(@PathVariable String id) {
        return mongoTemplate.findById(id, Seller.class);
    }

    @GetMapping("/api/sellers")
    public List<Seller> getAllSellers(@RequestParam(required = false) String query) {
        if (query != null) {
            System.out.println(123);
            mongoTemplate.find(Query.query(Criteria.where("name").regex(query, "i")), Seller.class);
            System.out.println(mongoTemplate.find(Query.query(Criteria.where("name").regex(query, "i")), Seller.class));
            return mongoTemplate.find(Query.query(Criteria.where("name").regex(query, "i")), Seller.class);
        }
        return mongoTemplate.findAll(Seller.class);
    }

    @PutMapping("/api/sellers/{id}")
    public Seller updateSeller(@PathVariable String id, @RequestBody Seller seller) {
        seller.setId(id);
        return mongoTemplate.save(seller);
    }

    @DeleteMapping("/api/sellers/{id}")
    public void deleteSeller(@PathVariable String id) {
        Seller seller = mongoTemplate.findById(id, Seller.class);
        if (seller != null) {
            mongoTemplate.remove(seller);
        }
    }

    @GetMapping("api/reports/average-price-by-seller")
    public List<AveragePriceBySeller> getAveragePriceBySeller() {
        Aggregation aggregation = newAggregation(
                group("sellerId")
                        .avg("price").as("averagePrice")
        );

        AggregationResults<AveragePriceBySeller> result = mongoTemplate.aggregate(aggregation, Product.class, AveragePriceBySeller.class);
        result.getMappedResults().forEach(item -> System.out.println(item.getSellerId() + ": " + item.getAveragePrice()));
        return result.getMappedResults();
    }

    @GetMapping("api/reports/product-count-by-seller")
    public List<ProductCountBySeller> getProductCountBySeller() {
        Aggregation aggregation = newAggregation(
                group("sellerId")
                        .count().as("productCount")
        );

        AggregationResults<ProductCountBySeller> result = mongoTemplate.aggregate(aggregation, Product.class, ProductCountBySeller.class);
        result.getMappedResults().forEach(item -> System.out.println(item.getSellerId() + ": " + item.getProductCount()));
        return result.getMappedResults();
    }

    @GetMapping("api/reports/product-price-range")
    public PriceRange getProductPriceRange() {
        Aggregation aggregation = newAggregation(
                group()
                        .min("price").as("minPrice")
                        .max("price").as("maxPrice")
        );

        AggregationResults<PriceRange> result = mongoTemplate.aggregate(aggregation, Product.class, PriceRange.class);
        PriceRange priceRange = result.getUniqueMappedResult();
        if (priceRange != null) {
            System.out.println("Min Price: " + priceRange.getMinPrice() + ", Max Price: " + priceRange.getMaxPrice());
        }
        return priceRange;
    }
}