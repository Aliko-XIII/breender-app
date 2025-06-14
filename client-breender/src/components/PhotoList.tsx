import React, { useEffect, useState } from 'react';
import { fetchAnimalPhotos, fetchUserPhotos } from '../api/photoApi';
import axiosInstance from '../api/axiosInstance';
import { getAnimal } from '../api/animalApi';

interface Photo {
  id: string;
  photoUrl: string;
  title?: string;
  uploadedAt?: string;
  animalId?: string;
}

interface PhotoListProps {
  animalId?: string;
  userId?: string;
}

const API_BASE_URL = "http://localhost:3000";

const PhotoList: React.FC<PhotoListProps> = ({ animalId, userId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [animalInfos, setAnimalInfos] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError('');
      let result;
      if (userId) {
        result = await fetchUserPhotos(userId);
      } else if (animalId) {
        result = await fetchAnimalPhotos(animalId);
      } else {
        setError('No animal or user specified.');
        setLoading(false);
        return;
      }
      if (result.status === 200) {
        setPhotos(result.data);
        // Fetch animal info for all unique animalIds
        const ids = Array.from(new Set(result.data.map((p: Photo) => p.animalId).filter(Boolean)));
        if (ids.length) {
          const entries = await Promise.all(
            ids.map(async (id) => {
              const res = await getAnimal(id);
              if (res.status === 200) {
                return [id, res.data];
              }
              return [id, null];
            })
          );
          setAnimalInfos(Object.fromEntries(entries));
        } else {
          setAnimalInfos({});
        }
      } else {
        setError('Failed to load photos.');
      }
      setLoading(false);
    };
    if (userId || animalId) loadPhotos();
  }, [animalId, userId]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await axiosInstance.delete(`/photos/${photoId}`);
      setPhotos(photos => photos.filter(p => p.id !== photoId));
    } catch (err) {
      alert('Failed to delete photo.');
    }
  };

  if (loading) return <div>Loading photos...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!photos.length) return (
    <div className="container-fluid px-4 mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '30vh' }}>
      <div className="alert alert-info text-center w-100" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="fs-4 mb-2">No photos uploaded yet</div>
        <div className="small">You haven't uploaded any photos for this animal or user.</div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row g-3 justify-content-center">
        {photos.map(photo => (
          <div className="col-6 col-md-4 col-lg-3" key={photo.id}>
            <div className="card h-100 photo-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => handlePhotoClick(photo)}>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-circle position-absolute end-0 m-2 d-flex align-items-center justify-content-center"
                style={{ zIndex: 2, width: 32, height: 32 }}
                onClick={e => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                title="Delete photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-11-1a.5.5 0 0 0-.5.5V4h11V2.5a.5.5 0 0 0-.5-.5h-10zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
                </svg>
              </button>
              <img
                src={API_BASE_URL + photo.photoUrl}
                alt={photo.title || 'Animal photo'}
                className="card-img-top"
                style={{ objectFit: 'cover', height: 200 }}
              />
              <div className="card-body p-2">
                {photo.title && <div className="card-title small text-center">{photo.title}</div>}
                {photo.uploadedAt && <div className="text-muted small text-center">Uploaded: {new Date(photo.uploadedAt).toLocaleString()}</div>}
                {/* Minimal animal profile info, very small, one row, replaces button link */}
                {photo.animalId && animalInfos[photo.animalId] && (
                  <div className="d-flex justify-content-center align-items-center gap-1 small text-muted" style={{ fontSize: '0.8em', minHeight: 22 }}>
                    <span><strong>{animalInfos[photo.animalId].name}</strong></span>
                    <span>|</span>
                    <span>{animalInfos[photo.animalId].species}</span>
                    {animalInfos[photo.animalId].breed && <><span>|</span><span>{animalInfos[photo.animalId].breed}</span></>}
                    <span>|</span>
                    <span>{animalInfos[photo.animalId].sex}</span>
                    <a href={`/animals/${photo.animalId}`} className="ms-1 text-decoration-none" style={{ fontSize: '0.8em' }} title="View animal profile">🔗</a>
                  </div>
                )}
                {photo.animalId && !animalId && (
                  <div className="text-center mt-1">
                    <a href={`/animals/${photo.animalId}/photos`} className="btn btn-link btn-sm">View Animal Photos</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for viewing photo */}
      {selectedPhoto && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content bg-dark text-light border-0" style={{ boxShadow: '0 0 24px 4px #000' }}>
              <div className="modal-header border-0" style={{ background: '#222' }}>
                <h5 className="modal-title text-light">{selectedPhoto.title || 'Photo'}</h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body text-center" style={{ background: '#181818' }}>
                <img
                  src={API_BASE_URL + selectedPhoto.photoUrl}
                  alt={selectedPhoto.title || 'Animal photo'}
                  style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8, boxShadow: '0 2px 16px #000' }}
                />
                {selectedPhoto.uploadedAt && (
                  <div className="text-muted small mt-2" style={{ color: '#bbb' }}>Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}</div>
                )}
                {selectedPhoto.animalId && !animalId && (
                  <div className="mt-2">
                    <a href={`/animals/${selectedPhoto.animalId}/photos`} className="btn btn-outline-light btn-sm">View Animal Photos</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoList;
