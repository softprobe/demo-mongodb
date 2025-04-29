package com.example.mdbspringboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.mdbspringboot.model.GroceryItem;
import com.example.mdbspringboot.repository.CustomItemRepository;
import com.example.mdbspringboot.repository.ItemRepository;

@RestController
@RequestMapping("/api/groceries")
public class GroceryController {

    @Autowired
    private ItemRepository groceryItemRepo;

    @Autowired
    private CustomItemRepository customRepo;

    /**
     * GET /api/groceries
     * Returns all grocery items.
     */
    @GetMapping("")
    public List<GroceryItem> getAllGroceries() {
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
    @PostMapping("")
    public GroceryItem createGrocery(@RequestBody GroceryItem groceryItem) {
        return groceryItemRepo.save(groceryItem);
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
} 