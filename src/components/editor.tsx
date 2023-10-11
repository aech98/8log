'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import EditorJS from '@editorjs/editorjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PostFormData, postSchema } from '@/lib/validation';
import { usePostEdit } from '@/lib/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import '@/styles/editor.css';

interface EditorProps {
  postId?: string;
  title?: string;
  content?: any;
  authorId?: string;
}

const Editor: FC<EditorProps> = ({ title, content, authorId, postId }) => {
  const router = useRouter();
  const editorJsRef = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState(false);

  const { register, handleSubmit } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { title, content, authorId },
  });

  const _titleRef = useRef<HTMLTextAreaElement | null>(null);

  const [isEditing, setIsEditing] = usePostEdit((state) => [
    state.isEditing,
    state.setIsEditing,
  ]);

  const initializeEditor = useCallback(async () => {
    const EditorJs = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;
    const Paragraph = (await import('@editorjs/paragraph')).default;

    if (!editorJsRef.current) {
      const editorjs = new EditorJs({
        holder: 'editor',
        inlineToolbar: true,
        data: { ...content },
        readOnly: !isEditing && Boolean(postId),
        onReady: () => {
          editorJsRef.current = editorjs;
        },
        placeholder: 'Type here to write your post...',
        tools: {
          header: Header,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          paragraph: Paragraph,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/editorjs/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const formData = new FormData();
                  formData.append('image', file);
                  const { data } = await axios.post(
                    '/editorjs/image',
                    formData
                  );

                  return {
                    success: 1,
                    file: data.image_url,
                  };
                },
              },
            },
          },
        },
      });
    }
  }, [content, isEditing, postId]);

  useEffect(() => {
    if (!editorJsRef.current) return;

    const onFocus = () => {};

    editorJsRef.current.on('focus', () => console.log('Hello'));

    return () => editorJsRef.current?.off('focus', onFocus);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    return () => {
      setIsEditing(false);
    };
  }, [isEditing, setIsEditing]);

  useEffect(() => {
    if (!isMounted) return;

    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        //_titleRef.current?.focus();
      }, 0);
    };

    init();

    return () => {
      editorJsRef.current?.destroy();
      editorJsRef.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const { ref: titleRef, ...rest } = register('title');

  const { mutateAsync: createPost } = useMutation({
    mutationFn: async (payload: PostFormData) => {
      const apiCall = async () =>
        Boolean(postId)
          ? await axios.patch(`/api/posts/${postId}`, payload)
          : await axios.post('/api/posts', payload);

      const { data } = await apiCall();
      return data;
    },

    onMutate: () => {
      return toast.loading('Publishing post');
    },

    onSuccess: (result, _, ctx) => {
      if (!isEditing) router.push('/posts');
      setIsEditing(false);
      router.refresh();
      return toast.success('Post published successfully', { id: ctx });
    },

    onError: (error, _, ctx) => {
      return toast.error('Error publishing post', { id: ctx });
    },
  });

  const onSubmit = async (data: PostFormData) => {
    const blocks = await editorJsRef.current?.save();

    const payload: PostFormData = {
      title: data.title,
      content: blocks,
      authorId: authorId!,
    };

    await createPost(payload);
  };

  return (
    <div className="min-h-[calc(100vh-4rem-4rem)]">
      <form
        id="blog-post-submit"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone">
          <TextareaAutosize
            {...rest}
            ref={(e) => {
              titleRef(e);
              _titleRef.current = e;
            }}
            placeholder="Title"
            disabled={!isEditing && Boolean(postId)}
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-2xl lg:text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{' '}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Editor;
