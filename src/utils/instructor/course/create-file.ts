export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      // For videos, create a thumbnail
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL());
      };
      video.src = URL.createObjectURL(file);
    }
  });
};

export const createFileFromUrl = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const blob = await response.blob();
    let contentType = response.headers.get('content-type') || blob.type;

    // Extract the base MIME type without parameters
    contentType = contentType.split(';')[0].trim();

    // Create a new File object with the correct base MIME type
    const file = new File([blob], fileName, {
      type: contentType,
      lastModified: new Date().getTime(),
    });

    return file;
  } catch (error) {
    // console.error('Error creating file from URL:', error);
    throw error;
  }
};
