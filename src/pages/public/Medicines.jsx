import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, Pill, AlertCircle, RefreshCw } from 'lucide-react';
import { medicineService, categoryService } from '../../services/medicineService';
import MedicineCard from '../../components/MedicineCard';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const Medicines = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters state
  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const rxFilter = searchParams.get('prescriptionRequired') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sort = searchParams.get('sort') || 'name,asc';

  const [searchInput, setSearchInput] = useState(searchTerm);

  // Load categories
  useEffect(() => {
    categoryService.getAllCategories()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch medicines when searchParams or categories change
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const params = {
          page,
          size: 12,
          sort
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) {
          params.category = selectedCategory;
          const matched = categories.find(
            (c) => c.name?.toLowerCase() === selectedCategory.toLowerCase() || String(c.id) === String(selectedCategory)
          );
          if (matched) {
            params.categoryId = matched.id;
          }
        }
        if (rxFilter !== '') params.prescriptionRequired = rxFilter === 'true';

        const res = await medicineService.getMedicines(params);
        setMedicines(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 1);
        setTotalElements(res.data?.totalElements || 0);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setApiError(err.message || 'Unable to connect to backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [searchTerm, selectedCategory, rxFilter, page, sort, categories]);

  // Handlers for filter updates
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '0'); // reset to page 0
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem' }}>
            Medicines Catalogue
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            Browse certified pharmaceutical products, active formulations, and OTC health essentials.
          </p>
        </div>

        {/* Layout Grid: Filters on Left, Products on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Filter Sidebar Card */}
          <div className="card" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>
                <SlidersHorizontal size={18} color="#0284c7" /> Filters
              </div>
              {(searchTerm || selectedCategory || rxFilter) && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <X size={14} /> Clear All
                </button>
              )}
            </div>

            {/* Keyword Search Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Search Term
              </label>
              <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Brand, salt, generic..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </form>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => updateParam('category', e.target.value)}
                className="form-control"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prescription Requirement Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>
                Prescription Requirement
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rxFilter"
                    checked={rxFilter === ''}
                    onChange={() => updateParam('prescriptionRequired', '')}
                  />
                  <span>All Products</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rxFilter"
                    checked={rxFilter === 'false'}
                    onChange={() => updateParam('prescriptionRequired', 'false')}
                  />
                  <span>Over-The-Counter (OTC Only)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rxFilter"
                    checked={rxFilter === 'true'}
                    onChange={() => updateParam('prescriptionRequired', 'true')}
                  />
                  <span>Prescription Required (℞)</span>
                </label>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="form-control"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="name,asc">Name (A to Z)</option>
                <option value="name,desc">Name (Z to A)</option>
                <option value="price,asc">Price (Low to High)</option>
                <option value="price,desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Medicines Grid Area */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Results bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              padding: '0.5rem 0'
            }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Showing <strong>{medicines.length}</strong> of <strong>{totalElements}</strong> available medicines
              </span>
            </div>

            {loading ? (
              <LoadingSpinner message="Searching verified catalog..." />
            ) : apiError ? (
              <div className="card" style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                border: '1px solid #fee2e2'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#fef2f2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <AlertCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem' }}>
                  Backend Server Offline or Unreachable
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                  Could not reach the Spring Boot backend server at <code>http://localhost:8080</code>.
                  Please ensure the backend is running to browse verified medicines.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                >
                  <RefreshCw size={16} /> Retry Connection
                </button>
              </div>
            ) : medicines.length === 0 ? (
              <div className="card" style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '4rem 2rem',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Pill size={32} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                  No medicines found
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  We couldn't find any medicines matching your filters. Try adjusting your search query or removing filters.
                </p>
                <button onClick={handleClearFilters} className="btn btn-outline">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {medicines.map((med) => (
                    <MedicineCard key={med.id} medicine={med} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateParam('page', p)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
