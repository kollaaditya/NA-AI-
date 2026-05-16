import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services';
import { toast } from 'react-toastify';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await productService.getAll(params);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted.');
    } catch {
      toast.error('Failed to delete product.');
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, pagination, fetchProducts, deleteProduct };
}
