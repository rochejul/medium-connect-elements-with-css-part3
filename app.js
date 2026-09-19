function getBoxPosition(element) {
  const computedStyle = element.computedStyleMap();

  return {
    x: computedStyle.get('left').value,
    y: computedStyle.get('top').value,
  };
}

function getMovingElementPositionToStaticElement(movingElement, staticElement) {
  const box1Position = getBoxPosition(movingElement);
  const box2Position = getBoxPosition(staticElement);

  const left =
    movingElement.clientWidth / 2 + box1Position.x <
    box2Position.x + staticElement.clientWidth / 2;
  const top =
    movingElement.clientHeight / 2 + box1Position.y <
    box2Position.y + staticElement.clientHeight / 2;

  const above =
    box2Position.x - staticElement.clientWidth <
      box1Position.x + movingElement.clientWidth &&
    box1Position.x + movingElement.clientWidth <
      box2Position.x + staticElement.clientWidth * 2 &&
    box1Position.y + movingElement.clientHeight < box2Position.y;

  const below =
    box2Position.x - staticElement.clientWidth <
      box1Position.x + movingElement.clientWidth &&
    box1Position.x + movingElement.clientWidth <
      box2Position.x + staticElement.clientWidth * 2 &&
    box2Position.y + staticElement.clientHeight <
      box1Position.y + movingElement.clientHeight;

  return { left, top, above, below };
}

function updateLinkClassSet(linkElement, { left, top }) {
  linkElement.classList.remove(
    'link--left-top',
    'link--left-bottom',
    'link--right-top',
    'link--right-bottom',
  );

  if (left && top) {
    linkElement.classList.add('link--left-top');
  } else if (left && !top) {
    linkElement.classList.add('link--left-bottom');
  } else if (!left && top) {
    linkElement.classList.add('link--right-top');
  } else if (!left && !top) {
    linkElement.classList.add('link--right-bottom');
  }
}

function updateLink(linkElement, movingElement, staticElement) {
  const position = getMovingElementPositionToStaticElement(
    movingElement,
    staticElement,
  );

  updateLinkClassSet(linkElement, position);
}

async function setup() {
  let lastCursorPositionForBoxMovement = null;
  let lastMovingBoxPosition = null;
  let movingBoxElement;

  const bodyElement = document.querySelector('.app__body');
  const staticElement = document.querySelector('.box--second');
  const movableBoxElements = document.querySelectorAll('.box--movable');
  const linkElements = document.querySelectorAll('.link');
  const elementsMapping = new Map();

  movableBoxElements.forEach((boxElement, index) => {
    elementsMapping.set(boxElement, {
      box: boxElement,
      link: linkElements[index],
    });

    updateLink(linkElements[index], boxElement, staticElement);
  });

  bodyElement.addEventListener('pointermove', (event) => {
    console.log('Pointer moved in %s %s', event.offsetX, event.offsetY);

    if (lastMovingBoxPosition) {
      console.info('We compute the box position');
      const diffX = Math.round(
        event.clientX - lastCursorPositionForBoxMovement.x,
      );
      const diffY = Math.round(
        event.clientY - lastCursorPositionForBoxMovement.y,
      );

      console.log('The box has moved from %s %s', diffX, diffY);

      movingBoxElement.style = `left: ${lastMovingBoxPosition.x + diffX}px; top: ${lastMovingBoxPosition.y + diffY}px;`;
      updateLink(
        elementsMapping.get(movingBoxElement).link,
        movingBoxElement,
        staticElement,
      );
    }
  });

  bodyElement.addEventListener('pointerdown', (event) => {
    if (
      !lastMovingBoxPosition &&
      event.target.classList.contains('box--movable')
    ) {
      movingBoxElement = event.target;

      console.info(
        'We will start to move the box from pointer position %s %s',
        event.clientX,
        event.clientY,
      );

      lastCursorPositionForBoxMovement = {
        x: event.clientX,
        y: event.clientY,
      };

      lastMovingBoxPosition = getBoxPosition(movingBoxElement);
      movingBoxElement.classList.add('box--move-in-progress');
    }
  });

  bodyElement.addEventListener('pointerup', () => {
    if (lastMovingBoxPosition) {
      console.info('We stop to move the box');
      lastCursorPositionForBoxMovement = null;
      lastMovingBoxPosition = null;
      movingBoxElement.classList.remove('box--move-in-progress');
      movingBoxElement = null;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await setup();
  });
} else {
  await setup();
}
