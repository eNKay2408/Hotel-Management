import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
  Regulations,
  NotFound,
} from './pages';

import { Header, Footer, Sidebar } from './components';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex">
      {/* Kiểm tra nếu không phải là trang Home thì hiển thị Sidebar */}
      {location.pathname !== '/' && <Sidebar />}
      <div className="w-full">{children}</div>
    </div>
  );
};

const App = () => {
  return (
    <div className="xl:max-w-[1280px] w-full mx-auto border-x-4 border-gray">
      <Router>
        <Header />
        <Layout>
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
            <Route path="/regulations" element={<Regulations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
