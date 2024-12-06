import { useEffect, useState } from 'react';

import { Button } from '../../components';
import {
  getRoomTypes,
  updateRoomType,
  createRoomType,
  getRooms,
} from '../../services';

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomTypes, setNewRoomTypes] = useState([]);
  const [editedRoomTypes, setEditedRoomTypes] = useState([]);

  const typeOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
  const priceOptions = [100, 150, 200, 250, 300, 350, 400, 450, 500];
  const maxOccupancyOptions = [1, 2, 3, 4, 5, 6];
  const baseCustomerOptions = [1, 2, 3, 4];
  const surchargeRateOptions = [0.1, 0.15, 0.2, 0.25];

  useEffect(() => {
    const fetchRoomTypes = async () => {
      const data = await getRoomTypes();

      const rooms = await getRooms();
      const roomTypesInUse = rooms.map(
        (room) => !room.IsAvailable && room.Type
      );

      const roomTypes = data.map((roomType) => ({
        Type: roomType.Type,
        Price: roomType.Price,
        MaxOccupancy: roomType.Max_Occupancy,
        BaseCustomer: roomType.Min_Customer_for_Surcharge,
        SurchargeRate: roomType.Surcharge_Rate,
        IsInUse: roomTypesInUse.includes(roomType.Type),
      }));

      setRoomTypes(roomTypes);
    };
    fetchRoomTypes(roomTypes);
  }, []);

  const handleEditRoomType = (type) => {
    const editingRoomType = roomTypes.find(
      (roomType) => roomType.Type === type
    );

    setRoomTypes(roomTypes.filter((roomType) => roomType.Type !== type));
    setNewRoomTypes([editingRoomType, ...newRoomTypes]);
    setEditedRoomTypes([
      ...editedRoomTypes,
      JSON.parse(JSON.stringify(editingRoomType)),
    ]);
  };

  const handleAddRoomType = () => {
    const newRoomType = {};
    setNewRoomTypes([...newRoomTypes, newRoomType]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedRoomTypes = [...newRoomTypes];
    updatedRoomTypes[index][field] = value;
    setNewRoomTypes(updatedRoomTypes);
  };

  const handleRemoveRow = (index) => {
    const editingRoomType = editedRoomTypes.find(
      (roomType) => roomType.Type === newRoomTypes[index].Type
    );

    if (editingRoomType) {
      setRoomTypes([...roomTypes, editingRoomType]);
      setEditedRoomTypes(
        editedRoomTypes.filter(
          (roomType) => roomType !== newRoomTypes[index].Type
        )
      );
      setNewRoomTypes(newRoomTypes.filter((_, i) => i !== index));
    } else {
      setNewRoomTypes(newRoomTypes.filter((_, i) => i !== index));
    }
  };

  const handleSaveChanges = async () => {
    for (const roomType of newRoomTypes) {
      if (
        !roomType.Type ||
        !roomType.Price ||
        !roomType.MaxOccupancy ||
        !roomType.BaseCustomer ||
        !roomType.SurchargeRate
      ) {
        const index = newRoomTypes.findIndex(
          (newRoomType) => newRoomType.Type === roomType.Type
        );

        alert(
          `Please fill all fields for room type '${
            roomType.Type || index + roomTypes.length + 1
          }'`
        );
        return;
      }

      if (roomType.MaxOccupancy < roomType.BaseCustomer) {
        alert(
          `Max Occupancy (${roomType.MaxOccupancy}) must be >= Base Customers (${roomType.BaseCustomer}) for room type '${roomType.Type}'`
        );
        return;
      }

      if (
        newRoomTypes.filter((newRoomType) => newRoomType.Type === roomType.Type)
          .length > 1
      ) {
        alert(`Room type '${roomType.Type}' is duplicated`);
        return;
      }

      roomType.MinCustomerForSurcharge = roomType.BaseCustomer;
    }

    for (const roomType of newRoomTypes) {
      const editingRoomType = editedRoomTypes.find(
        (editedRoomType) => editedRoomType.Type === roomType.Type
      );

      if (editingRoomType && roomType.Type === editingRoomType.Type) {
        const response = await updateRoomType(roomType.Type, roomType);
        if (!response.ok) {
          alert(`Failed to UPDATE room type '${roomType.Type}'`);
        }
      } else {
        const response = await createRoomType(roomType);
        if (!response.ok) {
          alert(`Failed to CREATE room type '${roomType.Type}'`);
        }
      }
    }

    setNewRoomTypes([]);
    setEditedRoomTypes([]);

    const data = await getRoomTypes();
    const updatedRoomTypes = data.map((roomType) => ({
      Type: roomType.Type,
      Price: roomType.Price,
      MaxOccupancy: roomType.Max_Occupancy,
      BaseCustomer: roomType.Min_Customer_for_Surcharge,
      SurchargeRate: roomType.Surcharge_Rate,
      IsInUse: roomTypes.find((room) => room.Type === roomType.Type)
        ? true
        : false,
    }));
    setRoomTypes(updatedRoomTypes);
  };

  const renderNewRow = (roomType, index) => (
    <tr key={index}>
      <td className="border px-2">{index + roomTypes.length + 1}</td>
      <td className="border px-2">
        {editedRoomTypes
          .map((roomType) => roomType.Type)
          .includes(roomType.Type) ? (
          <>{roomType.Type}</>
        ) : (
          <select
            value={roomType.Type}
            onChange={(e) => handleFieldChange(index, 'Type', e.target.value)}
            className="text-center"
          >
            <option value="">Type</option>
            {typeOptions
              .filter(
                (type) =>
                  !roomTypes.map((roomType) => roomType.Type).includes(type)
              )
              .filter(
                (type) =>
                  !editedRoomTypes
                    .map((roomType) => roomType.Type)
                    .includes(type)
              )
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        )}
      </td>
      <td className="border px-2">
        <select
          value={roomType.Price}
          onChange={(e) => handleFieldChange(index, 'Price', e.target.value)}
          className="text-center"
        >
          <option value="">Price</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              ${price}
            </option>
          ))}
        </select>
      </td>
      <td className="border px-2">
        <select
          value={roomType.MaxOccupancy}
          onChange={(e) =>
            handleFieldChange(index, 'MaxOccupancy', e.target.value)
          }
          className="text-center"
        >
          <option value="">Max Occupancy</option>
          {maxOccupancyOptions.map((occupancy) => (
            <option key={occupancy} value={occupancy}>
              {occupancy} people
            </option>
          ))}
        </select>
      </td>
      <td className="border px-2">
        <select
          value={roomType.BaseCustomer}
          onChange={(e) =>
            handleFieldChange(index, 'BaseCustomer', e.target.value)
          }
          className="text-center"
        >
          <option value="">Base Customers</option>
          {baseCustomerOptions.map((customer) => (
            <option key={customer} value={customer}>
              {customer} people
            </option>
          ))}
        </select>
      </td>
      <td className="border px-2">
        <select
          value={roomType.SurchargeRate}
          onChange={(e) =>
            handleFieldChange(index, 'SurchargeRate', e.target.value)
          }
          className="text-center"
        >
          <option value="">Surcharge Rate</option>
          {surchargeRateOptions.map((rate) => (
            <option key={rate} value={rate}>
              {rate * 100}%
            </option>
          ))}
        </select>
      </td>
      <td className="border p-1">
        <div className="flex justify-center gap-2">
          <Button
            text="❌"
            color="red"
            onClick={() => handleRemoveRow(index)}
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
            <th className="border bg-zinc-400 px-2">Type</th>
            <th className="border bg-zinc-400 px-2">Price</th>
            <th className="border bg-zinc-400 px-2 w-1/5 text-lg">
              Max Occupancy
            </th>
            <th className="border bg-zinc-400 px-2 w-1/5 text-lg">
              Base Customers
            </th>
            <th className="border bg-zinc-400 px-2">Surcharge</th>
            <th className="border bg-zinc-400 px-2">Edit</th>
          </tr>
        </thead>
        <tbody className="lg:text-lg text-base font-amethysta">
          {roomTypes.map((roomType, index) => (
            <tr key={index}>
              <td className="border px-2">{index + 1}</td>
              <td className="border px-2">{roomType.Type}</td>
              <td className="border px-2">${roomType.Price}</td>
              <td className="border px-2">{roomType.MaxOccupancy} people</td>
              <td className="border px-2">{roomType.BaseCustomer} people</td>
              <td className="border px-2">{roomType.SurchargeRate * 100}%</td>
              <td className="border p-1">
                <div className="flex justify-center gap-2">
                  <Button
                    color="orange"
                    text="✏️"
                    onClick={() => handleEditRoomType(roomType.Type)}
                    disabled={roomType.IsInUse}
                  />
                </div>
              </td>
            </tr>
          ))}
          {newRoomTypes.map(renderNewRow)}
        </tbody>
      </table>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          text="Add Room Type"
          onClick={handleAddRoomType}
          color="black"
        />
        <Button text="Save Changes" onClick={handleSaveChanges} color="red" />
      </div>
    </div>
  );
};

export default RoomTypes;
