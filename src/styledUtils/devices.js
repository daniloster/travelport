const viewportSize = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
};

export default {
  mobileS: `(min-width: ${viewportSize.mobileS})`,
  mobileM: `(min-width: ${viewportSize.mobileM})`,
  mobileL: `(min-width: ${viewportSize.mobileL})`,
  tablet: `(min-width: ${viewportSize.tablet})`,
  laptop: `(min-width: ${viewportSize.laptop})`,
  laptopL: `(min-width: ${viewportSize.laptopL})`,
  desktop: `(min-width: ${viewportSize.desktop})`,
  desktopL: `(min-width: ${viewportSize.desktop})`,
};
