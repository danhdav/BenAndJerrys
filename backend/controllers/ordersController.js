import connection from '../config/db.js'; // Import the database connection

// Fetch all orders with detailed information
const getOrders = (req, res) => {
  const query = `
    SELECT 
      PO.PO_Num,
      R.Retailer_ID,
      R.Date_of_Partnership,
      D.Distributor_ID,
      D.Name AS Distributor_Name,
      D.Email AS Distributor_Email,
      PO.Placement_Date,
      PO.Fulfillment_Date,
      PO.Status
    FROM Purchase_Order PO
    JOIN Retailers R ON PO.Retailer_ID = R.Retailer_ID
    JOIN Distributor D ON PO.Distributor_ID = D.Distributor_ID;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Add a new order
const addOrder = (req, res) => {
  const { PO_Num, Retailer_ID, Distributor_ID, Placement_Date, Fulfillment_Date, Status } = req.body;
  connection.query(
    'INSERT INTO Purchase_Order (PO_Num, Retailer_ID, Distributor_ID, Placement_Date, Fulfillment_Date, Status) VALUES (?, ?, ?, ?, ?, ?)',
    [PO_Num, Retailer_ID, Distributor_ID, Placement_Date, Fulfillment_Date, Status],
    (err) => {
      if (err) {
        console.error('Error adding order:', err);
        res.status(500).json({ error: 'Failed to add order' });
      } else {
        res.status(201).json({ message: 'Order added successfully' });
      }
    }
  );
};

// Update an order
const updateOrder = (req, res) => {
  const { id } = req.params;
  const { PO_Num, Retailer_ID, Distributor_ID, Placement_Date, Fulfillment_Date, Status } = req.body;
  connection.query(
    'UPDATE Purchase_Order SET PO_Num = ?, Retailer_ID = ?, Distributor_ID = ?, Placement_Date = ?, Fulfillment_Date = ?, Status = ? WHERE PO_Num = ?',
    [PO_Num, Retailer_ID, Distributor_ID, Placement_Date, Fulfillment_Date, Status, id],
    (err) => {
      if (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Failed to update order' });
      } else {
        res.status(200).json({ message: 'Order updated successfully' });
      }
    }
  );
};

// Delete an order
const deleteOrder = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Purchase_Order WHERE PO_Num = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting order:', err);
      res.status(500).json({ error: 'Failed to delete order' });
    } else {
      res.status(200).json({ message: 'Order deleted successfully' });
    }
  });
};

// Export all functions
export { getOrders, addOrder, updateOrder, deleteOrder };