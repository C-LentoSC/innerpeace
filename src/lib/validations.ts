import { z } from "zod";

// Category validation schemas
export const createCategorySchema = z.object({
  name: z
    .string({ message: "Category name is required" })
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
  icon: z.string().max(50, "Icon name too long").optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema;

export const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = z
  .object({
    firstName: z
      .string({ message: "First name is required" })
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string({ message: "Last name is required" })
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    email: z
      .string({ message: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(1, "Confirm password is required"),
    address: z
      .string()
      .max(200, "Address must be less than 200 characters")
      .optional(),
    mobileNumber: z
      .string()
      .regex(/^[+]?[\d\s\-\(\)]{10,15}$/, "Invalid mobile number format")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
