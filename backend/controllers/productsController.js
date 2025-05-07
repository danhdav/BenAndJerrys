import connection from '../config/db.js'; // Import the database connection

// Fetch all products
const getProducts = (req, res) => {
  connection.query('SELECT * FROM Products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Add a new product
const addProduct = (req, res) => {
  const { Product_ID, Price, Category, Ingredients, Nutritional_Facts, Size } = req.body;
  connection.query(
    'INSERT INTO Products (Product_ID, Price, Category, Ingredients, Nutritional_Facts, Size) VALUES (?, ?, ?, ?, ?, ?)',
    [Product_ID, Price, Category, Ingredients, Nutritional_Facts, Size],
    (err) => {
      if (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Failed to add product' });
      } else {
        res.status(201).json({ message: 'Product added successfully' });
      }
    }
  );
};

// Update a product
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { Product_ID, Price, Category, Ingredients, Nutritional_Facts, Size } = req.body;
  connection.query(
    'UPDATE Products SET Product_ID = ?, Price = ?, Category = ?, Ingredients = ?, Nutritional_Facts = ?, Size = ? WHERE Product_ID = ?',
    [Product_ID, Price, Category, Ingredients, Nutritional_Facts, Size, id],
    (err) => {
      if (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Failed to update product' });
      } else {
        res.status(200).json({ message: 'Product updated successfully' });
      }
    }
  );
};

// Delete a product
const deleteProduct = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Products WHERE Product_ID = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Failed to delete product' });
    } else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  });
};

// Export all functions
export { getProducts, addProduct, updateProduct, deleteProduct };