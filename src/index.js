import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Carousel from "./Carousel";

import "./styles.css";

function App() {
  const carousel = useRef(null);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Carousel ref={carousel}>
        <div className="slide">Slide 1</div>
        <div className="slide">Slide 2</div>
        <div className="slide">Slide 3</div>
        <div className="slide">Slide 4</div>
        <div className="slide">Slide 5</div>
      </Carousel>
      <button onClick={() => carousel.current.previous()}>prev</button>
      <button onClick={() => carousel.current.next()}>next</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
