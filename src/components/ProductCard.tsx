
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, useStore } from '../contexts/StoreContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const isInWishlist = state.wishlist.includes(product.id);
  const isInCart = state.cart.some(item => item.product.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${isInWishlist ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock) {
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: { product, size: product.sizes[0] } 
      });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Notification set!",
      description: "We'll notify you when this item is back in stock",
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
              NEW
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
              -{product.discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {product.inStock ? (
          <Button
            onClick={handleAddToCart}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            disabled={isInCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
        ) : (
          <Button
            onClick={handleNotifyMe}
            variant="outline"
            className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            Notify Me
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
