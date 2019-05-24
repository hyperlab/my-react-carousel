import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Carousel from "./Carousel";

import "./styles.css";

function findClosestPath(source, end, total) {
  const forward = end + total;
  const backward = end - total;

  const forwardDiff = Math.abs(forward - source);
  const backwardDiff = Math.abs(source - backward);
  const closeDiff = Math.abs(end - source);

  if (forwardDiff < closeDiff) {
    return forward;
  } else if (backwardDiff < closeDiff) {
    return backward;
  } else {
    return end;
  }
}

const Dot = ({ active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      border: "1px solid #000",
      background: active ? "#000" : "transparent",
      margin: "8px",
      padding: "8px"
    }}
  />
);

const dotsRenderer = ({ slides, currentStep, totalSteps, goToStep }) => {
  const dots = Array.from(Array(totalSteps)).map((_, i) => i);

  return (
    <>
      {slides}
      {dots.map(i => (
        <Dot
          key={i}
          active={i === currentStep}
          onClick={() => goToStep(findClosestPath(currentStep, i, totalSteps))}
        />
      ))}
    </>
  );
};

function App() {
  const carousel = useRef(null);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Carousel
        render={dotsRenderer}
        slidesToShow={2}
      >
        <div className="slide">Slide 1</div>
        <div className="slide">Slide 2</div>
        <div className="slide">Slide 3</div>
        <div className="slide">Slide 4</div>
        <div className="slide">Slide 5</div>
        <div className="slide">Slide 6</div>
        <div className="slide">Slide 7</div>
        <div className="slide">Slide 8</div>
        <div className="slide">Slide 9</div>
        <div className="slide">Slide 10</div>
      </Carousel>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
