
export const add = (a, b) => {
  if (isNaN(a)) {
    throw new Error("a is not a number");
    
  }
  if (isNaN(b)) {
    throw new Error("b is not a number");
    
  }
  return a + b;
}

