export const calculateTotalDuration = (sections: any[]) => {
  const totalDuration = sections.reduce((acc, section) => {
    return acc + (section.totalVideoDuration || 0);
  }, 0);
  return `${Math.floor(totalDuration / (60 * 60))}h ${Math.floor(
    (totalDuration % (60 * 60)) / 60
  )}m ${totalDuration % 60}s`;
};
