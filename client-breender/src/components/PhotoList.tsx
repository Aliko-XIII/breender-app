import React, { useEffect, useState } from 'react';
import { fetchAnimalPhotos, fetchUserPhotos } from '../api/photoApi';

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

  if (loading) return <div>Loading photos...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!photos.length) return <div>No photos found.</div>;

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row g-3 justify-content-center">
        {photos.map(photo => (
          <div className="col-6 col-md-4 col-lg-3" key={photo.id}>
            <div className="card h-100 photo-card" style={{ cursor: 'pointer' }} onClick={() => handlePhotoClick(photo)}>
              <img
                src={API_BASE_URL + photo.photoUrl}
                alt={photo.title || 'Animal photo'}
                className="card-img-top"
                style={{ objectFit: 'cover', height: 200 }}
              />
              <div className="card-body p-2">
                {photo.title && <div className="card-title small text-center">{photo.title}</div>}
                {photo.uploadedAt && <div className="text-muted small text-center">Uploaded: {new Date(photo.uploadedAt).toLocaleString()}</div>}
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
        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedPhoto.title || 'Photo'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={API_BASE_URL + selectedPhoto.photoUrl}
                  alt={selectedPhoto.title || 'Animal photo'}
                  style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8 }}
                />
                {selectedPhoto.uploadedAt && (
                  <div className="text-muted small mt-2">Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}</div>
                )}
                {selectedPhoto.animalId && !animalId && (
                  <div className="mt-2">
                    <a href={`/animals/${selectedPhoto.animalId}/photos`} className="btn btn-outline-primary btn-sm">View Animal Photos</a>
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
