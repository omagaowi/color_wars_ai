import { useContext } from "react";
// import { useToggle } from "./useModal";
// import { ModalContext } from "../contexts/ModalContext";

import { ModalContext } from "@/contexts/modalContext";
import OnClickOutside from "./OnClickOutside";

const Modal = () => {
  const { open, modalElement, closeModal } = useContext(ModalContext);
  console.log(open);
  return (
    <div
      className={`w-[100vw] h-[100vh] fixed top-0 left-0 ${open ? "pointer-events-all bg-[rgba(0,0,0,.4)]" : "pointer-events-none bg-transparent]"}  z-99999`}
    >
      <OnClickOutside currentState={open} setState={closeModal}>
        <div
          className={`w-fit h-fit bg-boxdark transition-all duration-300 fixed top-[50%] left-[50%]  ${open ? "pointer-events-all opacity-100" : "opacity-0 pointer-events-none scale-[0.6]"} translate-x-[-50%] translate-y-[-50%]`}
        >
          {modalElement}
        </div>
      </OnClickOutside>
    </div>
  );
};

export default Modal;
