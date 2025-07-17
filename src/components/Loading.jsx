import React from "react";

export default function Loading() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-danger mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="fs-3 text-danger fw-bold">กำลังโหลด... 🍓 cukecute</div>
    </div>
  );
}
