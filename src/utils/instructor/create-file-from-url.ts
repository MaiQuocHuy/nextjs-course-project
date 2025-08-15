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
      lastModified: new Date().getTime()
    });
    
    return file;
  } catch (error) {
    console.error('Error creating file from URL:', error);
    throw error;
  }
};
