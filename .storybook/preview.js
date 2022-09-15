import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  laptop1024: {
    name: '1024px x 768px',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...customViewports,
    }
  },
  options: {
    storySort: {
      order: ['Introduction', '*', 'Development'],
    },
  },
};
