import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '@/lib/api';
import { useEffect, useRef } from 'react';

export function ProductList() {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 0 }) => fetchProducts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const loadedProducts = allPages.reduce((acc, page) => acc + page.products.length, 0);
      return loadedProducts < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product: Product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">
                  ⭐ {product.rating}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-gray-600">{product.brand}</span>
                <span className="text-green-600">
                  {product.stock} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div ref={observerTarget} className="flex justify-center items-center py-8">
        {isFetchingNextPage && (
          <div className="text-lg text-gray-600">Loading more products...</div>
        )}
        {!hasNextPage && allProducts.length > 0 && (
          <div className="text-lg text-gray-500">No more products to load</div>
        )}
      </div>
    </div>
  );
}
