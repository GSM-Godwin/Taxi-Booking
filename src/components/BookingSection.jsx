import React, { useState, useContext, useRef, useEffect  } from 'react';
import FormDataContext from './FormDataContext';

const BookingSection = ({ errors, setErrors }) => {
    const { formData, updateFormData } = useContext(FormDataContext);
    
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [passengerCount, setPassengerCount] = useState(1);
    const [luggageCount, setLuggageCount] = useState(1);
    const [boosterSeats, setBoosterSeats] = useState(0);
    const [distance, setDistance] = useState(null); // State variable for distance
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');

    const pickupInputRef = useRef(null);
    const dropoffInputRef = useRef(null);
    const mapRef = useRef(null); // Reference to the map div

    const [pickupMarker, setPickupMarker] = useState(null); // State variable for pickup marker
    const [dropoffMarker, setDropoffMarker] = useState(null); // State variable for drop-off marker

    const [isChecked, setIsChecked] = useState(formData.booking.returnTrip);


  useEffect(() => {
    // Initialize the autocomplete for the pickup input field
    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current);
    pickupAutocomplete.setFields(['formatted_address']);
    pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (!place.formatted_address) {
          return;
        }
        setPickupLocation(place.formatted_address); // Update state variable
        updateFormData('booking', { ...formData.booking, pickupLocation: place.formatted_address });
      });

    // Initialize the autocomplete for the drop-off input field
    const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffInputRef.current);
    dropoffAutocomplete.setFields(['formatted_address']);
    dropoffAutocomplete.addListener('place_changed', () => {
        const place = dropoffAutocomplete.getPlace();
        if (!place.formatted_address) {
          return;
        }
        setDropOffLocation(place.formatted_address); // Update state variable
        updateFormData('booking', { ...formData.booking, dropOffLocation: place.formatted_address });
      });

        // Initialize the map
        const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 }, // Default center (Sydney, Australia)
        zoom: 12, // Default zoom level
    });
    
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(currentLocation);
          },
          () => {
            console.log('Error: The Geolocation service failed.');
          }
        );
      } else {
        console.log('Error: Your browser doesn\'t support geolocation.');
      }
        // Add markers for pickup and drop-off locations
        if (pickupLocation) {
            const pickupGeocoder = new window.google.maps.Geocoder();
            pickupGeocoder.geocode({ address: pickupLocation }, (results, status) => {
                if (status === 'OK') {
                    const pickupMarker = new window.google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        label: 'P',
                    });
                    map.setCenter(results[0].geometry.location); // Center the map on the pickup location
                } else {
                    console.error('Geocode was not successful for the following reason:', status);
                }
            });
        }

        if (dropOffLocation) {
            const dropoffGeocoder = new window.google.maps.Geocoder();
            dropoffGeocoder.geocode({ address: dropOffLocation }, (results, status) => {
                if (status === 'OK') {
                    const dropoffMarker = new window.google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        label: 'D',
                    });
                    map.setCenter(results[0].geometry.location); // Center the map on the drop-off location
                } else {
                    console.error('Geocode was not successful for the following reason:', status);
                }
            });
        }
  }, [pickupLocation, dropOffLocation]);

  const addPickupMarker = (location) => {
    if (pickupMarker) {
      pickupMarker.setMap(null);
    }
    const marker = new window.google.maps.Marker({
      position: location,
      map: mapRef.current,
      label: 'P', // Marker label
    });
    setPickupMarker(marker);
  };

  const addDropoffMarker = (location) => {
    if (dropoffMarker) {
      dropoffMarker.setMap(null);
    }
    const marker = new window.google.maps.Marker({
      position: location,
      map: mapRef.current,
      label: 'D', // Marker label
    });
    setDropoffMarker(marker);
  };

  const addRouteMarker = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
  
    directionsRenderer.setMap(mapRef.current);
  
    const request = {
      origin: pickupMarker.getPosition(),
      destination: dropoffMarker.getPosition(),
      travelMode: 'DRIVING', // You can change this to 'WALKING', 'BICYCLING', etc.
    };
  
    directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        console.error('Error fetching directions:', status);
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

      if (type === 'checkbox') {
        setIsChecked(checked);
        updateFormData('booking', { returnTrip: checked });
      } else {
        switch (name) {
          case 'pickupLocation':
            setPickupLocation(value);
            errors.pickupLocation=""
            break;
          case 'dropOffLocation':
            setDropOffLocation(value);
            errors.dropOffLocation=""
            break;
          case 'pickupDate':
            setPickupDate(value);
            errors.pickupDate=""
            break;
          case 'pickupTime':
            setPickupTime(value);
            errors.pickupTime=""
            break;
          case 'passengerCount':
            setPassengerCount(parseInt(value) <= 6 ? parseInt(value) : "");
            errors.passengerCount=""
            break;
          case 'luggageCount':
            setLuggageCount(parseInt(value) <= 6 ? parseInt(value) : "");
            errors.luggageCount=""
            break;
          case 'boosterSeats':
            setBoosterSeats(parseInt(value) <= 3 ? parseInt(value) : "");
            errors.boosterSeats=""
            break;
          case 'returnDate':
            setReturnDate(value);
            errors.returnDate=""
            break;
          case 'returnTime':
            setReturnTime(value);
            errors.returnTime=""
            break;
          default:
            break;
        }
    }

    updateFormData('booking', {
        ...formData.booking,
        [name]: value,
        pickupLocation: name === 'pickupLocation' ? value : pickupLocation,
        dropOffLocation: name === 'dropOffLocation' ? value : dropOffLocation,
        pickupDate: name === 'pickupDate' ? value : pickupDate,
        pickupTime: name === 'pickupTime' ? value : pickupTime,
        passengerCount: name === 'passengerCount' ? parseInt(value) : passengerCount,
        luggageCount: name === 'luggageCount' ? parseInt(value) : luggageCount,
        boosterSeats: name === 'boosterSeats' ? parseInt(value) : boosterSeats,
        returnTrip : name === 'returnTrip' ? value : isChecked,
        returnDate: name === 'returnDate' ? value : returnDate,
        returnTime: name === 'returnTime' ? value : returnTime,
      });
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Format month and day with leading zero if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    // Format hours and minutes with leading zero if needed
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    // Calculate distance between pickup and drop-off locations
    if (pickupLocation && dropOffLocation) {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [pickupLocation],
                destinations: [dropOffLocation],
                travelMode: 'DRIVING',
            },
            (response, status) => {
                if (status === 'OK') {
                    const element = response.rows[0].elements[0];
                    if (element.status === 'OK') {
                        const distance = element.distance.value / 1000; // Distance in kilometers
                            // Update formData state with distance
                            updateFormData('booking', { ...formData.booking, distance });
                    }
                }
            }
        );
    }
}, [pickupLocation, dropOffLocation]);

return (
    <div className="flex flex-col lg:flex-row mt-8 p-6 bg-gray-100 rounded-md shadow-md">
        <div className="w-full md:pr-4">
            <h2 className="text-2xl font-bold mb-4">Booking</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="pickupLocation" className="flex mb-1">Pick-up Location</label>
                    <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={pickupLocation}
                    onChange={handleInputChange}
                    ref={pickupInputRef}
                    required
                    placeholder="Enter pick-up location"
                    className="border p-2 rounded-md w-full"
                    />
                    {errors.pickupLocation && <div className="error">{errors.pickupLocation}</div>}
                </div>
                <div>
                    <label htmlFor="dropOffLocation" className="flex mb-1">Drop-off Location</label>
                    <input
                    type="text"
                    id="dropOffLocation"
                    name="dropOffLocation"
                    value={dropOffLocation}
                    onChange={handleInputChange}
                    ref={dropoffInputRef}
                    required
                    placeholder="Enter drop-off location"
                    className="border p-2 rounded-md w-full"
                    />
                    {errors.dropOffLocation && <div className="error">{errors.dropOffLocation}</div>}
                </div>
                <div>
                    <label htmlFor="pickupDate" className="flex mb-1">Pick-up Date</label>
                    <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={pickupDate}
                    onChange={handleInputChange}
                    required
                    min={getCurrentDate()}
                    className="border p-2 rounded-md w-full"
                    />
                    {errors.pickupDate && <div className="error">{errors.pickupDate}</div>}
                </div>
                <div>
                    <label htmlFor="pickupTime" className="flex mb-1">Pick-up Time</label>
                    <input
                    type="time"
                    id="pickupTime"
                    name="pickupTime"
                    value={pickupTime}
                    onChange={handleInputChange}
                    required
                    min={getCurrentTime()}
                    step="1800" // 30 minutes step
                    className="border p-2 rounded-md w-full"
                    />
                    {errors.pickupTime && <div className="error">{errors.pickupTime}</div>}
                </div>
                <div>
                    <label htmlFor="passengerCount" className="flex mb-1">Number of Passengers</label>
                    <input
                    type="number"
                    id="passengerCount"
                    name="passengerCount"
                    value={passengerCount}
                    min={1}
                    max={6}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="luggageCount" className="flex mb-1">Luggage Count</label>
                    <input
                    type="number"
                    id="luggageCount"
                    name="luggageCount"
                    value={luggageCount}
                    min={0}
                    max={6}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="boosterSeats" className="flex mb-1">Booster Seats</label>
                    <input
                    type="number"
                    id="boosterSeats"
                    name="boosterSeats"
                    value={boosterSeats}
                    min={0}
                    max={3}
                    required
                    onChange={handleInputChange}
                    className="border p-2 rounded-md w-full"
                    />
                </div>
                <div className='flex gap-5 items-center'>
                  <label htmlFor="returnTrip" className='flex mb-1'>Book Return Trip?</label>
                  <input 
                    type="checkbox" 
                    id='returnTrip'
                    name="returnTrip"
                    checked={isChecked}
                    onChange={handleInputChange}
                  />
                </div>
                {isChecked && (
                  <div className='flex flex-col w-full'>
                    <div id='return' className='w-full'>
                      <label htmlFor="returnDate" className="flex mb-1">Return Date</label>
                      <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={returnDate}
                      onChange={handleInputChange}
                      required
                      min={getCurrentDate()}
                      className="border p-2 rounded-md w-full"
                      />
                      {errors.returnDate && <div className="error">{errors.returnDate}</div>}
                  </div>
                  <div className='w-full'>
                      <label htmlFor="returnTime" className="flex mb-1">Return Time</label>
                      <input
                      type="time"
                      id="returnTime"
                      name="returnTime"
                      value={returnTime}
                      onChange={handleInputChange}
                      required
                      min={getCurrentTime()}
                      step="1800" // 30 minutes step
                      className="border p-2 rounded-md w-full"
                      />
                      {errors.returnTime && <div className="error">{errors.returnTime}</div>}
                  </div>
                  </div>
                )}
            </div>
        </div>
        {/* Map placeholder */}
        <div className="flex flex-col lg:w-1/2 lg:mt-4 mt-0 h-[360px]">
            <div ref={mapRef} className="bg-gray-200 h-full hover:bg-gray-300 mt-5 lg:mt-14"></div>
        </div>
    </div>
  );
};

export default BookingSection;
