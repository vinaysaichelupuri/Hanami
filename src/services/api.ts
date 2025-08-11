
import { Product } from '../contexts/StoreContext';

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Sakura Blossom Dress",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=600&fit=crop",
    category: "Dresses",
    rating: 4.8,
    isNew: true,
    inStock: true,
    description: "A beautiful flowing dress inspired by cherry blossoms. Perfect for spring occasions with its delicate floral pattern and comfortable fit.",
    sizes: ["XS", "S", "M", "L", "XL"],
    discount: 25
  },
  {
    id: 2,
    name: "Zen Garden Kimono",
    price: 156.00,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=600&fit=crop",
    category: "Outerwear",
    rating: 4.9,
    isNew: false,
    inStock: true,
    description: "Traditional-inspired kimono with modern touches. Made from premium silk with intricate embroidery.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Minimalist White Tee",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=600&fit=crop",
    category: "Tops",
    rating: 4.5,
    isNew: false,
    inStock: false,
    description: "Essential white t-shirt made from organic cotton. A wardrobe staple that pairs with everything.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Sunset Orange Cardigan",
    price: 78.99,
    originalPrice: 98.99,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=600&fit=crop",
    category: "Outerwear",
    rating: 4.7,
    isNew: true,
    inStock: true,
    description: "Cozy cardigan in a beautiful sunset orange shade. Perfect for layering during cooler days.",
    sizes: ["S", "M", "L", "XL"],
    discount: 20
  },
  {
    id: 5,
    name: "Floral Pattern Blouse",
    price: 67.50,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=600&fit=crop",
    category: "Tops",
    rating: 4.6,
    isNew: false,
    inStock: true,
    description: "Elegant blouse featuring delicate floral patterns. Made from breathable fabric for all-day comfort.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 6,
    name: "Evening Elegance Dress",
    price: 134.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=600&fit=crop",
    category: "Dresses",
    rating: 4.9,
    isNew: false,
    inStock: true,
    description: "Sophisticated evening dress perfect for special occasions. Features a flattering silhouette and premium fabric.",
    sizes: ["XS", "S", "M", "L", "XL"],
    discount: 25
  }
];

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockProducts;
};

export const fetchProduct = async (id: number): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.find(product => product.id === id) || null;
};
