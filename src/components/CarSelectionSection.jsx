// CarSelectionSection.js
import React, {useContext, useState} from 'react';
import FormDataContext from './FormDataContext';

import sedan from '../assets/sedan.png'
import SUV from '../assets/suv.png'

const CarSelectionSection = ({ errors }) => {
    const { formData, updateFormData } = useContext(FormDataContext);

    // Retrieve distance from formData
    const distance = formData.booking.distance;
    // const distance = formData.booking.distance * 0.621371; // Distance in miles
    const boosterSeats = formData.booking.boosterSeats
    const isReturnTripBooked = formData.booking.returnTrip

    const [selectedCar, setSelectedCar] = useState({ car: '', price: '' });

    // const handleCarSelection = ({ car, price }) => {
    //     setSelectedCar({ car, price });
    //     updateFormData('carSelection', { selectedCar: { car, price } });
    // };

    const calculatePrice = (car, distance, boosterSeats) => {
        let basePrice = 0;
        switch (car) {
            case 'SUV':
                if (distance <= 5) {
                    basePrice = 1.40;
                } else if (distance <= 15) {
                    basePrice = 1.40;
                } else if (distance <= 25) {
                    basePrice = 1.40;
                } else if (distance <= 35) {
                    basePrice = 1.40;
                } else if (distance <= 45) {
                    basePrice = 1.40;
                } else if (distance <= 55) {
                    basePrice = 1.40;
                } else if (distance <= 70) {
                    basePrice = 1.40;
                } else if (distance <= 100) {
                    basePrice = 1.40;
                } else if (distance > 100) {
                    basePrice = 1.40;
                }
                break;
            case 'Sedan':
                if (distance <= 5) {
                    basePrice = 1.40;
                } else if (distance <= 15) {
                    basePrice = 1.40;
                } else if (distance <= 25) {
                    basePrice = 1.40;
                } else if (distance <= 35) {
                    basePrice = 1.40;
                } else if (distance <= 45) {
                    basePrice = 1.40;
                } else if (distance <= 55) {
                    basePrice = 1.40;
                } else if (distance <= 70) {
                    basePrice = 1.40;
                } else if (distance <= 100) {
                    basePrice = 1.40;
                } else if (distance > 100) {
                    basePrice = 1.40;
                }
                break;
            default:
                break;
        }
        // Add additional charge for booster seats
        const boosterSeatCharge = boosterSeats * 1;
        let totalPrice = basePrice * distance + boosterSeatCharge;

        if (isReturnTripBooked) {
            totalPrice *= 2;
        }

        return totalPrice.toFixed(2);
    };

    const handleCarSelection = ({ car }) => {
        const price = calculatePrice(car, distance, boosterSeats);
        setSelectedCar({ car, price });
        updateFormData('carSelection', { selectedCar: { car, price } });
        updateFormData('booking', { ...formData.booking, price }); // Store the price in booking section of formData
    };

      // Function to determine card border style based on selected car
    const getCardBorderStyle = (car) => {
        return selectedCar.car === car ? 'border border-blue-500 border-2' : 'border border-gray-300';
    };

  return (
    <div className="flex mt-8 p-6 bg-gray-100 rounded-md shadow-md">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Car Selection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* First Card */}
          <div className={`border rounded-md overflow-hidden shadow-md ${getCardBorderStyle('SUV')}`}>
            <div className="p-4">
              <h2 className="flex text-lg font-bold mb-2 justify-center">SUV</h2>
              <img src={SUV} alt="SUV" className="w-full h-full object-cover pt-24 mb-2" />
              <p className="mb-2 font-bold">Price: €{calculatePrice('SUV', distance, boosterSeats)}</p>
              <button onClick={() => handleCarSelection({ car: 'SUV' })} className="bg-blue-500 text-white py-2 px-4 rounded-md">Select SUV</button>
            </div>
          </div>
          {/* Second Card */}
          <div className={`border rounded-md overflow-hidden shadow-md ${getCardBorderStyle('Sedan')}`}>
            <div className="p-4">
              <h2 className="flex text-lg font-bold mb-2 justify-center">Sedan</h2>
              <img src={sedan} alt="Sedan" width={40} className="w-full h-full object-cover mb-2 mt-10 lg:mt-20" />
              <p className="mt-16 mb-2 font-bold">Price: €{calculatePrice('Sedan', distance, boosterSeats)}</p>
              <button onClick={() => handleCarSelection({ car: 'Sedan' })} className="bg-blue-500 text-white py-2 px-4 rounded-md">Select Sedan</button>
            </div>
          </div>
        </div>
        {errors.car && <div className="error">{errors.car}</div>}
      </div>
    </div>
  );
};

export default CarSelectionSection;