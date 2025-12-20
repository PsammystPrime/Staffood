import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/products" element={<Home />} /> {/* Reuse Home for now or add separate Products page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
