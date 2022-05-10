export default function bisectionRoot(f: (x: number) => number, l: number, r: number, eps: number = 0.0001): number {
    const leftSign = Math.sign(f(l));
    const rightSign = Math.sign(f(r));
    if (leftSign === rightSign)
        throw new Error("Invalid range (must have different signs at the ends");

    const mid = (l + r) / 2;
    const midVal = f(mid);

    if (midVal === 0 || Math.abs(midVal) <= eps) return mid;
    else {
        const midSign = Math.sign(f(mid));
        if (leftSign !== midSign) return bisectionRoot(f, l, mid, eps);
        else return bisectionRoot(f, mid, r, eps);
    }
}