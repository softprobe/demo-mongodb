package com.example.mdbspringboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.bson.Document;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.MongoCollection;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class MongoDBController {

    private static final Logger logger = LoggerFactory.getLogger(MongoDBController.class);
    private static final String TARGET_DATABASE = "sp_storage_db";

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private MongoClient mongoClient;

    @GetMapping("/collections")
    public List<String> getAllCollections() {
        logger.info("Attempting to get all collection names from database: {}", TARGET_DATABASE);
        List<String> collections = new ArrayList<>();
        
        // 获取指定数据库
        MongoDatabase database = mongoClient.getDatabase(TARGET_DATABASE);
        
        // 获取数据库中的所有集合
        for (String collectionName : database.listCollectionNames()) {
            collections.add(collectionName);
        }
        
        logger.info("Found collections in {}: {}", TARGET_DATABASE, collections);
        return collections;
    }

    @GetMapping("/collection-data")
    public List<Document> getCollectionData(@RequestParam String collectionName) {
        logger.info("Attempting to get data from collection: {} in database: {}", collectionName, TARGET_DATABASE);
        
        // 获取指定数据库和集合
        MongoDatabase database = mongoClient.getDatabase(TARGET_DATABASE);
        MongoCollection<Document> collection = database.getCollection(collectionName);
        
        // 获取集合中的所有文档
        List<Document> documents = new ArrayList<>();
        collection.find().into(documents);
        
        logger.info("Found {} documents in collection {}", documents.size(), collectionName);
        return documents;
    }
}