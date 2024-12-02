// *Bookings*
export const getBookings = async () => {
  const response = await fetch('http://localhost:3000/api/bookings');
  return response.json();
};

export const createBooking = async (data) => {
  const response = await fetch('http://localhost:3000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

// *Rooms*
export const getRooms = async () => {
  const response = await fetch('http://localhost:3000/api/rooms');
  return response.json();
};

export const getRoom = async (id) => {
  const response = await fetch(`http://localhost:3000/api/rooms/${id}`);
  return response.json();
};

export const createRoom = async (data) => {
  const response = await fetch('http://localhost:3000/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const updateRoom = async (id, data) => {
  const response = await fetch(`http://localhost:3000/api/rooms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

// *Room Type*
export const getRoomTypes = async () => {
  const response = await fetch('http://localhost:3000/api/roomtypes');
  return response.json();
};

export const getRoomTypeByRoomNumber = async (id) => {
  const response = await fetch(
    `http://localhost:3000/api/roomtypes?roomNumber=${id}`
  );
  return response.json();
};

export const createRoomType = async (data) => {
  const response = await fetch('http://localhost:3000/api/roomtypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const updateRoomType = async (id, data) => {
  const response = await fetch(`http://localhost:3000/api/roomtypes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

// *Customer Type*
export const getCustomerTypes = async () => {
  const response = await fetch('http://localhost:3000/api/customertypes');
  return response.json();
};

export const createCustomerType = async (data) => {
  const response = await fetch('http://localhost:3000/api/customertypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const updateCustomerType = async (id, data) => {
  const response = await fetch(
    `http://localhost:3000/api/customertypes/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response;
};

// *Invoices*
export const getInvoices = async () => {
  const response = await fetch('http://localhost:3000/api/invoices');
  return response.json();
};

export const getInvoice = async (id) => {
  const response = await fetch(`http://localhost:3000/api/invoices/${id}`);
  return response.json();
};

export const createInvoice = async (data) => {
  const response = await fetch('http://localhost:3000/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

// *Booking Customer*
export const getCustomersByBookingId = async (id) => {
  const response = await fetch(
    `http://localhost:3000/api/bookingcustomers?bookingId=${id}`
  );
  return response.json();
};

// * Reports *
export const getReports = async () => {
  const response = await fetch('http://localhost:3000/api/reports');
  return response.json();
};

export const getRevenue = async (month, year) => {
  const response = await fetch(
    `http://localhost:3000/api/reports/revenue?month=${month}&year=${year}`
  );
  return response.json();
};

export const getOccupancy = async (month, year) => {
  const response = await fetch(
    `http://localhost:3000/api/reports/occupancy?month=${month}&year=${year}`
  );
  return response.json();
};
