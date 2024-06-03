export class Perlin {
    private gradients: number[][];

    constructor(seed: number) {
        this.gradients = this.generateGradients(seed);
    }

    private generateGradients(seed: number): number[][] {
        let list: number[][] = [];
        let random = new Random(seed);
        for (let i = 0; i < 256; i++) {
            list[i] = [random.next() * 2 - 1, random.next() * 2 - 1];
        }
        return list;
    }

    private dotGridGradient(ix: number, iy: number, x: number, y: number): number {
        let dx = x - ix;
        let dy = y - iy;
        return (dx * this.gradients[iy & 255][ix & 255][0] + dy * this.gradients[iy & 255][ix & 255][1]);
    }

    public noise(x: number, y: number): number {
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;

        let sx = x - x0;
        let sy = y - y0;

        let n0 = this.dotGridGradient(x0, y0, x, y);
        let n1 = this.dotGridGradient(x1, y0, x, y);
        let ix0 = this.lerp(n0, n1, sx);

        n0 = this.dotGridGradient(x0, y1, x, y);
        n1 = this.dotGridGradient(x1, y1, x, y);
        let ix1 = this.lerp(n0, n1, sx);

        return this.lerp(ix0, ix1, sy);
    }

    private lerp(a: number, b: number, x: number): number {
        return a + x * (b - a);
    }
}

class Random {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    public next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}