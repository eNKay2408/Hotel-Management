import { Button } from './index';

const BookingCard = ({
  booking: { Number, Type, MaxOccupancy, Price, ImgUrl, BaseCustomers },
}) => {
  const handleBooking = (Number) => {
    window.location.href = `/bookings/${Number}`;
  };

  return (
    <div className="bg-zinc-200 md:p-4 p-2 rounded-md flex font-amethysta md:gap-6 gap-3">
      <div className="flex items-center">
        <img
          src={ImgUrl}
          alt={Number}
          className="md:w-40 md:h-28 w-24 h-20 rounded-md object-cover"
        />
      </div>

      <div className="flex flex-col justify-center md:text-lg text-md">
        <p>Number: {Number}</p>
        <p>Type: {Type}</p>
        <p>Base Customers: {BaseCustomers}</p>
        <p>Max Occupancy: {MaxOccupancy}</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center md:gap-2 gap-1">
        <div className="flex flex-col">
          <p className="font-bold tracking-widest text-orange md:text-xl text-md text-center">
            ${Price}
          </p>
          <p className="text-zinc-600 text-[12px] mt-[-2px]">per night</p>
        </div>
        <Button color="red" text="BOOK" onClick={() => handleBooking(Number)} />
      </div>
    </div>
  );
};

export default BookingCard;
