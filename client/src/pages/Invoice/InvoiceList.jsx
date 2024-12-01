import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Title, Button } from '../../components';
import {
  getInvoices,
  getCustomersByBookingId,
  createInvoice,
} from '../../services';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getInvoices();
      setInvoices(invoices);
    };

    fetchInvoices();
  }, []);

  const [selectedBooking, setSelectedBooking] = useState({
    bookingId: 0,
    isSelected: false,
  });

  const [selectedBookingList, setSelectedBookingList] = useState([]);

  useEffect(() => {
    const updateSelectedBookings = async () => {
      const selectedCustomers = await getCustomersByBookingId(
        selectedBooking.bookingId
      );

      if (selectedBooking.isSelected) {
        setSelectedBookingList([
          ...selectedBookingList,
          {
            bookingId: selectedBooking.bookingId,
            customers: selectedCustomers,
          },
        ]);
      } else {
        setSelectedBookingList(
          selectedBookingList.filter(
            (booking) => booking.bookingId !== selectedBooking.bookingId
          )
        );
      }
    };

    updateSelectedBookings();
  }, [selectedBooking]);

  const handleSelect = (e) => {
    if (e.target.checked) {
      setSelectedBooking({
        bookingId: invoices[e.target.value].BookingId,
        isSelected: true,
      });
    } else {
      setSelectedBooking({
        bookingId: invoices[e.target.value].BookingId,
        isSelected: false,
      });
    }
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getCustomerIdByName = (name) => {
    for (const booking of selectedBookingList) {
      for (const customer of booking.customers) {
        if (customer.Name == name) {
          return customer.CustomerID;
        }
      }
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const representativeId = getCustomerIdByName(e.target.representative.value);
    console.log(representativeId);
    const bookings = selectedBookingList.map((booking) => booking.bookingId);

    if (bookings.length === 0) {
      alert('Please select at least 1 booking');
      return;
    }

    const data = {
      RepresentativeId: representativeId,
      Bookings: bookings,
    };

    const response = await createInvoice(data);

    if (response.status === 201) {
      const invoiceId = await response.json();

      navigate(`/invoices/${invoiceId}`);
    } else {
      alert('Failed to create invoice');
      console.error(response);
    }
  };

  return (
    <div className="flex flex-col w-full py-4 px-2 min-h-80">
      <Title title="Invoice List" />

      <div className="lg:w-[70%] w-full mx-auto overflow-x-auto">
        <table className="table-auto text-center w-full">
          <thead className="table-header-group md:text-xl text-lg font-play text-zinc-100">
            <tr className="table-row">
              <th className="border bg-orange md:h-12 h-10 px-2">No</th>
              <th className="border bg-orange px-2">Room</th>
              <th className="border bg-orange px-2">Booking Date</th>
              <th className="border bg-orange px-2">Nights</th>
              <th className="border bg-orange px-2">Price</th>
              <th className="border bg-orange px-2">Select</th>
            </tr>
          </thead>
          <tbody className="md:text-lg text-base font-amethysta">
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td className="border py-2 border-gray">{index + 1}</td>
                <td className="border px-2 border-gray">
                  {invoice.RoomNumber}
                </td>
                <td className="border px-2 border-gray">
                  {formatDate(invoice.BookingDate)}
                </td>
                <td className="border px-2 border-gray">{invoice.Nights}</td>
                <td className="border px-2 border-gray">
                  {'$' + invoice.Price}
                </td>
                <td className="border px-2 border-gray">
                  <input
                    type="checkbox"
                    onClick={handleSelect}
                    value={index}
                    className="cursor-pointer w-5 h-5 appearance-none border border-gray rounded-md checked:bg-orange checked:border-transparent mt-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form
          className="flex justify-between mt-6 gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-start items-center gap-2 md:text-lg text-md font-amethysta">
            <label htmlFor="representative">Select Representative</label>
            <select
              className="rounded-md font-bold p-2 focus:ring-2 focus:ring-red border"
              id="representative"
            >
              {selectedBookingList.length > 0 ? (
                selectedBookingList.map((booking) =>
                  booking.customers.map((customer, index) => (
                    <option key={index} value={customer.CustomerId}>
                      {customer.Name}
                    </option>
                  ))
                )
              ) : (
                <option value="0">No Representative</option>
              )}
            </select>
          </div>
          <div className="flex items-center">
            <Button text="Create Invoice" color="red" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceList;
