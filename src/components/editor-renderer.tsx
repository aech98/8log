'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  {
    ssr: false,
  }
);

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

interface EditorRendererProps {
  content: any;
}

const EditorRenderer: FC<EditorRendererProps> = ({ content }) => {
  return (
    <Output
      style={style}
      className="text-sm"
      // renderers={renderers}
      data={content}
    />
  );
};

export default EditorRenderer;
