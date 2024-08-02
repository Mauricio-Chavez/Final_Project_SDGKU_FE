import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faSchool, faMobileScreenButton, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { generalData } from '../common/generalData';
import { useNavigate } from 'react-router-dom';
import './TutorCard.css';


const TutorCard = ({ tutor }: any) => {
    const navigate = useNavigate();
    const handleClick = () => {
        console.log(tutor.id)
        navigate(`/details-tutor/${tutor.id}`);
    };

    return (
        <Card className="w-full max-w-[18rem] max-h-96 shadow-lg" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
            <CardHeader floated={false} color="blue-gray" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                {
                    tutor.photo ? (
                        <img
                            className="h-44 w-full object-cover"
                            src={'http://localhost:8000/' + tutor.photo}
                            alt="tutor"

                        />
                    ) : (
                        <img
                            className="h-48 w-full object-cover"
                            src='https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
                            alt="tutor"
                        />
                    )
                }
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />

            </CardHeader>
            <CardBody placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                <Typography variant="h5" color="blue-gray" className="font-medium" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    {tutor.first_name} {tutor.last_name}
                </Typography>
                <Typography color="gray" className="mt-1" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <FontAwesomeIcon icon={faSchool} className="text-[#b27f00]" /> Area: {generalData.study_area.find(obj => obj.value === tutor.study_area)?.label}
                </Typography>
                <Typography color="gray" className="mt-1 truncate" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <FontAwesomeIcon icon={faUser} className="text-[#b27f00]" /> Specialties: {tutor.specialties}
                </Typography>
                <Typography color="gray" className="mt-1" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <FontAwesomeIcon icon={faMoneyBill} className="text-[#b27f00]" /> Price per hour: {tutor.hourly_rate}
                </Typography>
            </CardBody>
            <CardFooter className="pt-1" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                <Button onClick={handleClick} className="bg-[#70000e] p-3" size="lg" fullWidth={true} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    Details
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TutorCard;
