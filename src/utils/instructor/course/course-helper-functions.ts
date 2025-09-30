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

export const getCourseLevelColor = (level?: string): string => {
  if (!level) return 'bg-blue-500';

  switch (level.toLowerCase()) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-yellow-500';
    case 'advanced':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};
