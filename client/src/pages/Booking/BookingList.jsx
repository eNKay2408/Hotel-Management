import { useEffect, useState } from 'react';

import { Title, BookingCard } from '../../components';
import { getBookings } from '../../services';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await getBookings();
      setBookings(data);
    };
    loadBookings();
  }, []);

  return (
    <div className="flex flex-col w-full py-4 px-2">
      <Title title="Booking List" />

      <div className="flex flex-wrap items-center justify-evenly gap-4">
        {bookings.map((booking, index) => (
          <BookingCard key={index} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingList;
