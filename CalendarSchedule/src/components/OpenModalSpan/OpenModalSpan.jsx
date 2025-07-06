import { useModal } from "../Modal/Modal";

function OpenModalSpan({
  modalComponent, // component to render inside the modal
  itemText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  };


  return (
    <span onClick={onClick}>
      {itemText}
    </span>
  );
}

export default OpenModalSpan;
