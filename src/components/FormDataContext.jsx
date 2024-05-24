// FormDataContext.js
import React, { createContext, useState } from 'react';

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    booking: {
      pickupLocation: '',
      dropOffLocation: '',
      pickupDate: '',
      pickupTime: '',
      passengerCount: 0,
      luggageCount: 0,
      boosterSeats: 0,
      distance: null,
      returnDate: '',
      returnTime: '',
      returnTrip: false,
    },
    carSelection: {
      selectedCar: '',
    },
    payment: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      additionalInfo: '',
      paymentMethod: '',
    }
  });

  const updateFormData = (section, data) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [section]: data
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataContext; 
