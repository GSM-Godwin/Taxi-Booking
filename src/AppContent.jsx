import React, { useState } from 'react';
import BookingSection from './components/BookingSection';
import CarSelectionSection from './components/CarSelectionSection';
import Payment from './components/Payment';

import car from './assets/car-icon.png'
import email from './assets/email-icon.png'
import card from './assets/card.png'
import phone from './assets/phone-icon.png'
import logo from './assets/logo.png'

const AppContent = () => {
  const [currentSection, setCurrentSection] = useState(1); // 1 for Booking, 2 for Car Selection, 3 for Payment

  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const getButtonText = () => {
    switch (currentSection) {
      case 1:
        return "Next"; // Change to "Next" when on the first section
      case 2:
        return "Next"; // Change to "Next" when on the second section
      case 3:
        return "Submit"; // Change to "Submit" when on the third section
      default:
        return "Next";
    }
  };

  const getPreviousButtonText = () => {
    return currentSection === 1 ? "Previous" : "Back"; // Change to "Previous" or "Back" based on current section
  };

  return (
    <div className="container mx-auto">
      <div className='flex justify-center items-center py-3'>
            <div id='container' className='bg-gray-100 rounded-md shadow-md p-8'>
              <div className='flex justify-center mb-4'>
                <img src={logo} alt='logo' width={70}/>
              </div>
                <div className='flex flex-row items-center gap-4 mb-3'>
                    <img src={phone} alt='book' width={40} />
                  <p>1. Book your trip</p>
                </div>
                <div className='flex flex-row items-center gap-4 mb-3'>
                  <img src={car} alt='car' width={40}/>
                  <p>2. Select Vehilce</p>
                </div>
                <div className='flex flex-row items-center gap-4 mb-3'>
                  <img src={card} alt='card' width={40}/>
                  <p>3. Finalize and select payment method</p>
                </div>
                <div className='flex flex-row items-center gap-2 ml-[-10px]'>
                  <img src={email} alt='email' width={60}/>
                  <p>4. Receive confirmation mail and await your ride</p>
                </div>
            </div>
        </div>
      {currentSection === 1 && <BookingSection />}
      {currentSection === 2 && <CarSelectionSection />}
      {currentSection === 3 && <Payment />}

      <div className="my-4 flex justify-between ml-10">
        {currentSection !== 1 && (
          <button onClick={handlePrevious} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            {getPreviousButtonText()}
          </button>
        )}
        {currentSection !== 3 && (
          <button onClick={handleNext} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-10 rounded">
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default AppContent;
