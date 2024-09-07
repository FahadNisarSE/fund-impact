import React from "react";

export default function ErrorCube() {
  return (
    <div className="cube-loader">
      <div className="cube-top"></div>
      <div className="cube-wrapper">
        <span
          className="cube-span"
          style={{
            transform: `rotateY(calc(90deg * ${0})) translateZ(37.5px)`,
          }}
        >
          <div className="taco-container text-center text-[50px]">❌</div>
        </span>
        <span
          className="cube-span"
          style={{
            transform: `rotateY(calc(90deg * ${1})) translateZ(37.5px)`,
          }}
        >
          <div className="taco-container text-center text-[50px]">❌</div>
        </span>
        <span
          className="cube-span"
          style={{
            transform: `rotateY(calc(90deg * ${2})) translateZ(37.5px)`,
          }}
        >
          <div className="taco-container text-center text-[50px]">❌</div>
        </span>
        <span
          className="cube-span"
          style={{
            transform: `rotateY(calc(90deg * ${3})) translateZ(37.5px)`,
          }}
        >
          <div className="taco-container text-center text-[50px]">❌</div>
        </span>
      </div>
    </div>
  );
}
