import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
// import { useAuthStore } from "../utils/online/authStore";

import { useAuthStore } from "@/utils/online/authStore";
import { useContext } from "react";
import { ModalContext } from "@/contexts/modalContext";
import BYOK from "./BYOK";

const Header = () => {
  // const location = useLocation();
  const { openModal } = useContext(ModalContext);

  const navigate = useNavigate();

  return (
    <header className="flex justify-between">
      <h1
        className="logo relative"
        onClick={() => {
          navigate("/");
        }}
      >
        colorwars
        <div className="absolute top-[57%] translate-y-[-50%] flex items-center justify-center  right-[10px] w-[17px] h-[17px] bg-[#95C1D4]">
          <p className="text-[12px] text-[#406E81]">ai</p>
        </div>
      </h1>
      <div
        className="w-[150px] h-[38px] cursor-pointer shadow-sm rounded-sm flex items-center px-[10px] bg-[#4E839A]"
        onClick={() => {
          openModal(<BYOK />, {});
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-key size-[23px]"
          viewBox="0 0 16 16"
        >
          <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
          <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
        </svg>
        <h4 className="text-[14px] ml-[5px]">API key (BYOK)</h4>
      </div>
    </header>
  );
};

export default Header;
