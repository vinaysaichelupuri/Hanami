
import React, { useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const Homepage: React.FC = () => {
  const { state, dispatch } = useStore();

  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const products = await fetchProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadProducts();
  }, [dispatch]);

  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const saleProducts = filteredProducts.filter(product => product.discount);

  if (state.loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 gradient-hanami">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Welcome to Hanami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of elegant clothing inspired by the beauty of Japanese aesthetics
          </p>
        </div>

        {/* Search Results */}
        {state.searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Search results for "{state.searchQuery}"
            </h2>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Sorry! No product found for your search. Please search for some other great products.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sale Section */}
        {!state.searchQuery && saleProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Items on Sale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {state.searchQuery ? 'Search Results' : 'All Products'}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : state.searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Sorry! No product found for your search. Please search for some other great products.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default Homepage;
