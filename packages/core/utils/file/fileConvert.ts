type FileBufferType = ArrayBuffer | string | null;

const getDataUriFromFile = (file: File) => {
  return new Promise<FileBufferType>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getBlobFromUrl = (imageUrl: string) => {
  return new Promise<Blob>((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', imageUrl, true);
    request.responseType = 'blob';
    request.onload = () => {
      resolve(request.response);
    };
    request.onerror = reject;
    request.send();
  });
};

const getFileFromBlob = (blob: Blob, fileName?: string) => {
  return new Promise<File>((resolve, reject) => {
    if (fileName) {
      resolve(new File([blob], fileName));
    }
    reject(null);
  });
};

const getDataUriFromBlob = (blob: Blob) => {
  return new Promise<FileBufferType>((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const convertUrlToImageDataUri = async (imageUrl: string) => {
  try {
    let blob = await getBlobFromUrl(imageUrl);
    let imageData = await getDataUriFromBlob(blob);
    return imageData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const convertUrlToFile = async (imageUrl: string) => {
  try {
    let fileName = imageUrl.split('/').pop();
    let blob = await getBlobFromUrl(imageUrl);
    let imageData = await getFileFromBlob(blob, fileName);
    return imageData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const convertUrlToImageDataUriRaw = async (imageUrl: string) => {
  return new Promise<string>((resolve, reject) => {
    if (!imageUrl) resolve('');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let base_image = new Image();
    base_image.src = imageUrl;
    base_image.crossOrigin = "anonymous";
    base_image.onload = function () {
      canvas.width = base_image.width;
      canvas.height = base_image.height;
      ctx?.drawImage(base_image, 0, 0);
      resolve(canvas.toDataURL('image/png'));
      canvas.remove();
    }
    base_image.onerror = reject;
  })
}

export default {
  getDataUriFromFile,
  getBlobFromUrl,
  getFileFromBlob,
  convertUrlToImageDataUri,
  convertUrlToFile,
  convertUrlToImageDataUriRaw,
}