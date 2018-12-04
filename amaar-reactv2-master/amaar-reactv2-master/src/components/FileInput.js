import React, { PureComponent } from "react";
import PropTypes                from "prop-types";

import Loading from "./Loading";

import ImageUploader from "../api/firebase-uploader";

class FileInput extends PureComponent {
    static propTypes = {
        onChange    : PropTypes.func.isRequired,
        placeholder : PropTypes.string,
        className   : PropTypes.string,
        url         : PropTypes.string
    };

    static defaultProps = {
        placeholder : "",
        className   : "",
        url         : ""
    };

    state = { isUploading : false, finished : false };
    ref   = firebase.storage().ref();

    uuid = `${Math.round(Math.random() * 100000000000)}`;

    uploadFile(file) {
        return new Promise((resolve, reject) => {
            const image = new ImageUploader(file, this.ref);
            image.onStateChanged(console.log);
            image.onSuccess(() => {
                image.getUrl().then(resolve);
            });

            image.start();
        });
    }

    async uploadFiles([file]) {
        this.setState({ isUploading : true, finished : false });

        this.props.onChange(await this.uploadFile(file));

        this.setState({ finished : true, isUploading : false });
    }

    onUpload = ({ target : { files } }) => {
        if (!files.length) return;
        this.uploadFiles(files).catch(console.log);
    };

    render() {
        const { className, label, url } = this.props;
        const { finished, isUploading } = this.state;
        return (
            <div className={ className }>
                <div className="imgBorder mx-auto border-dark" style={{ backgroundColor : isUploading ? "#FFF" : "transparent" }}>
                    <div className="imgBrowse">
                        <label htmlFor={ `upload-${this.uuid}` } className="custom-file-upload w-100">
                            {
                                isUploading
                                    ? <Loading className="h-100" />
                                    : (
                                        url
                                            ? <img src={ url } />
                                            : <img src="/images/uploadfile.png" />
                                    )
                            }
                            { (!url && !isUploading && label) && <span className="file-input-label">{ label }</span> }
                        </label>
                    </div>
                    <input id={ `upload-${this.uuid}` } type="file" className="d-none" onChange={ this.onUpload } disabled={ isUploading } />
                </div>
            </div>
        );
    }
}

export default FileInput;