import { useState } from "react";

export default function useShowModal(defaultState) {
  const [isModalVisible, setIsModalVisible] = useState(defaultState);

  function hideModal() {
    setIsModalVisible(false);
  }
  function showModal() {
    setIsModalVisible(true);
  }
  return [isModalVisible, hideModal, showModal];
}
