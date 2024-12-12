import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [inReview, setInReview] = useState([]);

  const customData = [
    { userId: 1, id: "1", title: "Design the homepage layout", completed: false },
    { userId: 2, id: "2", title: "Set up database schema", completed: false },
    { userId: 3, id: "3", title: "Develop API endpoints", completed: false },
    { userId: 1, id: "4", title: "Implement Kanban board UI", completed: false },
    { userId: 2, id: "5", title: "Test API integrations", completed: false },
    { userId: 1, id: "6", title: "Fix UI bugs in task modal", completed: false },
    { userId: 1, id: "7", title: "Deploy Kanban board application", completed: false },
    { userId: 2, id: "8", title: "Write project documentation", completed: true },
    { userId: 1, id: "9", title: "Optimize drag-and-drop performance", completed: true },
    { userId: 2, id: "10", title: "Add color coding for task statuses", completed: true },
  ];

  useEffect(() => {
    // Simulate fetching data from a custom source
    setCompleted(customData.filter((task) => task.completed));
    setIncomplete(customData.filter((task) => !task.completed));
    setBacklog([]); // Initialize backlog as empty for now
    setInReview([]); // Initialize in-review as empty for now
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    deletePreviousState(source.droppableId, draggableId);

    const task = findItemById(draggableId, [
      ...incomplete,
      ...completed,
      ...inReview,
      ...backlog,
    ]);

    setNewState(destination.droppableId, task);
  };

  function deletePreviousState(sourceDroppableId, taskId) {
    switch (sourceDroppableId) {
      case "1":
        setIncomplete(removeItemById(taskId, incomplete));
        break;
      case "2":
        setCompleted(removeItemById(taskId, completed));
        break;
      case "3":
        setInReview(removeItemById(taskId, inReview));
        break;
      case "4":
        setBacklog(removeItemById(taskId, backlog));
        break;
      default:
        break;
    }
  }

  function setNewState(destinationDroppableId, task) {
    let updatedTask;
    switch (destinationDroppableId) {
      case "1": // TO DO
        updatedTask = { ...task, completed: false };
        setIncomplete([updatedTask, ...incomplete]);
        break;
      case "2": // DONE
        updatedTask = { ...task, completed: true };
        setCompleted([updatedTask, ...completed]);
        break;
      case "3": // IN REVIEW
        updatedTask = { ...task, completed: false };
        setInReview([updatedTask, ...inReview]);
        break;
      case "4": // BACKLOG
        updatedTask = { ...task, completed: false };
        setBacklog([updatedTask, ...backlog]);
        break;
      default:
        break;
    }
  }

  function findItemById(id, array) {
    return array.find((item) => item.id === id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.id !== id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: "1300px",
          margin: "0 auto",
        }}
      >
        <Column title={"TO DO"} tasks={incomplete} id={"1"} />
        <Column title={"DONE"} tasks={completed} id={"2"} />
        <Column title={"IN REVIEW"} tasks={inReview} id={"3"} />
        <Column title={"BACKLOG"} tasks={backlog} id={"4"} />
      </div>
    </DragDropContext>
  );
}