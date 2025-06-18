import React from 'react';
import Header from '../../components/Header';
import Footer from "../../components/Footer/Footer";


export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Nội dung trang chiếm hết không gian còn lại */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
