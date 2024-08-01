import { useEffect, useState, useRef } from "react";
import authService from "../../service/auth.service";
import { useParams } from 'react-router-dom';
import { generalData } from "../../common/generalData";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Typography,
} from "@material-tailwind/react";
import BookingForm from "../../components/BookingForm";
import './DetailsTutor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Certifications from "../../models/Certifications";
import TutorService from "../../service/tutor/TutorService";


const DetailsTutor = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>([]);
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfPreviewRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  async function getTutor() {
    const res = await authService.getTutors();
    const tutorDetails = res.filter((t: { id: number; }) => t.id === parseInt(id ?? ""));
    setTutor(tutorDetails[0]);
  }
  useEffect(() => {
    getTutor()
  }, [id]);

  const renderAvailability = (availability: string) => {
    if (!availability) return null;

    return Object.entries(availability).map(([day, hours]) => (
      <div key={day}>
        <strong>{day}:</strong> {hours} &nbsp;
      </div>
    ));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Certifications
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        console.log(tutor.id);
        const data = await TutorService.getCertifications(tutor.id);
        const updatedData = data.map((cert: Certifications) => ({
          ...cert,
          route_file: `http://localhost:8000/api${cert.route_file}`
        }));
        setCertifications(updatedData);
      } catch (error) {
        console.error('Fetch certifications error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  const renderPreview = (fileUrl: string) => {
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

    if (fileExtension === 'pdf') {
      const displayPdfPreview = async (url: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        if (pdfPreviewRef.current) {
          pdfPreviewRef.current.src = blobUrl;
          pdfPreviewRef.current.style.display = 'flex';
        }
      };
      displayPdfPreview(fileUrl);
      return (
        <div className='pdf-container'>
          <iframe ref={pdfPreviewRef} id="pdf-preview" style={{ height: '650px', width: '100%', display: 'flex', justifyContent: 'center' }}></iframe>
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      return <img src={fileUrl} alt="Certification" style={{ maxWidth: '600px' }} />;
    } else {
      return <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a>;
    }
  };

  const renderPreviewMobil = (fileUrl: string) => {
    return <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a>;
  };

  const handleNextCert = () => {
    setCurrentCertIndex((prevIndex) => (prevIndex + 1) % certifications.length);
  };

  const handlePrevCert = () => {
    setCurrentCertIndex((prevIndex) => (prevIndex - 1 + certifications.length) % certifications.length);
  };

  return (
    <div className="tutor-details">
      <h1 className="title block antialiased tracking-wide font-sans text-5xl font-semibold leading-tight text-inherit title">Tutor Details</h1>
      <div className="details">
        <div className="info">
          <div className="round-image-container resize">
            {tutor?.photo ? (
              <img src={`http://localhost:8000/${tutor?.photo}`} className="round-image h-6 sm:h-7 rounded-full" alt="Profile Photo" />
            ) : (
              <div className='bg-[#ECECEC] rounded-full w-7 h-7'><FontAwesomeIcon icon={faUser} className="edit-icon" size="1x" color='#b5b5b5' /></div>
            )}
          </div>
          <Popover placement="bottom">
            <PopoverHandler>
              <Button
                className="bg-[#70000e]"
                placeholder='Booking'
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}>Book the session</Button>
            </PopoverHandler>
            <PopoverContent className="modal-meet overflow-auto px-16 py-12
             md:ml-4  border-[#4b0007]" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
              <Typography variant="h4" color="blue-gray" className="mb-4 text-[#ce9912] text-2xl font-bold" placeholder=''
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}>
                New Meeting
              </Typography>
              <BookingForm tutor={tutor} />
            </PopoverContent>
          </Popover>
          <br />
          <div className="tutor-data">
            <div className="cont-text ">
              <h2 className="mr-4"><b>Name:</b> {tutor?.first_name} {tutor?.last_name}</h2>
              <h2 className="mr-4"><b>Gender:</b> {generalData.gender.find(obj => obj.value === tutor.gender)?.label}</h2>
              <h2><b>Email:</b> {tutor?.email}</h2>
            </div>
            <div className="cont-text">
              <h2 className="mr-4"><b>Hoarly Rate:</b> {tutor.hourly_rate}</h2>
              <h2><b>Area:</b> {generalData.study_area.find(obj => obj.value === tutor.study_area)?.label}</h2>
            </div>
            <div className="cont-text">
              <h2><b>Experience:</b></h2>
              <h2><span className="text-data">{tutor.experience}</span></h2>
            </div>
            <div className="cont-text">
              <h2><b>Specialties:</b></h2>
              <h2><span className="text-data">{tutor.specialties}</span></h2>
            </div>
            <div className="cont-text">
              <h2><b>Availability:</b></h2>
              <h2><span className="text-data">{renderAvailability(tutor.availability)}</span></h2>
            </div>
          </div>
        </div>
        <div className="cert h-fit">
          <h4 className="block antialiased tracking-normal mt-1 font-sans text-2xl font-semibold leading-snug text-white title-section">Certifications</h4>
          <hr className="my-1 w-[90%] border-[#ce9912] sm:mx-auto dark:border-[#ce9912] lg:my-2" />
          <div className='certificate'>
            {certifications.length === 0 ? (
              <p>No certifications found</p>
            ) : (isMobile ? (
              <ul>
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <h2><b>{cert.name}</b> ~ <span className="border-b-2 border-solid">{renderPreviewMobil(cert.route_file)}</span></h2>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <div className="pagination-buttons flex row gap-4 justify-center my-2">
                  <button onClick={handlePrevCert} disabled={certifications.length <= 1}><FontAwesomeIcon icon={faAngleLeft} className="edit-icon" size="2x" color='#b5b5b5' /></button>
                  <h2>{certifications[currentCertIndex].name.toUpperCase()}</h2>
                  <button onClick={handleNextCert} disabled={certifications.length <= 1}><FontAwesomeIcon icon={faAngleRight} className="edit-icon" size="2x" color='#b5b5b5' /></button>
                </div>
                <div>
                  {renderPreview(certifications[currentCertIndex].route_file)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsTutor;