// BookingSection.js
import React, { useState, useContext, useRef, useEffect  } from 'react';
import FormDataContext from './FormDataContext';

const BookingSection = () => {
    const { formData, updateFormData } = useContext(FormDataContext);

    
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [passengerCount, setPassengerCount] = useState(0);
    const [luggageCount, setLuggageCount] = useState(0);
    const [boosterSeats, setBoosterSeats] = useState(0);
    const [distance, setDistance] = useState(null); // State variable for distance

    const pickupInputRef = useRef(null);
    const dropoffInputRef = useRef(null);
    const mapRef = useRef(null); // Reference to the map div

    const [pickupMarker, setPickupMarker] = useState(null); // State variable for pickup marker
    const [dropoffMarker, setDropoffMarker] = useState(null); // State variable for drop-off marker


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
    const { name, value } = e.target;
    switch (name) {
      case 'pickupLocation':
        setPickupLocation(value);
        break;
      case 'dropOffLocation':
        setDropOffLocation(value);
        break;
      case 'pickupDate':
        setPickupDate(value);
        break;
      case 'pickupTime':
        setPickupTime(value);
        break;
      case 'passengerCount':
        setPassengerCount(parseInt(value));
        break;
      case 'luggageCount':
        setLuggageCount(parseInt(value));
        break;
      case 'boosterSeats':
        setBoosterSeats(parseInt(value));
        break;
      default:
        break;
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
        <div className="w-full md:w-1/2 md:pr-4">
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
                </div>
                <div>
                    <label htmlFor="passengerCount" className="flex mb-1">Number of Passengers</label>
                    <input
                    type="number"
                    id="passengerCount"
                    name="passengerCount"
                    value={passengerCount}
                    min={1}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter number of passengers"
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
                    onChange={handleInputChange}
                    required
                    placeholder="Enter luggage count"
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
                    required
                    onChange={handleInputChange}
                    placeholder="Enter number of booster seats"
                    className="border p-2 rounded-md w-full"
                    />
                </div>
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
