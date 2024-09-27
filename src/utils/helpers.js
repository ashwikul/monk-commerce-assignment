// A helper function to handle drag start
export const handleDragStart = (setDraggedSubIndex, index, e) => {
  setDraggedSubIndex(index);
  e.dataTransfer.effectAllowed = "move";
};

export const handleDragOver = (draggedIndex, index, event) => {
  event.preventDefault();
  // If the item is dragged over itself, ignore
  if (draggedIndex === index) {
    return;
  }
};

export const handleOnDrop = (
  product,
  index,
  draggedIndex,
  addedProducts,
  setAddedProducts,
  setDraggedIndex,
  isVariant = false // Pass a flag to indicate whether you're handling variants or products
) => {
  // Create a new items array
  const newItems = [...addedProducts];

  // Determine if we're working with products or variants
  let draggedItem;

  if (isVariant) {
    const variantsList = newItems.find((p) => p.id === product.id).variants;

    // Remove the dragged variant from its original position
    [draggedItem] = variantsList.splice(draggedIndex, 1);

    // Insert the dragged variant at the new index
    variantsList.splice(index, 0, draggedItem);
  } else {
    // Remove the dragged product from its original position
    [draggedItem] = newItems.splice(draggedIndex, 1);

    // Insert the dragged product at the new index
    newItems.splice(index, 0, draggedItem);
  }

  // Update the state with the new order
  setAddedProducts(newItems);

  // Reset dragged index
  setDraggedIndex(null);
};
