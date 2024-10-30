"use client";

import React, { useEffect, useState } from "react";

const DragDropSentence = () => {
  const [jsonData, setJsonData] = useState(null);
  const [filledBlanks, setFilledBlanks] = useState({ 1: "", 2: "" });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState({
    error: false,
    color: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const data = await response.json();
      setJsonData(data);
    };

    fetchData();
  }, []);

  if (!jsonData)
    return (
      <div className="h-[100vh] flex items-center justify-center">
        Loading...
      </div>
    );

  const handleDragStart = (event, word) => {
    event.dataTransfer.setData("text/plain", word);
  };

  const handleDrop = (event, blankId) => {
    const word = event.dataTransfer.getData("text/plain");
    event.preventDefault();

    if (
      jsonData.question.blanks.find((item) => item.id === blankId)
        .correctAnswer === word
    ) {
      setFilledBlanks((prev) => ({ ...prev, [blankId]: word }));
    } else {
      setError({
        error: true,
        color: word,
      });
      setFeedback(
        `Incorrect. Try placing "<span class="${word}">${word}</span>" in the correct blank.`
      );
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
      setError({
        error: false,
        color: "",
      });
      setFeedback("Correct! The sky is blue and the grass is green.");
    } else {
      setError({
        error: true,
        color: "",
      });
      setFeedback("Incorrect answer. Please try again.");
    }
  };

  const handleReset = () => {
    setFilledBlanks({ 1: "", 2: "" });
    setError({
      error: false,
      color: "",
    });
    setFeedback("");
  };

  const renderParagraph = () => {
    if (!jsonData) return null;
    const parts = jsonData.question.paragraph.split(/(\[_input\])/);
    let inputIndex = 0;
    // Tạo một biến để theo dõi việc đã chèn <br /> hay chưa
    let hasInsertedBreak = false;
    return parts.map((part, index) => {
      // Kiểm tra xem có phải là dấu chấm đầu tiên không
      if (!hasInsertedBreak && part.includes(".")) {
        hasInsertedBreak = true; // Đánh dấu rằng đã chèn <br />
        const splitParts = part.split(".");
        return (
          <React.Fragment key={index}>
            {splitParts[0]}.
            <br />
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: splitParts.slice(1).join("."),
              }}
            />
          </React.Fragment>
        );
      }
      if (part === "[_input]") {
        inputIndex++;
        const blankId = jsonData.question.blanks[inputIndex - 1].id;
        return (
          <input
            key={index}
            className={`drop-zone ${blankId} ${
              filledBlanks[inputIndex] ? "filled" : ""
            }`}
            onDrop={(e) => handleDrop(e, blankId)}
            onDragOver={allowDrop}
            value={filledBlanks[inputIndex]}
            onChange={(e) =>
              setFilledBlanks((prev) => ({
                ...prev,
                [blankId]: e.target.value,
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
    <div className="container text-center">
      <p className="sentence">{renderParagraph()}</p>

      <div className="word-bank">
        {jsonData &&
          jsonData.question.dragWords.map((item) => (
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

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-700 hover:bg-blue-600"
        >
          Submit
        </button>
        <button onClick={handleReset} className="bg-gray-400 hover:bg-gray-300">
          Reset
        </button>
      </div>
      {feedback && (
        <div
          className={`feedback ${error.error}`}
          dangerouslySetInnerHTML={{ __html: feedback }}
        ></div>
      )}
    </div>
  );
};

export default DragDropSentence;
