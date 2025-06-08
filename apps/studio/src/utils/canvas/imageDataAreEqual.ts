export const imageDataAreEqual = (imageDataA: ImageData, imageDataB: ImageData): boolean => {
  if (imageDataA.width !== imageDataB.width || imageDataA.height !== imageDataB.height) {
    return false;
  }
  
  if (imageDataA.data.length !== imageDataB.data.length) {
    return false;
  }
  
  for (let i = 0; i < imageDataA.data.length; i++) {
    if (imageDataA.data[i] !== imageDataB.data[i]) {
      return false;
    }
  }
  
  return true;
};