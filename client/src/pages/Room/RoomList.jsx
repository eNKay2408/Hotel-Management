import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Title, Button } from "../../components";

import { getRooms, deleteRoom } from "../../services";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadRooms = async () => {
      const data = await getRooms();
      setRooms(data);
    };
    loadRooms();
  }, []);

  const navigate = useNavigate();

  const handleEditRoom = (number) => {
    navigate(`/rooms/${number}`);
  };

  const handleDeleteRoom = async (number) => {
    if (!window.confirm(`Are you sure you want to delete Room ${number}?`)) {
      return;
    }

    try {
      await deleteRoom(number);

      setRooms(rooms.filter((room) => room.Number !== number));
    } catch (error) {
      console.error(error);
      alert("Failed to delete room");
    }
  };

  return (
    <div className="flex flex-col w-full py-4 px-2">
      <Title title="Room List" />

      <div className="w-full max-w-[800px] mx-auto overflow-x-auto">
        <table className="table-auto text-center w-full">
          <thead className="table-header-group md:text-xl text-lg">
            <tr className="table-row">
              <th className="border bg-zinc-200 md:h-12 h-10 px-1">No</th>
              <th className="border bg-zinc-200 px-1">Number</th>
              <th className="border bg-zinc-200 px-1">Type</th>
              <th className="border bg-zinc-200 px-1">Occupancy</th>
              <th className="border bg-zinc-200 px-1">Price</th>
              <th className="border bg-zinc-200 px-1">Status</th>
              <th className="border bg-zinc-200 px-1">Actions</th>
            </tr>
          </thead>
          <tbody className="md:text-lg text-md">
            {rooms.map((room, index) => (
              <tr key={index}>
                <td className="border px-1">{index + 1}</td>
                <td className="border px-1">{room.Number}</td>
                <td className="border px-1">{room.Type}</td>
                <td className="border px-1">
                  {room.Occupancy} {room.Occupancy > 1 ? "guests" : "guest"}
                </td>
                <td className="border px-1">${room.Price}</td>
                <td className="border px-1">{room.Status}</td>
                <td className="border p-1">
                  <div className="flex justify-center gap-2">
                    <Button
                      color="orange"
                      text="✏️"
                      onClick={() => handleEditRoom(room.Number)}
                    />
                    <Button
                      color="red"
                      text="❌"
                      onClick={() => handleDeleteRoom(room.Number)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomList;
