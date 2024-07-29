import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Certifications from '../../models/Certifications';
import TutorService from '../../service/tutor/TutorService';
import useGlobalState from '../../context/GlobalState';

import './ViewCertifications.css';
import { Typography } from '@material-tailwind/react';

const ViewCertifications = () => {
  const { user, tokenExists } = useGlobalState();
  const { id } = useParams<{ id: string }>();
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const pdfPreviewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (!user) {
        await tokenExists();
      }
      if (user && user.id) {
        try {
          const data = await TutorService.getCertifications();
          const updatedData = data.map((cert: Certifications) => ({
            ...cert,
            route_file: `http://localhost:8000/api${cert.route_file}`
          }));
          setCertifications(updatedData);
        } catch (error) {
          console.error('Fetch certifications error', error);
          setError('Error fetching certifications');
        } finally {
          setLoading(false);
        }
      } else {
        console.error('User is not logged in or missing user ID', error);
        setLoading(false);
      }
    };
    fetchCertifications();
  }, [tokenExists, user, id]);

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
          <iframe ref={pdfPreviewRef} id="pdf-preview"></iframe>
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      return <img src={fileUrl} alt="Certification" style={{ maxWidth: '100%' }} />;
    } else {
      return <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a>;
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className='view-certifications'>
      <Typography variant="h1" className='title' placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} > Personal Information</Typography>
      <div className='certification-container'>
        <div className='certification-list'>
          {certifications.length === 0 ? (
            <p>No certifications found</p>
          ) : (
            <ul>
              {certifications.map((cert) => (
                <li key={cert.id} onClick={() => setSelectedFile(cert.route_file)}>
                  <h2>{cert.name}</h2>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='certification-preview'>
          {selectedFile ? renderPreview(selectedFile) : <p>Select a certification to preview</p>}
        </div>
      </div>
    </div>
  );
}

export default ViewCertifications;
