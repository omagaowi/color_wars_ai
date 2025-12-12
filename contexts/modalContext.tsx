import { createContext, useState, ReactNode, ReactElement } from "react";

type ModalContextType = {
  modalProps: Record<string, unknown> | null;
  modalElement: ReactElement | null;
  open: boolean;
  openModal: (element: ReactElement, props?: Record<string, unknown>) => void;
  closeModal: () => void;
  setProps: (props: Record<string, unknown>) => void;
  setElement: (element: ReactElement) => void;
};

export const ModalContext = createContext<ModalContextType>();

type ModalProviderProps = {
  children: ReactNode;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalProps, setModalProps] = useState<Record<string, unknown> | null>(
    null,
  );
  const [modalElement, setModalElement] = useState<ReactElement | null>(null);
  const [open, setOpen] = useState(false);

  const openModal = (
    element: ReactElement,
    props: Record<string, unknown> = {},
  ) => {
    setModalProps(props);
    setModalElement(element);

    setTimeout(() => {
      setOpen(true);
    }, 200);
  };

  const closeModal = () => {
    setOpen(false);

    setTimeout(() => {
      setModalProps(null);
      setModalElement(null);
    }, 100);
  };

  const setProps = (props: Record<string, unknown>) => {
    setModalProps(props);
  };

  const setElement = (element: ReactElement) => {
    setModalElement(element);
  };

  return (
    <ModalContext.Provider
      value={{
        modalProps,
        modalElement,
        open,
        openModal,
        closeModal,
        setProps,
        setElement,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider };
