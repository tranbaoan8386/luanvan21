import React, { useEffect, useState } from 'react'
import { useQuill } from 'react-quilljs'
import BlotFormatter from 'quill-blot-formatter'
import 'quill/dist/quill.snow.css'
import { useDebounce } from '../../../hooks/useDebounce'

const Editor = ({ onContentChange, initialContent }) => {
    const [editorContent, setEditorContent] = useState('')
    const { quill, quillRef, Quill } = useQuill({
        modules: { blotFormatter: {} }
    })

    if (Quill && !quill) {
        Quill.register('modules/blotFormatter', BlotFormatter)
    }

    // Sử dụng debounce để tránh spamming sự thay đổi
    const debouncedContent = useDebounce(editorContent, 500)

    useEffect(() => {
        // Gọi hàm onContentChange khi giá trị đã được debounce
        onContentChange(debouncedContent)
    }, [debouncedContent, onContentChange])

    useEffect(() => {
        if (quill && initialContent !== undefined && initialContent !== editorContent) {
            quill.clipboard.dangerouslyPasteHTML(initialContent)
            setEditorContent(initialContent)
        }
    }, [quill, initialContent])
    

    return (
        <div>
            <div ref={quillRef} />
        </div>
    )
}

export default Editor
/* Chức năng chính của Editor.jsx
Tích hợp trình soạn thảo Quill.js

Đây là một thư viện rich text editor phổ biến với nhiều tính năng định dạng (in đậm, nghiêng, chèn ảnh, tiêu đề, v.v).

Cho phép set nội dung ban đầu (initialContent)

Khi sửa sản phẩm, bạn muốn hiển thị mô tả cũ đã có sẵn → dùng quill.clipboard.dangerouslyPasteHTML() để hiển thị lại nội dung đó.

Gửi nội dung ra ngoài qua onContentChange

Khi người dùng nhập hoặc thay đổi nội dung, Editor gọi lại onContentChange() để truyền nội dung HTML ra ngoài component cha (UpdateProduct.jsx).

Debounce nội dung

Dùng custom hook useDebounce để tránh việc spam callback khi người dùng đang gõ.

Hỗ trợ định dạng ảnh thông minh

Bạn đang dùng quill-blot-formatter để cho phép resize / di chuyển ảnh trong vùng nhập.

 */