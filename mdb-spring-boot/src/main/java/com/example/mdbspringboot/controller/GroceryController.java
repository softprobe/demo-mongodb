package com.example.mdbspringboot.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.http.impl.nio.client.CloseableHttpAsyncClient;
import org.apache.http.impl.nio.client.HttpAsyncClients;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.example.mdbspringboot.model.GroceryItem;
import com.example.mdbspringboot.repository.CustomItemRepository;
import com.example.mdbspringboot.repository.ItemRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/groceries")
//@CrossOrigin(origins = "http://localhost:8081", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class GroceryController {

    private static final Logger logger = LoggerFactory.getLogger(GroceryController.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

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
        // RestTemplate restTemplate = new RestTemplate();
        // ResponseEntity<String> response = restTemplate.getForEntity("http://localhost:8082/hello", String.class);
        // String message = response.getBody();
        // System.out.println("Response message: " + message);
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
            // 调用time接口
            String timeResponse = callTimeApi();
            logger.info("Time API response: {}", timeResponse);

            // 保存grocery item
            groceryItemRepo.save(groceryItem);
            groceryItem.setName(groceryItem.getName() + " createTime: " + timeResponse);
            return new ResponseEntity<>(groceryItem, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating grocery item: {}", e.getMessage());
            return new ResponseEntity<>("Error creating grocery item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String callTimeApi() {
        try (CloseableHttpAsyncClient httpClient = HttpAsyncClients.createDefault()) {
            httpClient.start();
            HttpPost httpPost = new HttpPost("http://localhost:8080/time");
            
            CompletableFuture<String> future = new CompletableFuture<>();
            
            httpClient.execute(httpPost, new FutureCallback<HttpResponse>() {
                @Override
                public void completed(HttpResponse response) {
                    try {
                        String responseBody = new BasicResponseHandler().handleResponse(response);
                        future.complete(responseBody);
                    } catch (Exception e) {
                        future.completeExceptionally(e);
                    }
                }

                @Override
                public void failed(Exception ex) {
                    future.completeExceptionally(ex);
                }

                @Override
                public void cancelled() {
                    future.cancel(true);
                }
            });

            return future.get();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
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


