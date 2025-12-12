import useAuth from "@/utils/online/useAuth";
import { Noto_Serif_Dives_Akuru } from "next/font/google";
import { newAlert } from "./Alerts";
import { useContext } from "react";
import { ModalContext } from "@/contexts/modalContext";

const BYOK = () => {
  const { apiKey, setAPIKey } = useAuth();

  const { closeModal } = useContext(ModalContext);

  return (
    <div className="w-[370px] h-[230px] shadow-md flex flex-col justify-center items-center rounded-md bg-[#4E839A]">
      <h1 className=" text-[26px] font-semibold">API Key</h1>
      {apiKey ? (
        <>
          <h1 className="text-[#fff] text-[25px] font-bold">
            API key Detected
          </h1>
          <p>Overwrite the present API key?</p>
          <button
            className="w-[100px] mx-[10px] cursor-pointer bg-[#73BBD9]  text-[#000] mt-[10px] text-[13px]  h-[35px] "
            onClick={() => {
              localStorage.removeItem("api_key");
              setAPIKey("");
              newAlert({
                color: "green",
                type: "success",
                message: "AI Gateway API key deleted",
              });
            }}
          >
            Overwrite
          </button>
        </>
      ) : (
        <form
          className="w-full h-fit flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            const key = e.target.key.value;
            if (key) {
              closeModal();
              setAPIKey(key);

              localStorage.setItem("api_key", key);
              newAlert({
                type: "success",
                color: "green",
                message: "AI Gateway API saved",
              });
            }
          }}
        >
          <div className="w-[90%] h-[40px] flex mt-[10px] bg-[#73BBD9]">
            <input
              type="password"
              name="key"
              placeholder="Enter a valid AI Gateway API key.."
              className="flex-1 h-full px-[5px] bg-transparent text-[#4E839A] placeholder:text-[#4E839A] outline-none border-none"
            />
          </div>
          <p className="text-[13px] text-[#73BBD9]">
            PS: API keys are stored locally on your device
          </p>
          <button className=" bg-[#73BBD9] w-[80px] mt-[15px] text-[#406E81] h-[36px]">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BYOK;
