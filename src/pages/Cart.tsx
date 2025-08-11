
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const Cart: React.FC = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const totalAmount = state.cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setItemToRemove(productId);
    } else {
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { productId, quantity: newQuantity } 
      });
    }
  };

  const handleRemoveItem = (productId: number) => {
    setItemToRemove(productId);
  };

  const confirmRemoval = () => {
    if (itemToRemove) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemToRemove });
      setItemToRemove(null);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });
    }
  };

  const handleOrderNow = () => {
    toast({
      title: "Order placed successfully!",
      description: `Thanks for shopping!! Please visit again. Total: $${totalAmount.toFixed(2)}`,
    });
    dispatch({ type: 'CLEAR_CART' });
    navigate('/');
  };

  if (state.cart.length === 0) {
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

          <div className="text-center py-16">
            <div className="text-6xl mb-4">🥺</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart feels very light!
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 gradient-hanami">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6 hover:bg-pink-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="space-y-4">
          {state.cart.map((item) => (
            <Card key={`${item.product.id}-${item.size}`} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">Size: {item.size}</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${item.product.price}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleOrderNow}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white text-lg py-3"
            >
              Order Now
            </Button>
          </CardContent>
        </Card>

        {/* Remove Confirmation Dialog */}
        <AlertDialog open={itemToRemove !== null} onOpenChange={() => setItemToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this item from your cart?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoval}>
                Yes, Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Cart;
