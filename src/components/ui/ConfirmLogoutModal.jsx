const ConfirmLogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to logout from the admin panel?</p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>

          <button className="btn-danger" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
