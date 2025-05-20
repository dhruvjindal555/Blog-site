'use client'
import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import MenuBar from './MenuBar'

const TextEditor = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
    // Initialize the TipTap editor instance with specified extensions and options
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Add Tailwind CSS classes to bullet and ordered lists for styling
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4'
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-4'
                    }
                },
            }),
            // Enable text alignment on headings and paragraphs
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            // Enable text highlight with a specific background color class
            Highlight.configure({
                HTMLAttributes: {
                    class: 'bg-red-200'
                }
            })
        ],
        content: content, // Set initial content for the editor
        editorProps: {
            attributes: {
                // Add classes to the editor content area for styling, padding, border, height, and scroll
                class: "border p-4 rounded-lg bg-gray-100 h-[156px] overflow-y-auto rounded-lg border bg-gray-100 p-2"
            }
        },
        immediatelyRender: false, // Prevent immediate rendering on init for performance optimization
        // Callback called whenever the content of the editor is updated
        onUpdate: ({ editor }) => { 
            onChange(editor.getHTML()) // Pass updated HTML content to the parent via onChange prop
        }
    })

    // Synchronize the editor content when the `content` prop changes externally
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content, false) // Update content without triggering history
        }
    }, [editor, content])

    return (
        // Wrapper container with max width and centering
        <div className='max-w-3xl mx-auto'>
            {/* Toolbar/menu bar component, passing the editor instance */}
            <MenuBar editor={editor} />
            <div className="">
                {/* EditorContent renders the editable content area */}
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default TextEditor
