import './index.css';
import App from './ManageEmployees.tsx';
import ManageProducts from './ManageProducts.tsx';
import { useState } from 'react';
import Header from './components/Header'; // Import the Header component

function Main() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <div>
      <div>
        <Header /> {/* Use the Header component */}
        {/* Buttons to toggle components */}
        <button onClick={() => setActiveComponent('employees')}>Manage Employees</button>
        <button onClick={() => setActiveComponent('products')}>Manage Products</button>
        <button onClick={() => setActiveComponent('orders')}>Manage Orders</button>
      </div>

      <div>
        {/* Conditionally render components */}
        {activeComponent === 'employees' && <App />}
        {activeComponent === 'products' && <ManageProducts />}
        {activeComponent === 'orders' && <p>Orders management coming soon...</p>}
      </div>
    </div>
  );
}

export default Main;