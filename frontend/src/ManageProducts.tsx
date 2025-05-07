import './App.css';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Track the product being edited
  const [editedProduct, setEditedProduct] = useState({}); // Store the edited product data
  const [isAdding, setIsAdding] = useState(false); // Track if the Add form is open
  const [newProduct, setNewProduct] = useState({}); // Store the new product data

  useEffect(() => {
    // Fetch product data
    fetch('http://localhost:3000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.Product_ID.toString().includes(searchTerm) || // Search by Product_ID
        product.Category.toLowerCase().includes(searchTerm.toLowerCase()) // Search by Category
    );
    setFilteredProducts(filtered);
  };

  const handleEdit = (productId) => {
    setEditingProductId(productId); // Set the product being edited
    const productToEdit = products.find((prod) => prod.Product_ID === productId);
    setEditedProduct({
      Product_ID: productToEdit.Product_ID || '',
      Price: productToEdit.Price || '',
      Category: productToEdit.Category || '',
      Ingredients: productToEdit.Ingredients || '',
      Nutritional_Facts: productToEdit.Nutritional_Facts || '',
      Size: productToEdit.Size || '',
    }); // Initialize the edited product data
  };

  const handleEditChange = (field, value) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value || '', // Ensure no undefined values
    }));
  };

  const handleSave = (productId) => {
    // Ensure all fields are present in editedProduct
    const validEditedProduct = {
      Product_ID: editedProduct.Product_ID || '',
      Price: editedProduct.Price || '',
      Category: editedProduct.Category || '',
      Ingredients: editedProduct.Ingredients || '',
      Nutritional_Facts: editedProduct.Nutritional_Facts || '',
      Size: editedProduct.Size || '',
    };

    // Update the product in the state
    const updatedProducts = products.map((prod) =>
      prod.Product_ID === productId ? validEditedProduct : prod
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setEditingProductId(null); // Exit editing mode

    // Send the updated data to the backend
    fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validEditedProduct),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Product updated successfully');
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  const handleCancel = () => {
    setEditingProductId(null); // Exit editing mode without saving
  };

  const handleDelete = (productId) => {
    // Send a DELETE request to the backend
    fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Product with ID ${productId} deleted successfully`);

        // Update the state to remove the deleted product
        const updatedProducts = products.filter((prod) => prod.Product_ID !== productId);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      })
      .catch((error) => console.error('Error deleting product:', error));
  };

  const handleAdd = () => {
    setIsAdding(true); // Open the Add form
    setNewProduct({
      Product_ID: '',
      Price: '',
      Category: '',
      Ingredients: '',
      Nutritional_Facts: '',
      Size: '',
    }); // Initialize the new product data
  };

  const handleAddChange = (field, value) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value || '', // Ensure no undefined values
    }));
  };

  const handleAddSubmit = () => {
    // Add the new product to the state
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setIsAdding(false); // Close the Add form

    // Optionally, send the new product data to the backend
    fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Product added successfully');
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const handleAddCancel = () => {
    setIsAdding(false); // Close the Add form without saving
  };

  return (
    <>
      {/* Use the SearchBar component */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      <button onClick={handleAdd}>Add Product</button> {/* Add button */}
      {isAdding && ( // Add form
        <div>
          <h3>Add New Product</h3>
          {Object.keys(newProduct).map((key) => (
            <div key={key}>
              <label>{key}:</label>
              <input
                type="text"
                value={newProduct[key]}
                onChange={(e) => handleAddChange(key, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddSubmit}>Submit</button>
          <button onClick={handleAddCancel}>Cancel</button>
        </div>
      )}
      <div>
        {filteredProducts.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                {Object.keys(filteredProducts[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.Product_ID}>
                  {Object.keys(product).map((key) => (
                    <td key={key}>
                      {editingProductId === product.Product_ID ? (
                        <input
                          type="text"
                          value={editedProduct[key] || ''}
                          onChange={(e) => handleEditChange(key, e.target.value)}
                        />
                      ) : (
                        product[key]
                      )}
                    </td>
                  ))}
                  <td>
                    {editingProductId === product.Product_ID ? (
                      <>
                        <button onClick={() => handleSave(product.Product_ID)}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(product.Product_ID)}>Edit</button>
                        <button onClick={() => handleDelete(product.Product_ID)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </>
  );
}

export default ManageProducts;