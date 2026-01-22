import { QueryProvider } from '@/lib/query-provider';
import { ProductList } from '@/components/ProductList';

function App() {
  return (
    <QueryProvider>
      <main className="min-h-screen bg-gray-50">
        <ProductList />
      </main>
    </QueryProvider>
  );
}

export default App;
