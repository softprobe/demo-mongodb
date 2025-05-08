package com.example.mdbspringboot.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.mdbspringboot.model.GroceryItem;
import com.example.mdbspringboot.repository.CustomItemRepository;
import com.example.mdbspringboot.repository.ItemRepository;

@RestController
@RequestMapping("/api/groceries")
public class GroceryController {

    private static final Logger logger = LoggerFactory.getLogger(GroceryController.class);

    @Autowired
    private ItemRepository groceryItemRepo;

    @Autowired
    private CustomItemRepository customRepo;

    /**
     * GET /api/groceries
     * Returns all grocery items.
     */
    @GetMapping("getAll")
    public List<GroceryItem> getAllGroceries() {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity("https://ifconfig.me", String.class);
        String message = response.getBody();
        logger.info("My ip address is: " + message);
        return groceryItemRepo.findAll();
    }

    /**
     * GET /api/groceries/name/{name}
     * Returns a single grocery item by its name.
     */
    @GetMapping("/name/{name}")
    public GroceryItem getGroceryByName(@PathVariable String name) {
        return groceryItemRepo.findItemByName(name);
    }

    /**
     * GET /api/groceries/category/{category}
     * Returns grocery items for a specific category.
     */
    @GetMapping("/category/{category}")
    public List<GroceryItem> getGroceriesByCategory(@PathVariable String category) {
        return groceryItemRepo.findAll(category);
    }

    /**
     * POST /api/groceries
     * Creates a new grocery item.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createGrocery(@RequestBody GroceryItem groceryItem) {
        try {
            groceryItemRepo.save(groceryItem);
            return new ResponseEntity<>(groceryItem, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating grocery item: {}", e.getMessage());
            return new ResponseEntity<>("Error creating grocery item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * PUT /api/groceries/updateCategory
     * Updates the category for all grocery items that currently match the given category.
     * The new category defaults to "munchies" if not provided.
     */
    @PutMapping("/updateCategory")
    public String updateCategory(@RequestParam String currentCategory,
                                 @RequestParam(defaultValue = "munchies") String newCategory) {
        List<GroceryItem> items = groceryItemRepo.findAll(currentCategory);
        items.forEach(item -> item.setCategory(newCategory));
        List<GroceryItem> updatedItems = groceryItemRepo.saveAll(items);
        return "Successfully updated " + updatedItems.size() + " items.";
    }

    /**
     * PUT /api/groceries/updateQuantity
     * Updates the quantity of a grocery item identified by its name.
     */
    @PutMapping("/updateQuantity")
    public String updateQuantity(@RequestParam String name, @RequestParam float newQuantity) {
        customRepo.updateItemQuantity(name, newQuantity);
        return "Quantity updated for item: " + name;
    }

    /**
     * DELETE /api/groceries/{id}
     * Deletes a grocery item by its id.
     */
    @DeleteMapping("/{id}")
    public String deleteGrocery(@PathVariable String id) {
        groceryItemRepo.deleteById(id);
        return "Deleted grocery item with id: " + id;
    }

    /**
     * GET /api/groceries/count
     * Returns the total count of grocery items.
     */
    @GetMapping("/count")
    public long countGroceries(){
        return groceryItemRepo.count();
    }


    public static class ResponseData {
        private String msg;
        private int code;
        public String getMsg() {
            return msg;
        }

        public void setMsg(String msg) {
            this.msg = msg;
        }
        public int getCode() {
            return code;
        }

        public void setCode(int code) {
            this.code = code;
        }

    }
}


