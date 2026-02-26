const DeleteConfirmModal = ({ productName, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <div className="delete-icon">🗑️</div>
          <h2>Delete Product?</h2>
          <p>
            Are you sure you want to delete{" "}
            <span className="delete-product-name">"{productName}"</span>?
            <br />
            This action cannot be undone.
          </p>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="btn-delete-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-delete-confirm"
              onClick={onConfirm}
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
