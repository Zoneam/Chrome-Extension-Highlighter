let isActivated = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleActivation') {
    isActivated = !isActivated;
  } else if (request.action === 'getActivationState') {
    sendResponse({ isActivated });
  }
});

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

function getRandomColor(depth) {
  const colors = ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#581845'];
  return colors[depth % colors.length];
}

function highlightAllChildren(element, add, depth = 0) {
  if (add) {
    const color = getRandomColor(depth);
    element.style.outline = `2px solid ${color}`;
  } else {
    element.style.outline = '';
  }

  Array.from(element.children).forEach((child) => {
    highlightAllChildren(child, add, depth + 1);
  });
}

function countDescendants(element) {
  let count = 0;

  if (element.children.length > 0) {
    Array.from(element.children).forEach((child) => {
      count += 1 + countDescendants(child);
    });
  }

  return count;
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

  // Add the depth row
  const depthRow = document.createElement('div');
  depthRow.className = 'depth-row';
  depthRow.textContent = `No of Descendants: ${countDescendants(element)}`; // Use the countDescendants function
  box.appendChild(depthRow);

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

  if (event.target.infoBox) {
    event.target.infoBox.style.top = mouseY + 20 + 'px';
    event.target.infoBox.style.left = mouseX + 20 + 'px';
  }
});

document.addEventListener('mouseover', (event) => {
  if (!isActivated) return;

  highlightAllChildren(event.target, true);

  const infoBox = createInfoBox(event.target, event.clientX, event.clientY);
  event.target.infoBox = infoBox;
  document.body.appendChild(infoBox);
});

document.addEventListener('mouseout', (event) => {
  if (!isActivated) return;

  highlightAllChildren(event.target, false);

  if (event.target.infoBox) {
    document.body.removeChild(event.target.infoBox);
    event.target.infoBox = null;
  }
});

