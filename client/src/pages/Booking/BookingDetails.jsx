import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { CustomerForm, Title, Button } from '../../components';

import { createBooking, getRooms } from '../../services';

const BookingDetails = () => {
  const { id: Number } = useParams();

  const [occupancy, setOccupancy] = useState();

  const navigate = useNavigate();
  const isExecuted = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isExecuted.current) return;
      isExecuted.current = true;

      const rooms = await getRooms();
      const room = rooms.find((room) => room.Number == Number);

      if (!room) {
        alert('Room not found');
        navigate('/bookings');
        return;
      }

      if (room.Status) {
        alert('Room is not available');
        navigate('/bookings');
        return;
      }

      setOccupancy(room.Occupancy);
    };

    fetchData();
  }, [Number, navigate]);

  const handleAddCustomer = () => {
    if (occupancy >= 10) {
      alert('Maximum occupancy is 10');
      return;
    } else {
      setOccupancy(occupancy + 1);
    }
  };

  const handleDeleteCustomer = () => {
    if (occupancy > 1) {
      setOccupancy(occupancy - 1);
    } else {
      alert('Minimum occupancy is 1');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const customerMap = {};
    const customersData = [];

    formData.forEach((value, key) => {
      const [index, field] = key.split('-');

      if (!customerMap[index]) {
        customerMap[index] = {};
      }

      customerMap[index][field] = value;
    });

    for (const index in customerMap) {
      customersData.push(customerMap[index]);
    }

    const bookingData = {
      RoomId: Number,
      Customers: customersData,
    };

    const response = await createBooking(bookingData);

    if (response.status === 201) {
      alert('Booking created successfully');
      navigate('/bookings');
    } else {
      alert(response.text);
      console.error(response.text);
    }
  };

  return (
    <div className="flex flex-col w-full py-4 px-2">
      <Title title={`Booking Details - Room ${Number}`} />

      <div className="text-center font-play mt-[-16px] text-2xl opacity-60">
        Start date:{' '}
        <span className="font-bold">
          {new Date().toLocaleDateString('en-GB')}
        </span>
      </div>

      <div className="flex justify-center gap-2 mt-4 py-4">
        <Button
          color="green"
          text="Add Customer"
          onClick={() => handleAddCustomer()}
        />
        <Button
          color="red"
          text="Delete Customer"
          onClick={() => handleDeleteCustomer()}
        />
      </div>

      <form
        className="flex flex-col items-center justify-evenly gap-4"
        onSubmit={handleSubmit}
      >
        {[...Array(occupancy)].map((_, index) => (
          <CustomerForm key={index + 1} index={index + 1} />
        ))}
        <Button color="orange" text="CONFIRM" type="submit" />
      </form>
    </div>
  );
};

export default BookingDetails;
