import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactModal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import Certifications from '../../models/Certifications';
import TutorService from '../../service/tutor/TutorService';
import useGlobalState from '../../context/GlobalState';

import './ViewCertifications.css';
import { Button, Typography } from '@material-tailwind/react';
import certService from '../../service/cert.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFile, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import useIsMobile from '../../hooks/useIsMobile';

const ViewCertifications = () => {
  const { user, tokenExists } = useGlobalState();
  const { id } = useParams<{ id: string }>();
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<number | null>(null);
  const pdfPreviewRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [nameFile, setNameFile] = useState<string | null>(null);
  const [alsuccess, setAlsuccess] = useState<string | null>(null);
  const [alerror, setAlerror] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (isMobile) {
        return (
          <div className='d-pdf'>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download File <FontAwesomeIcon icon={faDownload} /></a>
          </div>
        );
      } else {
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
      }
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
      return <div className='center-container'><img src={fileUrl} alt="Certification" style={{ maxWidth: '100%' }} /></div>;
    } else {
      return <div className='center-container'><a href={fileUrl} target="_blank" rel="noopener noreferrer">Download File <FontAwesomeIcon icon={faDownload} /></a></div>;
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setNameFile(acceptedFiles[0].name);
    setModalIsOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setNameFile(file.name);
    }
  };

  const uploadCertification = async () => {
    const formData = new FormData();
    if (user) {
      formData.append('tutor_id', user.id.toString());
    } else {
      setAlerror('User not logged in');
      setTimeout(() => {
        setAlerror(null);
      }, 5000);
      return;
    }
    if (file) {
      formData.append('name', file.name);
      formData.append('route_file', file);
      try {
        const res = await TutorService.uploadCertifications(formData);
        if (res) {
          res.route_file = `http://localhost:8000/api/${res.route_file}`;
          setCertifications([...certifications, res]);
          navigate(0);
        } else {
          setAlerror('Error uploading certificate');
          setTimeout(() => {
            setAlerror(null);
          }, 5000);
        }
      } catch (error) {
        setAlerror(`Upload certificate error: ${error}`);
        setTimeout(() => {
          setAlerror(null);
        }, 5000);
      }
    } else {
      setAlerror('File is required');
      setTimeout(() => {
        setAlerror(null);
      }, 5000);
    }
  };

  const openConfirmModal = (id: number) => {
    setCertToDelete(id);
    setConfirmModalIsOpen(true);
  };

  const confirmDeleteCertification = async () => {
    if (certToDelete !== null) {
      try {
        await certService.deleteCertification(certToDelete);
        setCertifications(certifications.filter(cert => cert.id !== certToDelete));
        setAlsuccess('Certification deleted successfully');
        setTimeout(() => {
          setAlsuccess(null);
        }, 5000);
        setConfirmModalIsOpen(false);
      } catch (error) {
        setAlerror('Error deleting certification');
        setTimeout(() => {
          setAlerror(null);
        }, 5000);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      <div className="alerts-container">
        {alsuccess && <span className="alert-success">{alsuccess}</span>}
        {alerror && <span className="alert-error">{alerror}</span>}
      </div>
      <Typography variant="h1" className='title' placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Certification</Typography>
      <div className='certification-container'>
        <div className='certification-list'>
          <div className='container-save'>
            <Button
              color="blue"
              onClick={isMobile ? openFilePicker : () => setModalIsOpen(true)}
              placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}
              className='btn-cert'
            >
              {nameFile || 'Upload Certification'}
            </Button>
            <Button color="green" onClick={uploadCertification} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}><FontAwesomeIcon icon={faSave} /></Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          {certifications.length === 0 ? (
            <p>No certifications found</p>
          ) : (
            <ul>
              {certifications.map((cert) => (
                <li key={cert.id} onClick={() => setSelectedFile(cert.route_file)}>
                  <h2>{cert.name}</h2>
                  <Button color="red" onClick={() => cert.id && openConfirmModal(cert.id)} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}><FontAwesomeIcon icon={faTrash} /></Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='certification-preview'>
          {selectedFile ? renderPreview(selectedFile) : (
            <div className='select-cert'>
              <Typography variant='h4' placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Select a certification to preview</Typography>
              <FontAwesomeIcon size='4x' icon={faFile} />
            </div>
          )}
        </div>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Upload Certification"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '500px',
            padding: '20px',
            borderRadius: '20px'
          },
        }}
      >
        <div
          {...getRootProps({ className: 'dropzone' })}
          style={{
            border: '2px dashed #cccccc',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <p className='text-modal'>Drag & drop a file here, or click to select one <FontAwesomeIcon size='3x' icon={faFile} /></p>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={confirmModalIsOpen}
        onRequestClose={() => setConfirmModalIsOpen(false)}
        contentLabel="Confirm Delete"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: '150px',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          },
        }}
      >
        <h2>Are you sure you want to delete this certification?</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <Button color="red" onClick={confirmDeleteCertification} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Yes</Button>
          <Button color="blue" onClick={() => setConfirmModalIsOpen(false)} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>No</Button>
        </div>
      </ReactModal>
    </div>
  );
};

export default ViewCertifications;
