import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import { Title, Button } from "../../components";
import { getRoom, updateRoom } from "../../services";

const RoomDetails = () => {
  const { id: number } = useParams();

  const [room, setRoom] = useState({});

  useEffect(() => {
    const loadRoom = async () => {
      const data = await getRoom(number);
      setRoom(data);
    };
    loadRoom();
  }, [number]);

  const imageRef = useRef(null);

  const handleImageUpload = () => {
    const file = imageRef.current.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setRoom({ ...room, image: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateRoom(number, room);
    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      navigate("/rooms");
    } else {
      alert(data.message);
      console.error(response);
    }
  };

  return (
    <div className="flex flex-col w-full py-4 px-2">
      <Title title="Room Details" />

      <div className="mx-auto max-w-[700px] w-full">
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <div className="grid md:grid-cols-2 grid-cols-1 font-play gap-4">
            {Object.entries(room)
              .filter(([key]) => key !== "image")
              .map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="font-bold text-xl">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={value}
                    className="border rounded-md px-2 py-1 text-lg"
                    onChange={(e) =>
                      setRoom({ ...room, [key]: e.target.value })
                    }
                    disabled={key !== "Type" && key !== "Description"}
                  />
                </div>
              ))}
            <div>
              <label className="font-bold text-xl">Image</label>
              <img
                src={room.image || "https://placehold.co/600x400"}
                className="py-2 w-40"
              />
              <input
                type="file"
                className="border rounded-md px-2 py-1 text-sm w-full"
                ref={imageRef}
                onChange={() => handleImageUpload()}
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
