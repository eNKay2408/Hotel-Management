import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { Title, Button } from '../../components';
import { getRoom, updateRoom, createRoom, getRoomTypes } from '../../services';

const RoomDetails = () => {
  const { id: number } = useParams();

  const [room, setRoom] = useState({
    Number: '',
    Type: 'A',
    Description: '',
    ImgUrl: 'https://placehold.co/400',
  });

  const [roomTypes, setRoomTypes] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const types = await getRoomTypes();
      setRoomTypes(types);

      if (!number) return;
      const data = await getRoom(number);
      setRoom(data);
    };

    fetchData();
  }, [number]);

  const imageRef = useRef(null);

  const handleImageUpload = () => {
    const file = imageRef.current.files[0];

    if (file.size > 1 * 1024 * 1024) {
      alert('Image size is too large. Only images up to 1MB are allowed');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = () => {
        setRoom({ ...room, ImgUrl: reader.result });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      alert('An error occurred while uploading the image');
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleUpdateRoom = async (e) => {
    e.preventDefault();

    setLoading(true);

    const response = await updateRoom(number, room);
    const data = await response.json();

    if (response.ok) {
      navigate('/rooms');
    } else {
      alert(data.message);
      console.error(response);
    }

    setLoading(false);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    setLoading(true);

    room.RoomId = room.Number;

    const response = await createRoom(room);
    const data = await response.json();

    if (response.ok) {
      navigate('/rooms');
    } else {
      alert(data.message);
      console.error(response);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full py-4 px-2">
      <Title title="Room Details" />

      {loading && (
        <p className="text-center text-red text-2xl font-bold mb-4">
          Room is being saved...
        </p>
      )}

      <div className="mx-auto max-w-[700px] w-full">
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={number ? handleUpdateRoom : handleCreateRoom}
        >
          <div className="grid md:grid-cols-2 grid-cols-1 font-play gap-4">
            <div className="flex flex-col">
              <label className="font-bold text-xl">Number</label>
              <input
                required
                type="number"
                value={room.Number}
                className="border rounded-md px-2 py-1 text-lg"
                onChange={(e) => {
                  if (e.target.value.length > 3) return;
                  setRoom({ ...room, Number: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === 'e' ||
                    e.key === '.' ||
                    e.key === '-' ||
                    e.key === '+' ||
                    e.key === 'E'
                  ) {
                    e.preventDefault();
                  }
                }}
                disabled={number ? true : false}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-xl">Type</label>
              <select
                required
                className="border rounded-md px-2 py-[7px] text-lg"
                value={room.Type}
                onChange={(e) => setRoom({ ...room, Type: e.target.value })}
              >
                {roomTypes.map((type, index) => (
                  <option key={index} value={type.Type}>
                    {type.Type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-xl">Description</label>
              <textarea
                type="text"
                value={room.Description}
                className="border rounded-md px-2 py-1 text-lg"
                rows="6"
                onChange={(e) =>
                  setRoom({ ...room, Description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-bold text-xl">Image</label>
              <input
                type="file"
                className="border rounded-md px-2 py-[5px] text-sm w-full"
                ref={imageRef}
                onChange={() => handleImageUpload()}
              />
              <img
                src={room.ImgUrl}
                className="w-44 h-[132px] object-cover rounded-lg mt-2 shadow-lg"
              />
            </div>
          </div>

          <Button color="green" text="Save Room" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default RoomDetails;
