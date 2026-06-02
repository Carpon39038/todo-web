'use client';

import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTaskItem(props: {
  task: Task;
  onToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onOpenDetail: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

interface Props {
  tasks: Task[];
  onToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  onReorder: (tasks: Task[]) => void;
  selectedIds: Set<string>;
  onSelect?: (id: string) => void;
  onOpenDetail: (task: Task) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate, onReorder, selectedIds, onSelect, onOpenDetail }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      onReorder(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  if (tasks.length === 0) {
    return <div className="text-center text-gray-400 py-12">No tasks yet</div>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map(task => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              selected={selectedIds.has(task.id)}
              onSelect={onSelect}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
