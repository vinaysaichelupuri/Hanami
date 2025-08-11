
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Product, useStore } from '../contexts/StoreContext';
import { fetchProduct } from '../services/api';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const isInWishlist = product ? state.wishlist.includes(product.id) : false;
  const isInCart = product ? state.cart.some(item => item.product.id === product.id) : false;

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await fetchProduct(parseInt(id));
        setProduct(productData);
        if (productData?.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!product) return;
    
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${isInWishlist ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, size: selectedSize } 
    });
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) has been added to your cart`,
    });
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 gradient-hanami">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6 hover:bg-pink-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[600px] object-cover rounded-lg shadow-lg"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  NEW
                </Badge>
              )}
              {product.discount && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  -{product.discount}%
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">({product.rating} rating)</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.inStock && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? "bg-pink-500 hover:bg-pink-600" : "border-pink-300 hover:bg-pink-50"}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                <Heart 
                  className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
                />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>

              {product.inStock ? (
                <Button
                  onClick={isInCart ? handleGoToCart : handleAddToCart}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                  disabled={!selectedSize}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart ? 'Go to Cart' : 'Add to Cart'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled
                >
                  Out of Stock
                </Button>
              )}
            </div>

            {/* Product Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Information
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Category:</span> {product.category}</p>
                <p><span className="font-medium">Availability:</span> {product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                <p><span className="font-medium">Available Sizes:</span> {product.sizes.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
