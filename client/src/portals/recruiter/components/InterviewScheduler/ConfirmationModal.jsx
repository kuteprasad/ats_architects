import React from 'react';
import Button from '../../../../components/common/Button';


export const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Confirm Schedule</h3>
        <p>Are you sure you want to confirm this interview schedule?</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};