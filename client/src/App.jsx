import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
  BookingList,
  BookingDetails,
  RoomList,
  RoomDetails,
  InvoiceList,
  InvoiceDetails,
  ReportsOverview,
  RevenueReport,
  OccupancyReport,
  Home,
  Settings,
  NotFound,
} from './pages';

import { Header, Footer, Sidebar } from './components';

const App = () => {
  return (
    <div className="xl:max-w-[1280px] w-full mx-auto border-x-4 border-gray">
      <Router>
        <Header />
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/rooms/create" element={<RoomDetails />} />
            <Route path="/reports" element={<ReportsOverview />} />
            <Route path="/reports/revenue" element={<RevenueReport />} />
            <Route path="/reports/occupancy" element={<OccupancyReport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
