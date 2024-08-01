import React, { useState } from 'react';
import moment from 'moment-timezone';
import useGlobalState from '../context/GlobalState';
import TutorService from '../service/tutor/TutorService';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';

const TimezoneSelect = ({ onChange }: { onChange: (selectedOption: any) => void }) => {
  const timezones = moment.tz.names().map(tz => ({
    value: tz,
    label: tz,
  }));

  return (
    <Select
      onChange={onChange}
      options={timezones}
      placeholder="Select a timezone"
    />
  );
};

const BookingForm = ({ tutor }: any) => {
  const { user } = useGlobalState.getState();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>();
  const [formData, setFormData] = useState({
    tutor_id: tutor.id,
    user_id: user?.id,
    summary: '',
    start_time: '',
    end_time: '',
    timezone: '',
    attendees: [`${tutor.email}`, `${user?.email}`],
    cardholder_name: '',
    card_number: '',
    expiration_date: '',
    cvv: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimezoneChange = (selectedOption: { value: any; }) => {
    setFormData({
      ...formData,
      timezone: selectedOption.value,
    });
  };

  const onSubmit = async () => {
    const formattedStartTime = formData.start_time.length <= 16 ? `${formData.start_time}:00` : formData.start_time;
    const formattedEndTime = formData.end_time.length <= 16 ? `${formData.end_time}:00` : formData.end_time;

    const bookingData = {
      tutor_id: formData.tutor_id,
      user_id: formData.user_id,
      summary: formData.summary,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      timezone: formData.timezone,
      attendees: formData.attendees,
    };

    console.log('Booking data:', bookingData);
    try {
      const res = await TutorService.createBooking(bookingData);
      if (res) {
        alert('Booking created successfully');
        navigate('/');
      } else {
        alert('Error creating booking');
      }
    } catch (error) {
      console.error('Error', error);
      alert('Error creating booking');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Summary"
            type="text"
            {...register('summary', { required: 'Summary is required' })}
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.summary && <span className="text-red-500">This field is required</span>}
        </div>
        <div>
          <Input
            label="Start Time"
            type="datetime-local"
            {...register('start_time', { required: 'Start time is required' })}
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.start_time && <span className="text-red-500">This field is required</span>}
        </div>
        <div>
          <Input
            label="End Time"
            type="datetime-local"
            {...register('end_time', { required: 'End time is required' })}
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.end_time && <span className="text-red-500">This field is required</span>}
        </div>
        <div>
          <TimezoneSelect onChange={handleTimezoneChange} />
          {errors.timezone && <span className="text-red-500">This field is required</span>}
        </div>
        <div>
          <Input
            label="Cardholder Name"
            type="text"
            {...register('cardholder_name', { required: 'Cardholder name is required' })}
            name="cardholder_name"
            value={formData.cardholder_name}
            onChange={handleChange}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.cardholder_name && <span className="text-red-500">This field is required</span>}
        </div>
        <div>
          <Input
            label="Card Number"
            type="text"
            {...register('card_number', { required: 'Card number is required', minLength: 16, maxLength: 16 })}
            name="card_number"
            value={formData.card_number}
            onChange={handleChange}
            maxLength={16}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.card_number && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="flex space-x-2">
          <Input
            label="Expiration Date MM/YY"
            type="text"
            {...register('expiration_date', { required: 'Expiration Date is required' })}
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            maxLength={5}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.expiration_date && <span className="text-red-500">This field is required</span>}
        </div>
        <div>
          <Input
            label="CVV"
            type="text"
            {...register('cvv', { required: 'CVV is required', minLength: 3, maxLength: 3 })}
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            maxLength={3}
            required
            crossOrigin=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          />
          {errors.cvv && <span className="text-red-500">This field is required</span>}
        </div>
        <Button
          type="submit"
          className="mt-4 bg-green-500 hover:bg-green-600 text-white"
          placeholder=''
          onPointerEnterCapture={() => { }}
          onPointerLeaveCapture={() => { }}
        >
          Pay
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
