import React, { DOMElement } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Login from "../components/Login/index";
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders a form with everything needed inside of it", () => {
  render(<Login />, container);
});
