
class ImageUploader {
    constructor(file, storageRef) {
        this.file = file;

        this.callback        = null;
        this.errorCallback   = null;
        this.successCallback = null;
        this.storageRef      = storageRef;

        this.done = false;
        this.task = null;
    }

    onStateChanged(callback) {
      this.callback = callback;
    }

    onSuccess(callback) {
      this.successCallback = callback;
    }

    onError(callback) {
      this.errorCallback = callback;
    }

    start() {
      const randomName = Date.now() + "-" + Math.floor(Math.random() * 10000);

      this.task = this.storageRef.child("images").child(randomName).put(this.file);

      this.task.on("state_changed", this.callback, this.errorCallback, () => {
        this.done = true;
        this.successCallback();
      });
    }

    getUrl() {
      if (this.done) {
        return this.task.snapshot.ref.getDownloadURL();
      }
      return Promise.reject();
    }
}


export default ImageUploader;