# my-react-carousel

This is a simple but powerful carousel built in React with no dependencies. It supports infinite scrolling, touch and mouse swiping, multiple amounts of slides and much more. It also provides an API that allows you to easily add dots (indicators to quickly switch between slides), next and previous buttons etc. while still allowing you to control the markup and styling.

## Installing

Use yarn to add it as a dependency in your React app:

```bash
$ yarn add my-react-carousel
```

## Usage

In the simplest form, just drop the component into your app and put your slides inside it:

```javascript
import Carousel from "my-react-carousel";

const App = () => (
  <Carousel>
    <img src="/first.png" />
    <img src="/second.png" />
    <img src="/third.png" />
    <img src="/fourth.png" />
    <img src="/fifth.png" />
    <img src="/sixth.png" />
  </Carousel>
);
```

This will render an infinitly scrolling carousel that fills the available width and shows three slides at once.

### Add next/previous buttons

Next/previous buttons is a common way to control a carousel. There's two ways to do this, either use the powerful render API (which we will talk about later), or use refs to access the controls on the Carousel instance:

```javascript
import React from "react";
import Carousel from "my-react-carousel";

const App = () => {
  const carousel = React.useRef(null);

  return (
    <>
      <Carousel ref={carousel}>
        <img src="/first.png" />
        <img src="/second.png" />
        <img src="/third.png" />
        <img src="/fourth.png" />
        <img src="/fifth.png" />
        <img src="/sixth.png" />
      </Carousel>
      <button onClick={() => carousel.current.previous()}>previous</button>
      <button onClick={() => carousel.current.next()}>next</button>
    </>
  );
};
```

Note that when using ref we have no way of knowing wether there is a next slide or not, so this is only recommended in the infinite mode (which is enabled by default).

### Sophisticated next/preview buttons

In order to know if there is a slide before or after the current one, we need to get some more data. This is where the powerful render API comes handy.

```javascript
import Carousel from "my-react-carousel";

const App = () => (
  <Carousel
    infinite={false} // For infinite carousels hasPrevious/hasNext will always be true
    render={({ slides, hasPrevious, previous, hasNext, next }) => (
      <>
        {slides}
        {hasPrevious && <button onClick={previous}>previous</button>}
        {hasNext && <button onClick={next}>next</button>}
      </>
    )}
  >
    <img src="/first.png" />
    <img src="/second.png" />
    <img src="/third.png" />
    <img src="/fourth.png" />
    <img src="/fifth.png" />
    <img src="/sixth.png" />
  </Carousel>
);
```

We still put all our slides as children to the carousel, however, we can now also get access to a lot more data for customizing the UI. This code will only render the previous button if there is a previous slide we can move to.

### Implementing dots

A very common design is also to use dots to indicate how many slides there are and to quickly move to a specific slide. We have decided to provide a helper for rendering dots, even though you can implement this on your own using the render API.

```javascript
import Carousel, { generateDots } from "my-react-carousel";

const Dot = ({ isActive, onClick }) => (
  <button
    style={{
      padding: "16px",
      borderRadius: "50%",
      border: "1px solid #000",
      backgroundColor: isActive ? "#000" : "transparent"
    }}
    onClick={onClick}
  />
);

const App = () => (
  <Carousel
    render={generateDots(({ slides, dots }) => (
      <>
        {slides}
        {dots.map(({ index, isActive, onClick }) => (
          <Dot key={index} isActive={isActive} onClick={onClick} />
        ))}
      </>
    ))}
  >
    <img src="/first.png" />
    <img src="/second.png" />
    <img src="/third.png" />
    <img src="/fourth.png" />
    <img src="/fifth.png" />
    <img src="/sixth.png" />
  </Carousel>
);
```

The generateDots helper will add dots to the props in the render function, that is passed inside generateDots.

## API

### children (Components)

All slides you want to render in the carousel. The carousel will apply some styling to the element, so make sure that the outermost element is a DOM node, or make sure that you pass it down to the outermost DOM node. Specifically, the flex is set, so make sure you don't override this.

### ref

As shown in the example above, a ref is supplied, but should only be used for that example. You are usually much better off by using the render prop.

### infinite (boolean) (default: true)

If this is true, the slides are looped infinitly so you can scroll for ever!

### slidesToShow (number) (default: 3)

Set the number of slides to show simultaneously.

### centerCurrentSlide (boolean) (default: false)

If this is true, then the current slide is centered in the container. This should be used together with an even number of slidesToShow, as well as with the infinite mode. E.g. if you set slidesToShow to 2 and centerCurrentSlide to true, you will see 1 slide in the center, and half of the previous and following slides in the edges.

### transitionDuration (number) (default: 300)

This sets the duration of the animation when browsing between slides.

### render (props => ReactElement)

The render API is a way to extend the Carousel from the standard behaviour. Whatever you return from this function is what will be rendered in the DOM. These are the props passed to the render function, in addition to the config settings above which is also passed:

#### slides (ReactElement)

This is the carousel itself. It consists of two wrapper divs with all the slides you provided inside. Note that the outer div will fill all available width, so if you need to constrain it, put it inside something with a specified width.

#### hasNext/hasPrevious (boolean)

Tells you if there's a previous/next slide you can move to. In infinite mode these are always true.

#### next/previous (function)

Changes to the next/previous slide.

#### totalSteps (number)

In infinite mode, this is the same as total number of slides. In finite mode, this is total slides - slidesToShow. This is because if we have 10 slides in total and 3 slidesToShow, the last step is 7 (0-indexed), because when you're at index 7, slide 8-10 will be shown in the same view and you can't take another step forward or we would see empty space in the carousel which is not very nice.

#### currentStep (number)

Index of the current slide you are at.

#### goToStep (function)

Go to a specific step.

## Issues

If you have any problems with this module, please don't hesitate to open an issue in this repository.

Contributions are always appreciated!

## Development

To build this module, run `yarn build`.

To start the test runner, run `yarn test`.
