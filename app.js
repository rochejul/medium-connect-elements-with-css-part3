function getBoxPosition(element) {
  const computedStyle = element.computedStyleMap();

  return {
    x: computedStyle.get('left').value,
    y: computedStyle.get('top').value,
  };
}

async function setup() {
  let lastCursorPositionForBoxMovement = null;
  let lastBox1Position = null;

  const bodyElement = document.querySelector('.app__body');
  const box1Element = document.querySelector('.box--one');

  bodyElement.addEventListener('pointermove', (event) => {
    console.log('Pointer moved in %s %s', event.offsetX, event.offsetY);

    if (lastBox1Position) {
      console.info('We compute the box position');
      const diffX = Math.round(
        event.clientX - lastCursorPositionForBoxMovement.x,
      );
      const diffY = Math.round(
        event.clientY - lastCursorPositionForBoxMovement.y,
      );

      console.log('The box has moved from %s %s', diffX, diffY);

      box1Element.style = `left: ${lastBox1Position.x + diffX}px; top: ${lastBox1Position.y + diffY}px;`;
    }
  });

  box1Element.addEventListener('pointerdown', (event) => {
    console.info(
      'We will start to move the box from pointer position %s %s',
      event.clientX,
      event.clientY,
    );

    lastCursorPositionForBoxMovement = {
      x: event.clientX,
      y: event.clientY,
    };

    lastBox1Position = getBoxPosition(box1Element);
    box1Element.classList.add('box--move-in-progress');
  });

  box1Element.addEventListener('pointerup', () => {
    console.info('We stop to move the box');
    lastCursorPositionForBoxMovement = null;
    lastBox1Position = null;
    box1Element.classList.remove('box--move-in-progress');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await setup();
  });
} else {
  await setup();
}
