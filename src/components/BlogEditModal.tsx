'use client';
import React, { RefObject, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import TextEditor from './TextEditor';
import { BlogPostsType } from '@/app/blogs/page';

type ModalPropsType = {
    editBlog: BlogPostsType | null;
    onClose: () => void;
    blogEditModalRef: RefObject<HTMLDivElement | null>;
};

type BlogFormData = {
    title: string;
    content: string;
    tags: string[];
};

const Modal = ({ editBlog, onClose, blogEditModalRef }: ModalPropsType) => {
    // State for tag input box
    const [tagInput, setTagInput] = useState('');
    // State to store current tags array
    const [tags, setTags] = useState<string[]>([]);
    // Track current blog id for edit/save requests
    const [blogId, setBlogId] = useState('');
    // Track if form submission is in progress
    const [isSending, setIsSending] = useState(false);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
        watch,
        getValues
    } = useForm<BlogFormData>({
        defaultValues: {
            title: '',
            content: '',
            tags: [],
        },
    });

    // Add a new tag if non-empty and unique
    const addTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
            setValue('tags', updatedTags); // Update form state
        }
        setTagInput('');
    };

    // Remove a tag by filtering it out
    const removeTag = (tag: string) => {
        const updated = tags.filter((t) => t !== tag);
        setTags(updated);
        setValue('tags', updated);
    };

    // When editBlog changes, populate form fields and tags state
    useEffect(() => {
        if (editBlog) {
            setBlogId(editBlog._id!);
            reset({
                title: editBlog.title,
                content: editBlog.content,
                tags: editBlog.tags,
            });
            setTags(editBlog.tags);
        } else {
            reset({ title: '', content: '', tags: [] });
            setTags([]);
        }
    }, [editBlog, reset]);

    // Submit handler for draft or publish
    const onSubmit = async (data: BlogFormData, status: 'draft' | 'published') => {
        const endpoint = status === 'draft' ? '/api/blogs/save-draft' : '/api/blogs/publish';

        try {
            setIsSending(true);

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id: blogId, ...data }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Failed to submit blog');

            toast.success(`Blog ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
            if (status === 'published') {
                reset({ title: '', content: '', tags: [] });
            }
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'An error occurred.');
        } finally {
            setIsSending(false);
        }
    };

    // Function to save draft without submitting full form
    const saveDraft = async () => {
        try {
            const res = await fetch('/api/blogs/save-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: blogId, ...getValues() }),
            });

            const result = await res.json();
            console.log(result);
            if (!res.ok) throw new Error(result.error || 'Failed to save draft');

            toast.success('Draft saved');
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : String(err);
            toast.error(message);
        }
    };

    // Setup auto-save timers: save draft every 30s and after 5s inactivity
    const startAutoSaveTimers = () => {
        let inactivityTimer: NodeJS.Timeout;
        let intervalTimer: NodeJS.Timeout;

        // Save draft every 30 seconds regardless of typing
        intervalTimer = setInterval(() => {
            console.log('saving because 30 seconds passed');
            saveDraft();
        }, 30000);

        // Save draft 5 seconds after user stops typing
        const handleTyping = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                console.log('saving because 5 seconds passed');
                saveDraft();
            }, 5000);
        };

        return { handleTyping, stop: () => { clearInterval(intervalTimer); clearTimeout(inactivityTimer); } };
    };

    // Effect to watch form changes and trigger auto-save timers
    useEffect(() => {
        const { handleTyping, stop } = startAutoSaveTimers();

        const subscription = watch(() => {
            handleTyping();
        });

        // Cleanup subscription and timers on unmount
        return () => {
            subscription.unsubscribe();
            stop();
        };
    }, [watch, getValues]);

    return (
        <div
            ref={blogEditModalRef}
            className="max-w-3xl mx-auto fixed inset-0 flex items-center justify-center px-4"
        >
            <div className="bg-white w-full rounded-2xl p-6 shadow-xl space-y-6 overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold tracking-tight">Create Post</h2>
                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-gray-500 hover:text-black" />
                    </button>
                </div>

                {/* Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter title..."
                    />
                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
                </div>

                {/* Tags Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            className="flex-1 border rounded-lg px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Type a tag and press Enter"
                        />
                        <button
                            onClick={addTag}
                            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1"
                            >
                                {tag}
                                <button
                                    className="text-gray-500 hover:text-black"
                                    onClick={() => removeTag(tag)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <TextEditor
                        content={watch('content')}
                        onChange={(value: string) => setValue('content', value)}
                    />
                    {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>}
                </div>

                {/* Draft autosave note */}
                <p className="text-sm text-gray-500 italic pt-2 border-t">
                    Just write. We’re keeping your drafts safe every 30 seconds.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        disabled={isSending}
                        className={`px-5 py-2 rounded-lg border border-black text-black hover:bg-black hover:text-white transition-colors ${isSending ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                    >
                        {isSending ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        disabled={isSending}
                        className={`px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors ${isSending ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        onClick={handleSubmit((data) => onSubmit(data, 'published'))}
                    >
                        {isSending ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
