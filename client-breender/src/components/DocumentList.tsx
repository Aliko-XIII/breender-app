import React, { useEffect, useState } from 'react';
import { fetchAnimalDocuments, fetchUserDocuments, deleteDocument } from '../api/documentApi';
import { getAnimal } from '../api/animalApi';

interface Document {
  id: string;
  documentUrl: string;
  documentName?: string;
  uploadedAt?: string;
  animalId?: string;
}

interface DocumentListProps {
  animalId?: string;
  userId?: string;
}

const API_BASE_URL = "http://localhost:3000";

const DocumentList: React.FC<DocumentListProps> = ({ animalId, userId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [animalInfos, setAnimalInfos] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      setError('');
      let result;
      if (userId) {
        result = await fetchUserDocuments(userId);
      } else if (animalId) {
        result = await fetchAnimalDocuments(animalId);
      } else {
        setError('No animal or user specified.');
        setLoading(false);
        return;
      }
      if (result.status === 200) {
        setDocuments(result.data);
        // Fetch animal info for all unique animalIds
        const ids = Array.from(new Set(result.data.map((d: Document) => d.animalId).filter(Boolean)));
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
        setError('Failed to load documents.');
      }
      setLoading(false);
    };
    if (userId || animalId) loadDocuments();
  }, [animalId, userId]);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocument(documentId);
      setDocuments(docs => docs.filter(d => d.id !== documentId));
    } catch (err) {
      alert('Failed to delete document.');
    }
  };

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!documents.length) return (
    <div className="container-fluid px-4 mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '30vh' }}>
      <div className="alert alert-info text-center w-100" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="fs-4 mb-2">No documents uploaded yet</div>
        <div className="small">You haven't uploaded any documents for this animal or user.</div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row g-3 justify-content-center">
        {documents.map(document => (
          <div className="col-12 col-md-6 col-lg-4" key={document.id}>
            <div className="card h-100 document-card" style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-circle position-absolute end-0 m-2 d-flex align-items-center justify-content-center"
                style={{ zIndex: 2, width: 32, height: 32 }}
                onClick={e => { e.stopPropagation(); handleDeleteDocument(document.id); }}
                title="Delete document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-11-1a.5.5 0 0 0-.5.5V4h11V2.5a.5.5 0 0 0-.5-.5h-10zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
                </svg>
              </button>
              <div className="card-body p-3" style={{ cursor: 'pointer' }} onClick={() => handleDocumentClick(document)}>
                <div className="card-title fw-bold text-center mb-2">
                  {document.documentName ? document.documentName : 'Document'}
                </div>
                {document.uploadedAt && <div className="text-muted small text-center">Uploaded: {new Date(document.uploadedAt).toLocaleString()}</div>}
                {document.animalId && animalInfos[document.animalId] && (
                  <div className="d-flex justify-content-center align-items-center gap-1 small text-muted" style={{ fontSize: '0.8em', minHeight: 22 }}>
                    <span><strong>{animalInfos[document.animalId].name}</strong></span>
                    <span>|</span>
                    <span>{animalInfos[document.animalId].species}</span>
                    {animalInfos[document.animalId].breed && <><span>|</span><span>{animalInfos[document.animalId].breed}</span></>}
                    <span>|</span>
                    <span>{animalInfos[document.animalId].sex}</span>
                    <a href={`/animals/${document.animalId}`} className="ms-1 text-decoration-none" style={{ fontSize: '0.8em' }} title="View animal profile">🔗</a>
                  </div>
                )}
                {document.animalId && !animalId && (
                  <div className="text-center mt-1">
                    <a href={`/animals/${document.animalId}/documents`} className="btn btn-link btn-sm">View Animal Documents</a>
                  </div>
                )}
                <div className="text-center mt-2">
                  <a
                    href={API_BASE_URL + document.documentUrl}
                    className="btn btn-outline-primary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for viewing document details */}
      {selectedDocument && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedDocument.documentName || 'Document'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <a
                    href={API_BASE_URL + selectedDocument.documentUrl}
                    className="btn btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Document
                  </a>
                </div>
                {selectedDocument.uploadedAt && (
                  <div className="text-muted small mt-2">Uploaded: {new Date(selectedDocument.uploadedAt).toLocaleString()}</div>
                )}
                {selectedDocument.animalId && !animalId && (
                  <div className="mt-2">
                    <a href={`/animals/${selectedDocument.animalId}/documents`} className="btn btn-outline-primary btn-sm">View Animal Documents</a>
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

export default DocumentList;
