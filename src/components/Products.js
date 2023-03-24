import React from "react";
import Product from "./Product";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";
import useStore from "../store";

const Products = () => {
  const isReorderEnabled = useStore((state) => state.isReorderEnabled);
  const selectedProductIds = useStore((state) => state.selectedProductIds);
  const setSelectedProductIds = useStore(
    (state) => state.setSelectedProductIds
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = selectedProductIds.indexOf(active.id);
      const newIndex = selectedProductIds.indexOf(over.id);
      const updated = arrayMove(selectedProductIds, oldIndex, newIndex);
      setSelectedProductIds(updated);
    }
  };

  const { width } = useWindowSize();
  const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 320;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={selectedProductIds}
        strategy={rectSortingStrategy}
      >
        <div className="w-full mx-auto p-4">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr))`,
            }}
          >
            {selectedProductIds.map((selectedProductId) => {
              return (
                <SortableItem
                  key={selectedProductId}
                  id={selectedProductId}
                  disabled={!isReorderEnabled}
                >
                  <Product productId={selectedProductId} />
                </SortableItem>
              );
            })}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableItem = ({ id, disabled, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: disabled ? "auto" : "none",
  };

  if (disabled) {
    return <Link to={`/${id}`}>{children}</Link>;
  } else {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }
};

export default React.memo(Products);
