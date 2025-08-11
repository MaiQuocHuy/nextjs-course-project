export const createFileFromUrl = async (url: string, fileName: string) => {
  const response = await fetch(url);
  // here image is url/location of image
  const blob = await response.blob();
  // courseData.file = new File([blob], fileName, { type: blob.type });
  return new File([blob], fileName, { type: blob.type });
};
