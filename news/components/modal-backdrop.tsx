"use client";

import { useRouter } from "next/navigation";

const ModalBackdrop = () => {
  /**
   * "useRouter" hook gives us access to a router object
   * which holds various methods for navigating around programmatically.
   */
  const router = useRouter();

  return <div className="modal-backdrop" onClick={router.back} />;
};

export default ModalBackdrop;
