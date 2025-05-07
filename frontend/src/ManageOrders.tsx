import './App.css';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newOrder, setNewOrder] = useState({
    PO_Num: '',
    Retailer_ID: '',
    Distributor_ID: '',
    Placement_Date: '',
    Fulfillment_Date: '',
    Status: '',
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/orders')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const handleSearch = () => {
    const filtered = orders.filter(
      (order) =>
        order.PO_Num.toString().includes(searchTerm) ||
        order.Retailer_ID.toString().includes(searchTerm) ||
        order.Distributor_ID.toString().includes(searchTerm) ||
        order.Placement_Date.includes(searchTerm) ||
        order.Fulfillment_Date.includes(searchTerm) ||
        order.Status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setNewOrder({
      PO_Num: '',
      Retailer_ID: '',
      Distributor_ID: '',
      Placement_Date: '',
      Fulfillment_Date: '',
      Status: '',
    });
  };

  const handleAddChange = (field, value) => {
    setNewOrder((prev) => ({
      ...prev,
      [field]: value || '',
    }));
  };

  const handleAddSubmit = () => {
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setIsAdding(false);

    fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Order added successfully');
      })
      .catch((error) => console.error('Error adding order:', error));
  };

  const handleAddCancel = () => {
    setIsAdding(false);
  };

  return (
    <>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      <button onClick={handleAdd}>Add Order</button>
      {isAdding && (
        <div>
          <h3>Add New Order</h3>
          {Object.keys(newOrder).map((key) => (
            <div key={key}>
              <label>{key}:</label>
              <input
                type={key.includes('Date') ? 'date' : 'text'}
                value={newOrder[key]}
                onChange={(e) => handleAddChange(key, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddSubmit}>Submit</button>
          <button onClick={handleAddCancel}>Cancel</button>
        </div>
      )}
      <div>
        {filteredOrders.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                {Object.keys(filteredOrders[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.PO_Num}>
                  {Object.keys(order).map((key) => (
                    <td key={key}>{order[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </>
  );
}

export default ManageOrders;