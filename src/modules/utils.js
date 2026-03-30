export const getFormData = (e) => {
  e.preventDefault();
  const projectData = Object.fromEntries(new FormData(e.target));
  return projectData;
};

export const getContrastColor = (hexColor) => {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "#000000" : "#ffffff";
};

export const calculateProgress = (totalXP, level) => {
  let progress = (totalXP / 1000) * 100 - (+level - 1) * 100;
  if (progress >= 100) {
    progress = progress - 100;
  }
  return progress;
};
