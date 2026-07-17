import { useEffect, useState } from "react";
import api from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get("/customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Customers</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}