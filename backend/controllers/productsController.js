import connection from '../config/db.js'; // Import the database connection

// Fetch all products
const getProducts = (req, res) => {
  connection.query('SELECT * FROM Product', (err, results) => {
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
    'INSERT INTO Product (Product_ID, Price, Category, Ingredients, Nutritional_Facts, Size) VALUES (?, ?, ?, ?, ?, ?)',
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
    'UPDATE Product SET Product_ID = ?, Price = ?, Category = ?, Ingredients = ?, Nutritional_Facts = ?, Size = ? WHERE Product_ID = ?',
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

  // First, delete rows in the `product_distribution` table that reference the Product_ID
  connection.query('DELETE FROM product_distribution WHERE Product_ID = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting from product_distribution:', err);
      res.status(500).json({ error: 'Failed to delete product from product_distribution' });
      return;
    }

    // Then, delete rows in the `initial_storage` table that reference the Product_ID
    connection.query('DELETE FROM initial_storage WHERE Product_ID = ?', [id], (err) => {
      if (err) {
        console.error('Error deleting from initial_storage:', err);
        res.status(500).json({ error: 'Failed to delete product from initial_storage' });
        return;
      }

      // Finally, delete the product from the `Product` table
      connection.query('DELETE FROM Product WHERE Product_ID = ?', [id], (err, results) => {
        if (err) {
          console.error('Error deleting product:', err);
          res.status(500).json({ error: 'Failed to delete product' });
        } else if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Product not found' });
        } else {
          res.status(200).json({ message: 'Product deleted successfully' });
        }
      });
    });
  });
};

// Export all functions
export { getProducts, addProduct, updateProduct, deleteProduct };