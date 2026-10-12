import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/medicineService';
import CategoryCard from '../../components/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getAllCategories()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Error fetching categories:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '3rem 0 5rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Therapeutic Categories
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', margin: '0.35rem 0 0.75rem' }}>
            Explore Medicines by Category
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Find the right prescription and OTC treatments, curated by specialized medical categories.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner fullPage message="Loading healthcare categories..." />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
