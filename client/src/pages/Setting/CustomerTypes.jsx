import { useState, useEffect } from 'react';

import { Button } from '../../components';
import {
  getCustomerTypes,
  createCustomerType,
  updateCustomerType,
} from '../../services';

const CustomerTypes = () => {
  const [customerTypes, setCustomerTypes] = useState([]);
  const [newCustomerTypes, setNewCustomerTypes] = useState([]);
  const [editedCustomerTypes, setEditedCustomerTypes] = useState([]);

  const nameOptions = ['domestic', 'foreign', 'vip', 'corporate', 'long stay'];
  const coefficientOptions = [0.5, 1.0, 1.5, 2.0, 2.5];

  useEffect(() => {
    const fetchCustomerTypes = async () => {
      const data = await getCustomerTypes();
      setCustomerTypes(data);
    };

    fetchCustomerTypes();
  }, []);

  const handleEditCustomerType = (type) => {
    const editingCustomerType = customerTypes.find(
      (customerType) => customerType.Type === type
    );

    setCustomerTypes(
      customerTypes.filter((customerType) => customerType.Type !== type)
    );
    setNewCustomerTypes([editingCustomerType, ...newCustomerTypes]);
    setEditedCustomerTypes([
      ...editedCustomerTypes,
      JSON.parse(JSON.stringify(editingCustomerType)),
    ]);
  };

  const handleAddCustomerType = () => {
    const newCustomerType = {};
    setNewCustomerTypes([...newCustomerTypes, newCustomerType]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedCustomerTypes = [...newCustomerTypes];
    updatedCustomerTypes[index][field] = value;
    setNewCustomerTypes(updatedCustomerTypes);
  };

  const handleRemoveRow = (index) => {
    const editingCustomerType = editedCustomerTypes.find(
      (customerType) => customerType.Type === newCustomerTypes[index].Type
    );

    if (editingCustomerType) {
      setCustomerTypes([...customerTypes, editingCustomerType]);
      setEditedCustomerTypes(
        editedCustomerTypes.filter(
          (customerType) => customerType.Type !== editingCustomerType.Type
        )
      );
      setNewCustomerTypes(newCustomerTypes.filter((_, i) => i !== index));
    } else {
      setNewCustomerTypes(newCustomerTypes.filter((_, i) => i !== index));
    }
  };

  const handleSaveChanges = async () => {
    for (const customerType of newCustomerTypes) {
      if (!customerType.Name || !customerType.Coefficient) {
        const index = newCustomerTypes.findIndex(
          (newCustomerType) => newCustomerType.Type === customerType.Type
        );

        alert(
          `Please fill in all fields for type '${
            customerType.Name || index + customerTypes.length + 1
          }'`
        );
        return;
      }

      if (
        newCustomerTypes.filter(
          (newCustomerType) => newCustomerType.Name === customerType.Name
        ).length > 1
      ) {
        alert(`Customer type '${customerType.Name}' is duplicated`);
        return;
      }
    }

    for (const customerType of newCustomerTypes) {
      const editingCustomerType = editedCustomerTypes.find(
        (editedCustomerType) => editedCustomerType.Type === customerType.Type
      );

      if (
        editingCustomerType &&
        customerType.Type === editingCustomerType.Type
      ) {
        const response = await updateCustomerType(
          customerType.Type,
          customerType
        );
        if (!response.ok) {
          alert(`Failed to UPDATE customer type '${customerType.Name}'`);
        }
      } else {
        const response = await createCustomerType(customerType);
        if (!response.ok) {
          alert(`Failed to CREATE customer type '${customerType.Name}'`);
        }
      }
    }

    setNewCustomerTypes([]);
    setEditedCustomerTypes([]);

    const data = await getCustomerTypes();
    setCustomerTypes(data);
  };

  const renderNewRow = (customerType, index) => (
    <tr key={index}>
      <td className="border px-2">{customerTypes.length + index + 1}</td>
      <td className="border px-2">
        {editedCustomerTypes
          .map((editedCustomerType) => editedCustomerType.Name)
          .includes(customerType.Name) ? (
          <>
            {customerType.Name.charAt(0).toUpperCase() +
              customerType.Name.slice(1)}{' '}
          </>
        ) : (
          <select
            className="w-full text-center"
            value={customerType.Name}
            onChange={(e) => handleFieldChange(index, 'Name', e.target.value)}
          >
            <option value="">Select Name</option>
            {nameOptions
              .filter(
                (name) =>
                  !customerTypes
                    .map((customerType) => customerType.Name)
                    .includes(name)
              )
              .filter(
                (name) =>
                  !editedCustomerTypes
                    .map((customerType) => customerType.Name)
                    .includes(name)
              )
              .map((name, index) => (
                <option key={index} value={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </option>
              ))}
          </select>
        )}
      </td>
      <td className="border px-2">
        <select
          className="w-full text-center"
          value={customerType.Coefficient}
          onChange={(e) =>
            handleFieldChange(index, 'Coefficient', e.target.value)
          }
        >
          <option value="">Select Coefficient</option>
          {coefficientOptions.map((coefficient, index) => (
            <option key={index} value={coefficient}>
              {coefficient - 0.5 === Math.floor(coefficient - 0.5)
                ? coefficient
                : coefficient + '.0'}
            </option>
          ))}
        </select>
      </td>
      <td className="border p-1">
        <div className="flex justify-center gap-2">
          <Button
            text="❌"
            onClick={() => handleRemoveRow(index)}
            color="red"
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="w-full max-w-[800px] mx-auto overflow-x-auto">
      <table className="table-auto text-center w-full whitespace-nowrap">
        <thead className="table-header-group lg:text-xl text-lg font-play">
          <tr className="table-row">
            <th className="border bg-zinc-400 lg:h-12 h-10 px-2">No</th>
            <th className="border bg-zinc-400 px-2">Name</th>
            <th className="border bg-zinc-400 px-2 ">Coefficient</th>
            <th className="border bg-zinc-400 px-2">Edit</th>
          </tr>
        </thead>
        <tbody className="lg:text-lg text-base font-amethysta">
          {customerTypes.map((customerType, index) => (
            <tr key={index}>
              <td className="border px-2">{index + 1}</td>
              <td className="border px-2">
                {customerType.Name.charAt(0).toUpperCase() +
                  customerType.Name.slice(1)}
              </td>
              <td className="border px-2 tracking-wider">
                {customerType.Coefficient - 0.5 ===
                Math.floor(customerType.Coefficient - 0.5)
                  ? customerType.Coefficient
                  : customerType.Coefficient + '.0'}{' '}
                ⚖️
              </td>
              <td className="border p-1">
                <div className="flex justify-center gap-2">
                  <Button
                    color="orange"
                    text="✏️"
                    onClick={() => handleEditCustomerType(customerType.Type)}
                  />
                </div>
              </td>
            </tr>
          ))}
          {newCustomerTypes.map(renderNewRow)}
        </tbody>
      </table>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          text="Add Customer Type"
          onClick={handleAddCustomerType}
          color="black"
        />
        <Button text="Save Changes" onClick={handleSaveChanges} color="red" />
      </div>
    </div>
  );
};

export default CustomerTypes;
