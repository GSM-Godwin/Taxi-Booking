// Payment.jsx
import React, { useState, useContext } from 'react';
import emailjs from 'emailjs-com'; // Import EmailJS SDK
import FormDataContext from './FormDataContext';
import { PayPalButton } from 'react-paypal-button-v2'; // Import PayPal button component

const Payment = () => {
    const { formData, updateFormData } = useContext(FormDataContext);
    const apiKey = 'tQSG_Rs2blISwvPAo'
    const { selectedCar } = formData.carSelection

    // Retrieve selected car price
    const selectedCarPrice = selectedCar.price;
    

    // Handle payment platform selection
    const handlePaymentPlatformSelection = (platform) => {
        // Update payment method in formData
        updateFormData('payment', { ...formData.payment, paymentMethod: platform });
        setPaymentMethod(platform); // Update payment method state
    };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'additionalInfo':
        setAdditionalInfo(value);
        break;
      case 'paymentMethod':
        setPaymentMethod(value);
        break;
      default:
        break;
    }
    updateFormData('payment', { ...formData.payment, [name]: value });
  };

  const handlePaymentSuccess = (details, data) => {
    // Handle successful payment
    console.log('Payment successful:', details);
    if (paymentMethod === 'paypal') {
        handleSubmit(); // Trigger form submission if PayPal payment is successful
    }
    };

    const handlePaymentError = (err) => {
        // Handle payment error
        console.error('Payment error:', err);
    };


  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Extract data from each section
    const { booking, carSelection, payment } = formData;

    // Construct formDataToSend object with data from all sections
    const formDataToSend = {
        booking,
        carSelection,
        payment,
    };

    // Call EmailJS send method with your service ID, template ID, and form data
    emailjs.send('service_e28q19h', 'template_3800k5b', formDataToSend, apiKey)
        .then((result) => {
            console.log('Email sent successfully:', result.text);

            // Reset form fields
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setEmail('');
            setAdditionalInfo('');
            setPaymentMethod('');
            // Display alert message
            alert('Your ride is on its way. Kindly get your booking details in your mail.');
            // Refresh the page
            window.location.reload();
        }, (error) => {
            console.error('Error sending email:', error.text);
        });
};

  return (
    <div className="flex mt-8 p-6 bg-gray-100 rounded-md shadow-md">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Details and Payment</h2>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className='col-span-2 lg:col-span-1'>
                    <label htmlFor="firstName" className="flex mb-1">First Name</label>
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                    className="border p-2 rounded-md w-full"
                    />
                    </div>
                    <div className='col-span-2 lg:col-span-1'>
                    <label htmlFor="lastName" className="flex mb-1">Last Name</label>
                    <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="border p-2 rounded-md w-full"
                    />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                    <label htmlFor="phoneNumber" className="flex mb-1">Phone Number</label>
                    <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                    className="border p-2 rounded-md w-full"
                    />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                    <label htmlFor="email" className="flex mb-1">Email</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                    className="border p-2 rounded-md w-full"
                    />
                </div>
                <div className="col-span-2">
                    <label htmlFor="additionalInfo" className="flex mb-1">Additional Info</label>
                    <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Enter additional information"
                    className="border p-2 rounded-md w-full h-32"
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="paymentMethod" className="flex mb-1">Payment Method</label>
                    <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded-md w-full"
                    >
                    <option value="">Select Payment Method</option>
                    <option onClick={() => handlePaymentPlatformSelection('Cash')} value="cash">Cash</option>
                    <option onClick={() => handlePaymentPlatformSelection('Paypal')} value="paypal">Card/PayPal</option>
                    </select>
                </div>
            </div>
            {/* Conditionally render PayPal button */}
            {paymentMethod === 'paypal' && (
                        <PayPalButton
                            amount={selectedCarPrice} // Pass the amount to be paid
                            onSuccess={handlePaymentSuccess} // Callback for successful payment
                            onError={handlePaymentError} // Callback for payment error
                            options={{
                                clientId: 'ASpzIPFU4adHK1_jok_lWyj0buLhsBG9XNOGrhFr8T2YNCMwIkxMMdhrLKxJmr71woU7z0IAzWZy9TzQ', // Replace with your PayPal client ID
                            }}
                        />
                    )}
           {/* Conditionally render submit button if payment method is not PayPal */}
           {paymentMethod !== 'paypal' && (
                        <div className='mt-4 text-white font-bold'>
                            <button type='submit' className={`bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md`}>
                                Submit
                            </button>
                        </div>
                    )}
        </form>
      </div>

    </div>
  );
};

export default Payment;
