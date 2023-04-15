function createColorSwatch(color) {
  const swatch = document.createElement('span');
  swatch.style.backgroundColor = color;
  swatch.style.display = 'inline-block';
  swatch.style.width = '16px';
  swatch.style.height = '16px';
  swatch.style.borderRadius = '3px';
  swatch.style.marginLeft = '4px';
  swatch.style.verticalAlign = 'middle';
  return swatch;
}

function createInfoBox(element, mouseX, mouseY) {
  const box = document.createElement('div');
  box.className = 'element-info-box';
  box.style.position = 'fixed';
  box.style.top = mouseY + 20 + 'px';
  box.style.left = mouseX + 20 + 'px';
  box.style.zIndex = 10000;
  box.style.pointerEvents = 'none';

  const tagNameRow = document.createElement('div');
  tagNameRow.className = 'tag-name-row';
  tagNameRow.textContent = `<${element.tagName.toLowerCase()}>`;
  box.appendChild(tagNameRow);

  if (element.className) {
    const classRow = document.createElement('div');
    classRow.className = 'class-row';
    classRow.textContent = `Class: ${element.className}`;
    box.appendChild(classRow);
  }

  const computedStyle = window.getComputedStyle(element);
  const styles = ['width', 'height', 'background-color', 'color', 'font-size', 'margin', 'padding', 'border'];

  styles.forEach((style) => {
    const row = document.createElement('div');
    row.textContent = `${style}: ${computedStyle[style]}`;
    if (style === 'color' || style === 'background-color') {
      const colorSwatch = createColorSwatch(computedStyle[style]);
      row.appendChild(colorSwatch);
    }
    box.appendChild(row);
  });

  return box;
}

document.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (event.target.classList.contains('highlight-element')) {
    if (event.target.infoBox) {
      event.target.infoBox.style.top = mouseY + 20 + 'px';
      event.target.infoBox.style.left = mouseX + 20 + 'px';
    }
  }
});

document.addEventListener('mouseover', (event) => {
  event.target.classList.add('highlight-element');

  const infoBox = createInfoBox(event.target, event.clientX, event.clientY);
  event.target.infoBox = infoBox;
  document.body.appendChild(infoBox);
});

document.addEventListener('mouseout', (event) => {
  event.target.classList.remove('highlight-element');
  if (event.target.infoBox) {
    document.body.removeChild(event.target.infoBox);
    event.target.infoBox = null;
  }
});
