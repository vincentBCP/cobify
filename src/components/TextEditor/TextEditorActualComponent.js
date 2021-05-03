import React, { useState, useEffect } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import MyUploadAdapterPlugin from './MyUploadAdapterPlugin';

import './TextEditor.scss';

import ImagePreview from '../../widgets/ImagePreview';

const TextEditor = props => {
    const [attachments, setAttachments] = useState(props.value?.attachments || []); // array of File or array of IAttachment or arry of File and IAttachment
    const [editor, setEditor] = useState();

    useEffect(() => {
        setAttachments(props.value ? props.value.attachments || [] : []);
    }, [ props.value ]);

    const handleDragOver = ev => {
        ev.preventDefault();
        ev.stopPropagation();
        return true;
    }

    const handleDrop = ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const files = ev.dataTransfer.files;

        const updatedAttachments = [
            ...(attachments || [])
        ];
        Array.from(files).forEach(f => {
            // if (!f.type.startsWith("image")) return;
            updatedAttachments.push(f);
        });
        
        setAttachments(updatedAttachments);

        props.handleChange({
            content: editor.getData(),
            attachments: updatedAttachments
        });
    }

    const handleRemoveAttachment = index => {
        const updatedAttachments = [
            ...(attachments || [])
        ];
        updatedAttachments.splice(index, 1);
        setAttachments(updatedAttachments);

        props.handleChange({
            content: editor.getData(),
            attachments: updatedAttachments
        });
    }

    return (
        <div id="text-editor">
            <p id="text-editor-title">{props.title || "Editor"}</p>
            <CKEditor
                editor={ ClassicEditor }
                data={props.value?.content || ""}
                config={{
                    // extraPlugins: [ MyUploadAdapterPlugin ],
                    toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote' ]
                }}
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    //console.log( 'Editor is ready to use!', editor );
                    // console.log(Array.from( editor.ui.componentFactory.names() ));
                    //console.log(editor.plugins);
                    setEditor(editor);
                } }
                onChange={ ( event, editor ) => {
                    //const data = editor.getData();
                    //console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    //console.log( 'Blur.', editor );
                    props.handleChange({
                        content: editor.getData(),
                        attachments: attachments || []
                    });
                } }
                onFocus={ ( event, editor ) => {
                    //console.log( 'Focus.', editor );
                } }
            />
            <div
                id="text-editor-attachments"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {
                    (attachments || []).map((file, index) => 
                        <div key={"image-attachment-" + index}>
                            <ImagePreview
                                file={file}
                                handleRemove={() => handleRemoveAttachment(index)}
                            />
                        </div>
                    )
                }
            </div>
            {
                (attachments || []).length < 1
                ? <div
                    id="text-editor-drop-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >Drop files here</div>
                : null
            }
        </div>
    );
};

export default TextEditor;