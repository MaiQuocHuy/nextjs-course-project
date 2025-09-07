// Helper function to get word count
export const getWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

// Helper function to get character count
export const getCharacterCount = (text: string): number => {
  return text.length;
};

export const calculateTotalDuration = (sections: any[]) => {
  const totalDuration = sections.reduce((acc, section) => {
    return acc + (section.totalVideoDuration || 0);
  }, 0);
  return `${Math.floor(totalDuration / (60 * 60))}h ${Math.floor(
    (totalDuration % (60 * 60)) / 60
  )}m ${totalDuration % 60}s`;
};
