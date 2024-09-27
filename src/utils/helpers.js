// A helper function to handle drag start
export const handleDragStart = (setDraggedSubIndex, index, e) => {
  setDraggedSubIndex(index);
  e.dataTransfer.effectAllowed = "move";
};

export const handleDragOver = (draggedIndex, index, event) => {
  event.preventDefault();

  // Set the dropEffect to "move" to prevent the "+" symbol (copy icon) from appearing
  // event.dataTransfer.dropEffect = "move";

  // If the item is dragged over itself, ignore
  if (draggedIndex === index) {
    return;
  }
};

// utils/dragDropHelpers.js
export const handleOnDropVariants = (
  product,
  index,
  draggedIndex,
  addedProducts,
  setAddedProducts
) => {
  // Create a new items array
  const newItems = [...addedProducts];
  const variantsList = newItems.find((p) => p.id === product.id).variants;

  // Remove the dragged item from its original position
  const [draggedItem] = variantsList.splice(draggedIndex, 1);

  // Insert the dragged item at the new index
  variantsList.splice(index, 0, draggedItem);

  // Update the state with the new order
  setAddedProducts(newItems);
};

export const handleOnDropProducts = (
  index,
  draggedIndex,
  addedProducts,
  setAddedProducts,
  setDraggedIndex
) => {
  // Create a new items array
  const newItems = [...addedProducts]; // Create a copy of the current array

  // Remove the dragged item from its original position
  const [draggedItem] = newItems.splice(draggedIndex, 1);

  // Insert the dragged item at the new index
  newItems.splice(index, 0, draggedItem);

  // Update the state with the new order
  setAddedProducts(newItems);
  setDraggedIndex(null);
};
