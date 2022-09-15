import './youtube-chapters';

import docDescription from './youtube-chapters.md';

export default {
  title: 'Components/Youtube Chapters',
  args: {
  },
  parameters: {
    docs: {
      description: {
        component: docDescription,
      },
      source: {
        code: '',
      },
    },
  },
};

// This name should remain Template
const Template = () => {
  return /*html*/`
    <youtube-chapters>
      <google-youtube
        slot="video"
        video-id="Posw-XS4jCo"
        height="506px"
        width="900px">
      </google-youtube>
    </youtube-chapters>
  `;
};

export const YoutubeChapters = Template.bind();
