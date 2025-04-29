
import { useEffect } from "react";
import { PREDEFINED_CATEGORIES } from "@/utils/categoryUtils";
import { GroceryItem } from "@/types/groceryTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  quantity: z
    .number()
    .min(0, { message: "Quantity cannot be negative" })
    .max(10000, { message: "Quantity must not exceed 10000" }),
  category: z
    .string()
    .min(1, { message: "Category is required" })
    .max(50, { message: "Category must not exceed 50 characters" }),
  customCategory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<GroceryItem, "id"> & { id?: string }) => void;
  initialData?: GroceryItem;
}

const AddEditItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddEditItemModalProps) => {
  const isEditMode = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      quantity: initialData?.quantity || 1,
      category: initialData?.category || "",
      customCategory: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialData?.name || "",
        quantity: initialData?.quantity || 1,
        category: initialData?.category || "",
        customCategory: "",
      });
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = (data: FormValues) => {
    const finalCategory =
      data.category === "custom" ? data.customCategory : data.category;

    onSubmit({
      ...(initialData?.id && { id: initialData.id }),
      name: data.name,
      quantity: data.quantity,
      category: finalCategory || "",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Grocery Item" : "Add New Grocery Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PREDEFINED_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      {initialData?.category &&
                        !PREDEFINED_CATEGORIES.includes(
                          initialData.category
                        ) && (
                          <SelectItem value={initialData.category}>
                            {initialData.category}
                          </SelectItem>
                        )}
                      <SelectItem value="custom">Custom Category...</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("category") === "custom" && (
              <FormField
                control={form.control}
                name="customCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter custom category"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mt-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-grocery-green-600 hover:bg-grocery-green-700 mt-2"
              >
                {isEditMode ? "Update Item" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditItemModal;
