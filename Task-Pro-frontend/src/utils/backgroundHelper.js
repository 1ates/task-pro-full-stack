export const getBackgroundUrls = (bgName) => {
  if (!bgName) return null;
  const isMoon = bgName === "moon";
  const isNight = bgName === "night";

  return {
    mobile1x: `/task-pro/images/background/mobile/${bgName}-mobile.jpg`,
    mobile2x: isNight
      ? `/task-pro/images/background/mobile/night-mobile-2x.jpg`
      : `/task-pro/images/background/mobile/${bgName}-mobile_2x.jpg`,

    tablet1x: isMoon
      ? `/task-pro/images/background/tablet/moon-desktop.jpg`
      : `/task-pro/images/background/tablet/${bgName}-tablet.jpg`,
    tablet2x: isMoon
      ? `/task-pro/images/background/tablet/moon-desktop_2x.jpg`
      : `/task-pro/images/background/tablet/${bgName}-tablet_2x.jpg`,

    desktop1x: `/task-pro/images/background/desktop/${bgName}-desktop.jpg`,
    desktop2x: `/task-pro/images/background/desktop/${bgName}-desktop_2x.jpg`,
  };
};
