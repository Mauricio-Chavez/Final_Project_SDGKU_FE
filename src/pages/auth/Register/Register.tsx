import './Register.css';
import authService from '../../../service/auth.service';
import { useForm } from 'react-hook-form';
import UserM from '../../../models/UserM';
import { useNavigate } from 'react-router-dom';
import { Input, Radio, Select, Option,Button } from '@material-tailwind/react';
import { useState, useRef } from 'react';
import { generalData } from '../../../common/generalData';

const Register = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserM>();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLInputElement | null>(null);
  const [alerror,setAlerror] = useState<string | null>(null)

  const handlePhoto = (e: any) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);
  };

  const handleRegister = async (data: UserM) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password?.toString() || "");
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('role', data.role.toString());
    formData.append('study_area', data.study_area?.toString() || "");
    formData.append('is_visible', false.toString());
    formData.append('gender',data.gender.toString());

    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const res = await authService.register(formData);
      if (res.token) {
        navigate('/login');
      } else {
        setAlerror('Error creating user')
        setTimeout(() => {
          setAlerror(null);
      }, 5000);
      }
    } catch (error) {
      setAlerror('Error creating user' + error)
      setTimeout(() => {
        setAlerror(null);
    }, 5000);
    }
  };

  const selectedRole = watch('role');

  return (
    <div className='user-register'>
      <div className="alerts-container">
        {errors.email && <span className="alert">{errors.email.message}</span>}
        {errors.password && <span className="alert">{errors.password.message}</span>}
        {errors.first_name && <span className="alert">{errors.first_name.message}</span>}
        {errors.last_name && <span className="alert">{errors.last_name.message}</span>}
        {errors.role && <span className="alert">{errors.role.message}</span>}
        {errors.study_area && <span className="alert">{errors.study_area.message}</span>}
        {errors.gender && <span className="alert"></span>}
        {alerror ? <span className="alert">{alerror}</span> : null}
      </div>
      <div className='img-container'>
        <img src={`${process.env.PUBLIC_URL}/media/logo.png`} alt="" />
      </div>
      <div className='form-container'>
        <h1 className="title">Register</h1>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div
            className='photo-container'
            onClick={() => photoInputRef.current?.click()}
          >
            <img src={photo ? URL.createObjectURL(photo) : 'https://via.placeholder.com/300'} alt="user-photo" className='profile-img' />
          </div>

          <div className='inputs-container'>
            <Input
              label='Email'
              type='email'
              placeholder='Email'
              required
              {...register('email', { required: 'Email is required' })}
              crossOrigin=''
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            />


            <Input
              label='Password'
              type='password'
              placeholder='Password'
              required
              {...register('password', { required: 'Password is required' })}
              crossOrigin=''
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            />
      

            <Input
              label='First Name'
              type='text'
              placeholder='First name'
              required
              {...register('first_name', { required: 'First name is required' })}
              crossOrigin=''
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            />
    

            <Input
              label='Last Name'
              type='text'
              placeholder='Last name'
              required
              {...register('last_name', { required: 'Last name is required' })}
              crossOrigin=''
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            />


            <Select
              label='Gender'
              placeholder='Gender'
              {...register('gender', { required: 'Gender is required' })}
              onChange={(value) => setValue('gender', parseInt(value || ''))}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            >
              {generalData.gender.map((option) => (
                <Option key={option.value} value={option.value.toString()}>
                  {option.label}
                </Option>
              ))}
            </Select>


            <Select
              label='Select Study Area'
              placeholder='Select Study Area'
              {...register('study_area', { required: 'The Study Area is required' })}
              onChange={(value) => setValue('study_area', parseInt(value || ''))}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            >
              {generalData.study_area.map((option) => (
                <Option key={option.value} value={option.value.toString()}>
                  {option.label}
                </Option>
              ))}
            </Select>

            
            <div className='radio-container'>
              <Radio
                id='tutee'
                label='Tutee'
                {...register('role', { required: 'Role is required' })}
                value='0'
                checked={selectedRole === 0}
                onChange={() => setValue('role', 0)}
                required
                crossOrigin=''
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
                color='amber'
              />
              <Radio
                id='tutor'
                label='Tutor'
                {...register('role', { required: 'Role is required' })}
                value='1'
                checked={selectedRole === 1}
                onChange={() => setValue('role', 1)}
                required
                crossOrigin=''
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
                color='amber'
              />
            </div>

            <input
              type="file"
              name='photo'
              accept='image/*'
              onChange={handlePhoto}
              ref={photoInputRef}
              className='input-photo'
            />
            <input 
              type="submit" 
              ref={submitButtonRef} 
              style={{ display: 'none' }} 
            />
          </div>
        </form>
        <div className='btn'>
          <Button
            type='button'
            onClick={() => submitButtonRef.current?.click()}
            placeholder=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
            className='btn-register'
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
