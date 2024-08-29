"use client";
import React, { useState } from "react";
import ConsignmentForm from "@/components/ConsignmentForm";
import ConsignmentTable from "@/components/ConsignmentTable";
import Sidebar from "@/components/Sidebar";
import logo from '../images/logo.png';
import Image from 'next/image';

const MainComponent = () => {
  const [activeComponent, setActiveComponent] = useState('welcome');

  const renderContent = () => {
    switch (activeComponent) {
      case 'form':
        return <ConsignmentForm />;
      case 'history':
        return <ConsignmentTable />;
      default:
        return <div className="flex flex-col items-center justify-center h-full text-center">
 <Image
    src={logo}
    alt="Logo"
    width={200}
    height={150}
    className="animate-bounce w-[200px] h-[150px]"
/>
          <h1 className="text-6xl text-tertiary animate-pulse font-black">Welcome to Courier with us</h1></div>;
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainComponent;
