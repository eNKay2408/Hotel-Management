import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Title, Button } from '../../components';

import { getRooms, deleteRoom, getRoomTypes } from '../../services';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);

  const [searchNumber, setSearchNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await getRooms();
      setRooms(rooms);
      setAllRooms(rooms);

      const roomTypes = await getRoomTypes();
      setRoomTypes(roomTypes);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredRooms = allRooms;

    if (searchNumber) {
      filteredRooms = filteredRooms.filter((room) =>
        room.Number.toString().includes(searchNumber)
      );
    }

    if (filterStatus !== 'all') {
      filteredRooms = filteredRooms.filter(
        (room) => room.IsAvailable === (filterStatus === 'available')
      );
    }

    if (filterType !== 'all') {
      filteredRooms = filteredRooms.filter(
        (room) => room.Type.toLowerCase() === filterType
      );
    }

    setRooms(filteredRooms);
  }, [searchNumber, filterStatus, filterType, allRooms]);

  const handleReset = () => {
    setSearchNumber('');
    setFilterStatus('all');
    setFilterType('all');

    setRooms(allRooms);
  };

  const navigate = useNavigate();

  const handleEditRoom = (number) => {
    navigate(`/rooms/${number}`);
  };

  const handleDeleteRoom = async (number) => {
    if (!window.confirm(`Are you sure you want to delete Room ${number}?`)) {
      return;
    }

    const response = await deleteRoom(number);

    if (response.ok) {
      const updatedRooms = rooms.filter((room) => room.Number !== number);
      setRooms(updatedRooms);
      setAllRooms(updatedRooms);
    } else {
      alert('Room has currently booking');
      const message = await response.text();
      console.error(message);
    }
  };

  return (
    <div className="flex flex-col w-full py-4 px-2 min-h-80">
      <Title title="Room List" />

      <div className="w-full max-w-[900px] mx-auto overflow-x-auto">
        <div className="flex justify-between mb-4">
          <div className="min-w-32 mr-2">
            <Button
              color="red"
              text="Create Room"
              onClick={() => navigate('/rooms/create')}
            />
          </div>
          <div className="flex gap-2 lg:text-xl text-base font-play">
            <input
              type="number"
              placeholder="🔍 Room Number"
              className="border rounded-md px-2 font-bold lg:w-52 w-[125px]"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
            <select
              className="border rounded-md font-bold px-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Type</option>
              {roomTypes.map((type, index) => (
                <option key={index} value={type.Type.toLowerCase()}>
                  {type.Type}
                </option>
              ))}
            </select>
            <select
              className="border rounded-md font-bold px-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <div className="min-w-24">
              <Button text="🔄 Reset" onClick={handleReset} />
            </div>
          </div>
        </div>

        <table className="table-auto text-center w-full">
          <thead className="table-header-group lg:text-xl text-lg font-play">
            <tr className="table-row">
              <th className="border bg-zinc-200 lg:h-12 h-10 px-2">No</th>
              <th className="border bg-zinc-200 px-2">Number</th>
              <th className="border bg-zinc-200 px-2">Type</th>
              <th className="border bg-zinc-200 px-2">Image</th>
              <th className="border bg-zinc-200 px-2">Description</th>
              <th className="border bg-zinc-200 px-2">Status</th>
              <th className="border bg-zinc-200 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="lg:text-lg text-base font-amethysta">
            {rooms.map((room, index) => (
              <tr key={index}>
                <td className="border px-2">{index + 1}</td>
                <td className="border px-2">{room.Number}</td>
                <td className="border px-2">{room.Type}</td>
                <td className="border px-2">
                  <img
                    src={room.ImgUrl}
                    alt={room.Number}
                    className="lg:w-20 lg:h-14 w-12 h-10 object-cover p-1 mx-auto rounded-lg"
                  />
                </td>
                <td className="border px-2 lg:w-60 w-48">
                  {room.Description && room.Description.length > 50
                    ? room.Description.slice(0, 50) + '...'
                    : room.Description}
                </td>
                <td className="border px-2">
                  {room.IsAvailable ? 'Available' : 'Unavailable'}
                </td>
                <td className="border p-1">
                  <div className="flex justify-center gap-2">
                    <Button
                      color="orange"
                      text="✏️"
                      onClick={() => handleEditRoom(room.Number)}
                      disabled={!room.IsAvailable}
                    />
                    <Button
                      color="red"
                      text="❌"
                      onClick={() => handleDeleteRoom(room.Number)}
                      disabled={!room.IsAvailable}
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