import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase/firebase";
import Compressor from "compressorjs";

export function UploadFile() {

  const [file, setFile] = useState(null);
  const [bucketAddress, setBucketAddress] = useState(null);
  const [url, setUrl] = useState(null);

  const handleUploadFile = async () => {
    const fileRef = ref(storage, 'pictureProfiles/' + Date.now() + file.name);
    // use Lib to compress media
    new Compressor(file, {
      quality: 0.6,
      maxHeight: 300,
      maxWidth: 300,
      // The compression process is asynchronous,
      // which means you have to access the `result` in the `success` hook function.
      success: async (result) => {
          const storageResult = await uploadBytes(fileRef, result);
          const publicUrl = await getDownloadURL(fileRef);
          setBucketAddress(storageResult.ref.fullPath);
          setUrl(publicUrl);  
      },
      error(err) {
        console.log(err.message);
      },
    });

  }

  return (<>
    <input type="file" onChange={(event)=> setFile(event.target.files[0])} />
    <button disabled={file ? false : true} onClick={() => handleUploadFile()}>updload</button>
    {bucketAddress ? <p>{bucketAddress}</p> : ''}
    {url ? <img src={url} /> : ''}
  </>)
}