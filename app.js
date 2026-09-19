function getBoxPosition(element) {
  const computedStyle = element.computedStyleMap();

  return {
    x: computedStyle.get('left').value,
    y: computedStyle.get('top').value,
  };
}

async function setup() {
  let lastCursorPositionForBoxMovement = null;
  let lastMovingBoxPosition = null;
  let movingBoxElement;

  const bodyElement = document.querySelector('.app__body');

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
