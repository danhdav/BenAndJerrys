import './App.css';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // Track the employee being edited
  const [editedEmployee, setEditedEmployee] = useState({}); // Store the edited employee data
  const [isAdding, setIsAdding] = useState(false); // Track if the Add form is open
  const [newEmployee, setNewEmployee] = useState({}); // Store the new employee data

  useEffect(() => {
    // Fetch employee data
    fetch('http://localhost:3000/api/employees')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setFilteredEmployees(data); // Initialize filtered employees
      })
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.Employee_ID.toString().includes(searchTerm) || // Search by Employee_ID
        employee.SSN.includes(searchTerm) // Search by SSN
    );
    setFilteredEmployees(filtered);
  };

  const handleEdit = (employeeId) => {
    setEditingEmployeeId(employeeId); // Set the employee being edited
    const employeeToEdit = employees.find((emp) => emp.Employee_ID === employeeId);
    setEditedEmployee({
      Employee_ID: employeeToEdit.Employee_ID || '',
      SSN: employeeToEdit.SSN || '',
      First_Name: employeeToEdit.First_Name || '',
      Last_Name: employeeToEdit.Last_Name || '',
      Email: employeeToEdit.Email || '',
      Home_Address: employeeToEdit.Home_Address || '',
      Position: employeeToEdit.Position || '',
      Date_Joined: employeeToEdit.Date_Joined || '',
      Salary: employeeToEdit.Salary || '',
    }); // Initialize the edited employee data
  };

  const handleEditChange = (field, value) => {
    setEditedEmployee((prev) => ({
      ...prev,
      [field]: value || '', // Ensure no undefined values
    }));
  };

  const handleSave = (employeeId) => {
    // Ensure all fields are present in editedEmployee
    const validEditedEmployee = {
      Employee_ID: editedEmployee.Employee_ID || '',
      SSN: editedEmployee.SSN || '',
      First_Name: editedEmployee.First_Name || '',
      Last_Name: editedEmployee.Last_Name || '',
      Email: editedEmployee.Email || '',
      Home_Address: editedEmployee.Home_Address || '',
      Position: editedEmployee.Position || '',
      Date_Joined: editedEmployee.Date_Joined || '',
      Salary: editedEmployee.Salary || '',
    };

    // Update the employee in the state
    const updatedEmployees = employees.map((emp) =>
      emp.Employee_ID === employeeId ? validEditedEmployee : emp
    );
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    setEditingEmployeeId(null); // Exit editing mode

    // Send the updated data to the backend
    fetch(`http://localhost:3000/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validEditedEmployee),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Employee updated successfully');
      })
      .catch((error) => console.error('Error updating employee:', error));
  };

  const handleCancel = () => {
    setEditingEmployeeId(null); // Exit editing mode without saving
  };

  const handleDelete = (employeeId) => {
    // Send a DELETE request to the backend
    fetch(`http://localhost:3000/api/employees/${employeeId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Employee with ID ${employeeId} deleted successfully`);

        // Update the state to remove the deleted employee
        const updatedEmployees = employees.filter((emp) => emp.Employee_ID !== employeeId);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
      })
      .catch((error) => console.error('Error deleting employee:', error));
  };

  const handleAdd = () => {
    setIsAdding(true); // Open the Add form
    setNewEmployee({
      Employee_ID: '',
      SSN: '',
      First_Name: '',
      Last_Name: '',
      Email: '',
      Home_Address: '',
      Position: '',
      Date_Joined: '',
      Salary: '',
    }); // Initialize the new employee data
  };

  const handleAddChange = (field, value) => {
    setNewEmployee((prev) => ({
      ...prev,
      [field]: value || '', // Ensure no undefined values
    }));
  };

  const handleAddSubmit = () => {
    // Add the new employee to the state
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    setIsAdding(false); // Close the Add form

    // Optionally, send the new employee data to the backend
    fetch('http://localhost:3000/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Employee added successfully');
      })
      .catch((error) => console.error('Error adding employee:', error));
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
      <button onClick={handleAdd}>Add Employee</button> {/* Add button */}
      {isAdding && ( // Add form
        <div>
          <h3>Add New Employee</h3>
          {Object.keys(newEmployee).map((key) => (
            <div key={key}>
              <label>{key}:</label>
              <input
                type="text"
                value={newEmployee[key]}
                onChange={(e) => handleAddChange(key, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleAddSubmit}>Submit</button>
          <button onClick={handleAddCancel}>Cancel</button>
        </div>
      )}
      <div>
        {filteredEmployees.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                {Object.keys(filteredEmployees[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.Employee_ID}>
                  {Object.keys(employee).map((key) => (
                    <td key={key}>
                      {editingEmployeeId === employee.Employee_ID ? (
                        <input
                          type="text"
                          value={editedEmployee[key] || ''}
                          onChange={(e) => handleEditChange(key, e.target.value)}
                        />
                      ) : (
                        employee[key]
                      )}
                    </td>
                  ))}
                  <td>
                    {editingEmployeeId === employee.Employee_ID ? (
                      <>
                        <button onClick={() => handleSave(employee.Employee_ID)}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(employee.Employee_ID)}>Edit</button>
                        <button onClick={() => handleDelete(employee.Employee_ID)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employees found.</p>
        )}
      </div>
    </>
  );
}

export default App;
