import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapterPlugin from './MyUploadAdapterPlugin';

import './TextEditor.scss';

const TextEditor = props => {
    return (
        <div id="text-editor">
            <p id="text-editor-title">{props.title || "Editor"}</p>
            <CKEditor
                editor={ ClassicEditor }
                data=""
                config={{
                    extraPlugins: [ MyUploadAdapterPlugin ],
                    toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload' ]
                }}
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    //console.log( 'Editor is ready to use!', editor );
                    // console.log(Array.from( editor.ui.componentFactory.names() ));
                    //console.log(editor.plugins);
                } }
                onChange={ ( event, editor ) => {
                    //const data = editor.getData();
                    //console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    //console.log( 'Blur.', editor );
                    props.handleBlur(editor.getData());
                } }
                onFocus={ ( event, editor ) => {
                    //console.log( 'Focus.', editor );
                } }
            />
        </div>
    );
};

export default TextEditor;