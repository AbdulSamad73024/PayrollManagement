import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import './DeleteConfirmation.css';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName: string;
  isDeleting?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemName,
  isDeleting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="delete-modal-content">
        <div className="delete-icon-box">
          <AlertTriangle size={28} />
        </div>
        <p className="delete-message">
          Are you sure you want to delete <span className="delete-item-name">{itemName}</span>?
          This action cannot be undone and will permanently remove this record from the database.
        </p>
        <div className="delete-actions">
          <button className="delete-cancel-btn" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Record'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
