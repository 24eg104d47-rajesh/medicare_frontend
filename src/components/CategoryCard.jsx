import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Smile, 
  Sparkles, 
  Baby, 
  Apple, 
  Stethoscope, 
  Pill 
} from 'lucide-react';

const iconMap = {
  'antibiotics': ShieldAlert,
  'cardiovascular': Heart,
  'diabetes-care': Activity,
  'pain-relief': Flame,
  'vitamins-supplements': Sparkles,
  'digestive-health': Apple,
  'dermatology': Smile,
  'respiratory-care': Stethoscope,
  'pediatrics': Baby,
};

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const { id, name, slug, description, active } = category;
  const IconComponent = iconMap[slug] || Pill;

  return (
    <Link
      to={`/medicines?category=${encodeURIComponent(name)}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card category-card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        background: '#fff',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100%',
        cursor: 'pointer'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0284c7',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)'
        }}>
          <IconComponent size={26} />
        </div>

        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 0.35rem 0'
        }}>
          {name}
        </h3>

        {description && (
          <p style={{
            fontSize: '0.8rem',
            color: '#64748b',
            margin: 0,
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {description}
          </p>
        )}

        <div style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: '#0284c7',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Explore &rarr;
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
