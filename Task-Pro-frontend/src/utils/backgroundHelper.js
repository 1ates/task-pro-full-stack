const getViewportType = (width) => {
  if (width < 768) {
    return "mobile";
  }
  if (width < 1280) {
    return "tablet";
  }
  return "desktop";
};

const getBackgroundFileName = (bgName, viewportType, isRetina) => {
  const suffix = isRetina ? "_2x" : "";
  return `${bgName}-${viewportType}${suffix}.jpg`;
};

export const getBackgroundUrls = (bgName) => {
  if (!bgName || typeof window === "undefined") {
    return null;
  }
  const viewportType = getViewportType(window.innerWidth);
  const isRetina = window.devicePixelRatio >= 2;
  const fileName = getBackgroundFileName(bgName, viewportType, isRetina);

  return {
    selected: `/task-pro/images/background/${viewportType}/${fileName}`,
    viewportType,
    isRetina,
  };
};
