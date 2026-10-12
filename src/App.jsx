import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Medicines from './pages/public/Medicines';
import MedicineDetails from './pages/public/MedicineDetails';
import Categories from './pages/public/Categories';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import Prescriptions from './pages/customer/Prescriptions';
import Addresses from './pages/customer/Addresses';
import Notifications from './pages/customer/Notifications';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Profile from './pages/customer/Profile';

// Pharmacy Admin Pages
import PharmacyDashboard from './pages/pharmacy-admin/PharmacyDashboard';
import MedicineManagement from './pages/pharmacy-admin/MedicineManagement';
import BatchInventory from './pages/pharmacy-admin/BatchInventory';
import PrescriptionReview from './pages/pharmacy-admin/PrescriptionReview';
import OrderManagement from './pages/pharmacy-admin/OrderManagement';
import SupplierManagement from './pages/pharmacy-admin/SupplierManagement';

// System Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';

// AI Assistant Page
import AiAssistant from './pages/ai/AiAssistant';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <CartDrawer />

            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/medicines" element={<Medicines />} />
                <Route path="/medicines/:slugOrId" element={<MedicineDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/prescriptions"
                  element={
                    <ProtectedRoute>
                      <Prescriptions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addresses"
                  element={
                    <ProtectedRoute>
                      <Addresses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/prescriptions"
                  element={
                    <ProtectedRoute>
                      <Prescriptions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Pharmacy Admin Routes */}
                <Route
                  path="/pharmacy-admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'ADMIN']}>
                      <PharmacyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy-admin/medicines"
                  element={
                    <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'ADMIN']}>
                      <MedicineManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy-admin/inventory"
                  element={
                    <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'ADMIN']}>
                      <BatchInventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy-admin/prescriptions"
                  element={
                    <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'ADMIN']}>
                      <PrescriptionReview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy-admin/orders"
                  element={
                    <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'ADMIN']}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy-admin/suppliers"
                  element={
                    <ProtectedRoute allowedRoles={['PHARMACY_ADMIN', 'ADMIN']}>
                      <SupplierManagement />
                    </ProtectedRoute>
                  }
                />

                {/* System Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit-logs"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AuditLogs />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
