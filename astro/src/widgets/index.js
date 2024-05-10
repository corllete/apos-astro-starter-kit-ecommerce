import RichTextWidget from './RichTextWidget.astro';
import ImageWidget from './ImageWidget.astro';
import VideoWidget from './VideoWidget.astro';
import ContentWidget from './ContentWidget.astro';
import BlockquoteWidget from './BlockquoteWidget.astro';

const widgetComponents = {
  '@apostrophecms/rich-text': RichTextWidget,
  '@apostrophecms/image': ImageWidget,
  '@apostrophecms/video': VideoWidget,
  'content': ContentWidget,
  'blockquote': BlockquoteWidget
};

export default widgetComponents;
