import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import _ from 'lodash';
import Button from '@material-ui/core/Button';

import ResultDialog from '../../Dialog/ResultDialog';

class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = { video: null, loading: false, open: false, message: '' }
  }

  handleChange = event => {
    event.preventDefault();
    const video = event.target.files[0];

    this.setState({ video });
  }

  handleSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });
    this.fileUpload(this.state.video);
  }

  handleCloseDialog = () => {
    this.setState({ open: false, message: '' });
  }

  // ファイルアップロード
  async fileUpload(video) {
    try {
      const filePath = `videos/${firebase.auth().currentUser.uid}/${video.name}`;
      const videoStorageRef = firebase.storage().ref(filePath);
      const fileSnapshot = await videoStorageRef.put(video);

      // mp4以外の動画は、Cloud Functions上で、トランスコードした後に
      // メタデータを Firestore に保存する
      if (video.type === 'video/mp4') {
        const downloadURL = await videoStorageRef.getDownloadURL();
        let metadata = _.omitBy(fileSnapshot.metadata, _.isEmpty);
        metadata = Object.assign(metadata, {downloadURL: downloadURL});

        this.saveVideoMetadata(metadata);
      }

      if (fileSnapshot.state === 'success') {
        console.log(fileSnapshot);

        this.setState({ video: null, loading: false, open: true, message: 'ファイルのアップロードに成功しました。' });
      } else {
        console.log(fileSnapshot);

        this.setState({ video: null, loading: false, open: true, message: 'ファイルのアップロードに失敗しました。' });
      }
    } catch(error) {
      console.log(error);

      return;
    }
  }

  saveVideoMetadata(metadata) {
    const collection = firebase.firestore().collection('videos');
    return collection.add(metadata);
  }

  render() {
    return (
      <>
      <ResultDialog open={this.state.open} message={this.state.message} handleCloseDialog={this.handleCloseDialog} />
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text='Loading your content...'
        style={{height: "100vh"}}
      >
        <form onSubmit={e => this.handleSubmit(e)}>
          <h2>Video Upload</h2>
          <input
            type="file"
            accept="video/*"
            onChange={e => this.handleChange(e)}
          />
          <Button type="submit" disabled={this.state.video === null ? true : false} variant="contained" color="primary" autoFocus>
            Upload Video
          </Button>
        </form>
      </LoadingOverlay>
      </>
    );
  }
}

export default UploadPage;