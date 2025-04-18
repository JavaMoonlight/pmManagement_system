import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import DOMPurify from 'dompurify';

function MyEditor({ value, onChange }) {
  // editor 实例
   const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState('')

//   // 模拟 ajax 请求，异步设置 html
//   useEffect(() => {
//     setTimeout(() => {
//       setHtml('')
//     }, 1500)
//   }, [])

  // 工具栏配置
   const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
    const editorConfig = {                         // JS 语法
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    // <>
    //   <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
    //     <Toolbar
    //       editor={editor}
    //       defaultConfig={toolbarConfig}
    //       mode="default"
    //       style={{ borderBottom: '1px solid #ccc' }}
    //     />
    //     <Editor
    //       defaultConfig={editorConfig}
    //       value={html}
    //       onCreated={setEditor}
    //       onChange={(editor) => setHtml(editor.getHtml())}
    //       mode="default"
    //       style={{ height: '500px', overflowY: 'hidden' }}
    //     />
    //   </div>
    // </>
    <Editor
      defaultConfig={editorConfig}
      value={value}
      onCreated={setEditor}
      onChange={(editor) => {
        const cleanHtml = DOMPurify.sanitize(editor.getHtml());
        onChange(cleanHtml);
      }}
    />
  )
}

export default MyEditor