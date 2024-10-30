"use client";

import React, { useState } from "react";

const jsonData = {
  question: {
    paragraph:
      "The sky is [_input] and the grass is [_input]. You should drag the word <span style='color: red;'>green</span> to the correct blank.",
    blanks: [
      { id: 1, position: "first", correctAnswer: "blue", type: "input" },
      { id: 2, position: "second", correctAnswer: "green", type: "drag" },
    ],
    dragWords: [
      { word: "blue", color: "default", id: 1 },
      { word: "green", color: "red", id: 2 },
      { word: "yellow", color: "default", id: 3 },
      { word: "red", color: "default", id: 4 },
    ],
  },
};
const DragDropSentence = () => {
  const [filledBlanks, setFilledBlanks] = useState({ 1: "", 2: "" });
  const [feedback, setFeedback] = useState("");
  // const words = [
  //   { id: "blue", text: "blue" },
  //   { id: "green", text: "green", className: "red" },
  // ];

  const handleDragStart = (event, word) => {
    event.dataTransfer.setData("text/plain", word);
  };

  const handleDrop = (event, blankId) => {
    console.log("🚀 ~ handleDrop ~ blankId:", blankId);
    const word = event.dataTransfer.getData("text/plain");
    event.preventDefault();

    // const correctAnswers = { 1: "blue", 2: "green" };
    if (
      jsonData.question.blanks.find((item) => item.id === blankId)
        .correctAnswer === word
    ) {
      setFilledBlanks((prev) => ({ ...prev, [blankId]: word }));
    } else {
      setFeedback(`Incorrect. Try placing "${word}" in the correct blank.`);
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    if (
      filledBlanks[1] === jsonData.question.blanks[0].correctAnswer &&
      filledBlanks[2] === jsonData.question.blanks[1].correctAnswer
    ) {
      setFeedback("Correct! The sky is blue and the grass is green.");
    } else {
      setFeedback("Incorrect answer. Please try again.");
    }
  };

  const renderParagraph = () => {
    const parts = jsonData.question.paragraph.split(/(\[_input\])/);
    const partsInput = jsonData.question.paragraph
      .split(/(\[_input\])/)
      .filter((item) => item === "[_input]");
    console.log("🚀 ~ renderParagraph ~ partsInput:", partsInput);
    let indexTemp = 0;
    return parts.map((part, index) => {
      if (part === "[_input]") {
        indexTemp++;
        return (
          <input
            key={index}
            className={`drop-zone ${filledBlanks[indexTemp]} ${
              filledBlanks[indexTemp] ? "filled" : ""
            }`}
            onDrop={(e) =>
              handleDrop(e, jsonData.question.blanks[indexTemp - 1].id)
            }
            onDragOver={allowDrop}
            value={filledBlanks[indexTemp]}
            onChange={(e) =>
              setFilledBlanks((prev) => ({
                ...prev,
                [indexTemp]: e.target.value,
              }))
            }
          ></input>
        );
      } else {
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };

  return (
    <div className="container">
      <p className="sentence">{renderParagraph()}</p>
      {/* <p className="sentence">
        The sky is{" "}
        <input
          className={`drop-zone ${filledBlanks[1] ? "filled" : ""}`}
          onDrop={(e) => handleDrop(e, jsonData.question.blanks[0].id)}
          onDragOver={allowDrop}
          value={filledBlanks[1]}
          onChange={(e) =>
            setFilledBlanks((prev) => ({ ...prev, [1]: e.target.value }))
          }
        ></input>{" "}
        and the grass is{" "}
        <input
          className={`drop-zone ${filledBlanks[2] ? "filled" : ""}`}
          onDrop={(e) => handleDrop(e, jsonData.question.blanks[1].id)}
          onDragOver={allowDrop}
          value={filledBlanks[2]}
          onChange={(e) =>
            setFilledBlanks((prev) => ({ ...prev, [2]: e.target.value }))
          }
        ></input>
      </p> */}

      <div className="word-bank">
        {jsonData.question.dragWords.map((item) => (
          <span
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.word)}
            className={`draggable-word ${item.color || ""}`}
          >
            {item.word}
          </span>
        ))}
      </div>

      <button onClick={handleSubmit}>Submit</button>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default DragDropSentence;
