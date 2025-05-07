import connection from '../config/db.js'; // Import the database connection

// Fetch all employees
const getEmployees = (req, res) => {
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Failed to fetch employees' });
    } else {
      res.status(200).json(results); // Send the results as a JSON response
    }
  });
};

// Add a new employee
const addEmployee = (req, res) => {
  const {
    Employee_ID,
    SSN,
    First_Name,
    Last_Name,
    Email,
    Home_Address,
    Position,
    Date_Joined,
    Salary,
  } = req.body;

  connection.query(
    'INSERT INTO employee (Employee_ID, SSN, First_Name, Last_Name, Email, Home_Address, Position, Date_Joined, Salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [Employee_ID, SSN, First_Name, Last_Name, Email, Home_Address, Position, Date_Joined, Salary],
    (err) => {
      if (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Failed to add employee' });
      } else {
        res.status(201).json({ message: 'Employee added successfully' });
      }
    }
  );
};

// Update an employee
const updateEmployee = (req, res) => {
  const { id } = req.params;
  const {
    Employee_ID,
    SSN,
    First_Name,
    Last_Name,
    Email,
    Home_Address,
    Position,
    Date_Joined,
    Salary,
  } = req.body;

  connection.query(
    'UPDATE employee SET Employee_ID = ?, SSN = ?, First_Name = ?, Last_Name = ?, Email = ?, Home_Address = ?, Position = ?, Date_Joined = ?, Salary = ? WHERE Employee_ID = ?',
    [Employee_ID, SSN, First_Name, Last_Name, Email, Home_Address, Position, Date_Joined, Salary, id],
    (err) => {
      if (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Failed to update employee' });
      } else {
        res.status(200).json({ message: 'Employee updated successfully' });
      }
    }
  );
};

// Delete an employee
const deleteEmployee = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM employee WHERE Employee_ID = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Failed to delete employee' });
    } else {
      res.status(200).json({ message: 'Employee deleted successfully' });
    }
  });
};

export { getEmployees, addEmployee, updateEmployee, deleteEmployee };