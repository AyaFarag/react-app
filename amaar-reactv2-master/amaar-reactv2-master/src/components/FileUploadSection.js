import React, { PureComponent } from "react";
import PropTypes                from "prop-types";

import LoadableContainer from "../containers/LoadableContainer";

import Loading from "./Loading";

import ImageUploader from "../api/firebase-uploader";

class Image extends PureComponent {
    onRemove = () => this.props.onRemove(this.props.url);

    render() {
        return (
            <div className="col-md-3">
                <div className="imgBorder mx-auto">
                    <div className="imgBrowse">
                        {
                            !this.props.readOnly
                                && (
                                    <div className="remove-container">
                                        <a onClick={ this.onRemove } className="remove-image">&times;</a>
                                    </div>
                                )
                        }
                        <img src={ this.props.url } />
                    </div>
                </div>
            </div>
        );
    }
}

class FileUploadSection extends PureComponent {
    static propTypes = {
        onChange  : PropTypes.func,
        label     : PropTypes.string.isRequired,
        className : PropTypes.string,
        urls      : PropTypes.array,
        multiple  : PropTypes.bool,
        readOnly  : PropTypes.bool,
        isLoading : PropTypes.bool
    };

    static defaultProps = {
        className : "",
        urls      : [],
        multiple  : false,
        readOnly  : false,
        isLoading : false
    };

    state = { isUploading : false, total : 0, uploaded : 0, finished : false };

    ref = firebase.storage().ref();

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

    async uploadFiles(files) {
        this.setState({ total : files.length, uploaded : 0, isUploading : true, finished : false });

        for (let i = 0; i < files.length; i += 1) {
            const url = await this.uploadFile(files[i]);
            this.props.onChange(this.props.urls.concat([url]));
            this.setState((state) => {
                state.uploaded = state.uploaded + 1;
                return state;
            });
        }
        this.setState({ finished : true, isUploading : false });
    }

    onUpload = ({ target : { files } }) => {
        if (!files.length)
            return;
        this.uploadFiles(files).catch(console.log);
    };

    onRemove = (url) => {
        this.props.onChange(this.props.urls.filter(item => item !== url));
    };

    renderImages() {
        return this.props.urls.map(url => <Image key={ url } url={ url } onRemove={ this.onRemove } readOnly={ this.props.readOnly } />);
    }

    render() {
        const { className, label, multiple, readOnly, urls, isLoading } = this.props;
        const { isUploading } = this.state;

        return (
            <div className={ `row mx-0 my-2 imgUpload ${className}` }>
                <div className="w90 mx-auto py-3">
                    <div className="col-12 search-head" style={{ borderColor : "#fff !important" }}>
                        <h2 className="w-100 text-right m-0 p-0 font-weight-bold" style={{ color : "#fff" }}>
                            { label }
                        </h2>
                    </div>
                    <LoadableContainer isLoading={ isLoading }>
                        <div className="row py-2">
                            { this.renderImages() }
                            {
                                (readOnly && !urls.length)
                                    && (
                                        <div className="row w-100 m-0 search-result">
                                            <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد صور</h4>
                                        </div>
                                    )
                            }
                            {
                                (!readOnly && (multiple || urls.length === 0))
                                    && (
                                        <div className="col-md-3">
                                            <div className="imgBorder mx-auto" style={{ backgroundColor : isUploading ? "#FFF" : "transparent" }}>
                                                <div className="imgBrowse">
                                                    <label htmlFor="file-upload" className="custom-file-upload">
                                                        {
                                                            isUploading
                                                                ? <Loading className="h-100" />
                                                                : <img src="/images/uploadfile.png" />
                                                        }
                                                    </label>
                                                </div>
                                                <input
                                                    onChange={ this.onUpload }
                                                    id="file-upload"
                                                    type="file"
                                                    disabled={ isUploading }
                                                    multiple
                                                />
                                            </div>
                                        </div>
                                    )
                            }
                        </div>
                    </LoadableContainer>
                </div>
            </div>
        );
    }
}

export default FileUploadSection;