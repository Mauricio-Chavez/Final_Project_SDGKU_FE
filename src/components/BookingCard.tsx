import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { format } from 'date-fns';
import useGlobalState from "../context/GlobalState";
import { useState } from "react";

const BookingCard = ({ meet }: any) => {
  const { user } = useGlobalState.getState();
  const [currentDate, setcurrentDate] = useState(new Date());
  const [end , setEnd] = useState(new Date(meet.end_time));
  // date
  const formattedDateStart = format(new Date(meet.start_time), 'PPP');

  // hour
  const formattedTimeStart = format(new Date(meet.start_time), 'p');
  const formattedTimeEnd = format(new Date(meet.end_time), 'p');
  const handleClick = () => {
    window.open(`${meet.meeting_link}`, '_blank');
  };
  return (
    <Card className="mt-1 w-80" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
      <CardBody className="p-3 pb-1" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <Typography variant="h5" color="blue-gray" className="mb-1" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          Summary: {meet.summary}
        </Typography>
        <Typography placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          {formattedDateStart} : {formattedTimeStart} - {formattedTimeEnd}
          {user && user.role === 0 && (
            <>
              <br />Tutor email: {meet.attendees[0]}
            </>
          )}
          {user && user.role === 1 && (
            <>
              <br />Student email: {meet.attendees[1]}
            </>
          )}
        </Typography>
      </CardBody>
      <CardFooter className="p-3 pt-0 mt-0" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <Button disabled={end<currentDate} onClick={handleClick} className="bg-[#70000e] p-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>{ end >= currentDate ? 'Go meeting' : 'Meeting Ended'}</Button>
      </CardFooter>
    </Card>
  );
}

export default BookingCard;