import React from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full text-center">
        <h2 className="text-xl font-bold mb-4">Important Notice</h2>
        <p className="mb-4">
          Post the article carefully. If your article is offensive, racist, or
          adult, it will be disabled by the admin and won't get reactivated
          again, and you will be banned from this website.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
