import './Booking.css';
import BookingCard from '../../components/BookingCard';
import { useEffect, useState } from 'react';
import Booking from '../../models/Booking';
import TutorService from '../../service/tutor/TutorService';


const BookingPage = () => {
  const [bookings, setBooking] = useState<Booking[]>([]);
  const currentDate = new Date();


  async function getBookings() {
    const res = await TutorService.getBookings();
    setBooking(res);
  }

  useEffect(() => {
    getBookings()
  }, []);


  return (
    <div className='booking'>
      <h1>Booking</h1>
      <div className="cards-container">
        {
          bookings.filter(meet => new Date(meet.end_time) >= currentDate).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map((meet) => {
            return (
              <BookingCard meet={meet} />
            );
          })
        }
      </div>
    </div>
  );
};

export default BookingPage;