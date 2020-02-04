
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const imageUploadCallback = file => new Promise(
  (resolve, reject) => getBase64(
    file,
    data => resolve({ data: { link: data } })
  )
);