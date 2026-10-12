import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Bot, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  Pill, 
  Bell, 
  ClipboardList,
  LayoutDashboard,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isPharmacyAdmin, isAdmin, logout } = useAuth();
  const { itemsCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <Pill size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              MediCare <span style={{ color: '#0284c7' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '600', color: '#0d9488', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '-3px' }}>
              Smart Pharmacy
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1', maxWidth: '420px', margin: '0 1.5rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search medicines, salts, brands (e.g. Paracetamol, Dolo)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{
              paddingLeft: '2.5rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              background: '#f8fafc',
              borderColor: '#e2e8f0'
            }}
          />
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        </form>

        {/* Navigation Links (Desktop) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/medicines" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Medicines
          </Link>
          <Link to="/categories" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
            Categories
          </Link>
          <Link to="/ai-assistant" style={{
            fontWeight: '600',
            fontSize: '0.9rem',
            color: '#0284c7',
            background: '#e0f2fe',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}>
            <Bot size={16} /> AI Assistant
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              position: 'relative',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              transition: 'background 0.2s'
            }}
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {itemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)'
              }}>
                {itemsCount}
              </span>
            )}
          </button>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  color: '#1e293b'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isPharmacyAdmin ? '#0d9488' : isAdmin ? '#6366f1' : '#0284c7',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span>{user?.fullName?.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '240px',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '0.75rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                    <div style={{
                      marginTop: '0.35rem',
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      background: isPharmacyAdmin ? '#ccfbf1' : isAdmin ? '#e0e7ff' : '#e0f2fe',
                      color: isPharmacyAdmin ? '#0f766e' : isAdmin ? '#4338ca' : '#0369a1'
                    }}>
                      {user.role}
                    </div>
                  </div>

                  {isCustomer && (
                    <>
                      <Link to="/dashboard" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> My Account
                      </Link>
                      <Link to="/orders" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <ClipboardList size={16} /> My Orders
                      </Link>
                      <Link to="/prescriptions" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <ShieldCheck size={16} /> Prescriptions
                      </Link>
                      <Link to="/notifications" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <Bell size={16} /> Notifications
                      </Link>
                      <Link to="/profile" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <Settings size={16} /> Edit Profile
                      </Link>
                    </>
                  )}

                  {isPharmacyAdmin && (
                    <>
                      <Link to="/pharmacy-admin/dashboard" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> Pharmacy Portal
                      </Link>
                      <Link to="/pharmacy-admin/prescriptions" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <ShieldCheck size={16} /> Prescription Review
                      </Link>
                      <Link to="/pharmacy-admin/inventory" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <Pill size={16} /> Batch Stock
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> System Admin
                      </Link>
                      <Link to="/admin/users" className="sidebar-link" onClick={() => setUserDropdownOpen(false)}>
                        <UserIcon size={16} /> User Management
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      navigate('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
