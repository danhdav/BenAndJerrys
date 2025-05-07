import './App.css';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // Track the employee being edited
  const [editedEmployee, setEditedEmployee] = useState({}); // Store the edited employee data

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
    console.log(`Delete employee with ID: ${employeeId}`);
    // Add logic to handle deleting the employee
  };

  return (
    <>
      {/* Use the SearchBar component */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
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
