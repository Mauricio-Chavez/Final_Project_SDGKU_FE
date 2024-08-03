import './Booking.css';
import BookingCard from '../../components/BookingCard';
import { useEffect, useState } from 'react';
import Booking from '../../models/Booking';
import TutorService from '../../service/tutor/TutorService';
import { Typography } from '@material-tailwind/react';


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
      <Typography variant="h1" className="title" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Bookings</Typography>
      <Typography variant="h2" className='upcoming' placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Upcoming Bookings</Typography>
      <div className="cards-container">
        {
          bookings.filter(meet => new Date(meet.end_time) >= currentDate).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map((meet) => {
            return (
              <BookingCard meet={meet} />
            );
          })
        }
      </div>
      <Typography variant="h2" className='past' placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Past Bookings</Typography>
      <div className='cards-container'>
        {
          bookings.filter(meet => new Date(meet.end_time) < currentDate).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map((meet) => {
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