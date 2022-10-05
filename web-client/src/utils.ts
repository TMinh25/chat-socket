function isArrayEqual(a: Array<any>, b: Array<any>) {
  if (!a || !b) return false;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length != b.length) return false;
  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] instanceof Array || b[i] instanceof Array) {
      if (!isArrayEqual(a[i], b[i])) return false;
    } else if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
}
export { isArrayEqual };
