import '@wangeditor/editor/dist/css/style.css'

import React, { useState, useEffect, useMemo } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

const toolbarConfig = {
    menus: [
        'head','bold','fontSize','fontName','italic','underline','strikeThrough','indent','lineHeight','foreColor','backColor','link','list','todo','justify',
        'quote','emoticon','image','video','table','code','stLine','undo','redo',
    ],
    colors: ['#000000','#eeece0','#1c487f','#4d80bf','#c24f4a','#8baa4a','#7b5ba1','#46acc8','#f9963b',],
    fontNames: ['宋体','微软雅黑','Arial','Tahoma','Verdana'],
    fontSizes: ['12px','14px','16px','18px', '24px', '32px', '48px'],
    lineHeights: ['1', '1.5', '1.75', '2', '2.5', '3', '4'],
    zIndex: 1000,
    showFullScreen: true,
    showMenuTooltips: true,
}


const EditorComponent = ({value, onChange}) => {
    const [editor, setEditor] = useState(null)

    const editorConfig = useMemo((onchange) => {
        return {
            placeholder: '请输入内容',
            showMenuTooltips: true,
            onChange: (html) => {
                onChange(html)
            }
        }
    }, [onChange])

    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <>
        <div style={{ border: '1px solid #ccc', zIndex: 100}}>
            <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={editor => setHtml(editor.getHtml())}
                mode="default"
                style={{ height: '500px', overflowY: 'hidden' }}
            />
        </div>
        <div style={{ marginTop: '15px' }}>
            {html}
        </div>
    </>
    )
}
export default EditorComponent