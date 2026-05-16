import { useState, useEffect, useCallback } from 'react';
import { proposalService } from '../services';
import { toast } from 'react-toastify';

export default function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchProposals = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await proposalService.getAll(params);
      setProposals(data.data.proposals);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load proposals.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProposal = useCallback(async (id) => {
    try {
      await proposalService.delete(id);
      setProposals((prev) => prev.filter((p) => p._id !== id));
      toast.success('Proposal deleted.');
    } catch {
      toast.error('Failed to delete proposal.');
    }
  }, []);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  return { proposals, loading, pagination, fetchProposals, deleteProposal };
}
