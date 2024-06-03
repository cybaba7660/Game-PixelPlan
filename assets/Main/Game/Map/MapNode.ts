import { _decorator, Component, director, instantiate, math, Node, Prefab, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapNode')
export class MapNode extends Node {
    @property(Prefab)
    landPrefab: Prefab = null;

    @property(Prefab)
    waterPrefab: Prefab = null;

    @property(Node)
    mapNode: Node = null;

    private mapWidth: number = 20;
    private mapHeight: number = 10;
    private landArea: number;
    private map: string[][];

    onLoad() {
        this.landArea = Math.floor((this.mapWidth * this.mapHeight) / 2);
        this.map = Array.from({ length: this.mapHeight }, () => Array(this.mapWidth).fill('water'));
        this.generateLand();
        this.renderMap();
    }

    generateLand() {
        let remainingLandArea = this.landArea;
        let landBlocks: Array<{ x: number, y: number, width: number, height: number }> = [];

        while (remainingLandArea > 0) {
            let blockWidth = math.randomRangeInt(1, Math.min(this.mapWidth / 2, remainingLandArea));
            let blockHeight = math.randomRangeInt(1, Math.min(this.mapHeight / 2, remainingLandArea / blockWidth));
            let blockArea = blockWidth * blockHeight;

            if (blockArea > remainingLandArea) {
                blockArea = remainingLandArea;
            }

            let startX = math.randomRangeInt(0, this.mapWidth - blockWidth);
            let startY = math.randomRangeInt(0, this.mapHeight - blockHeight);

            landBlocks.push({ x: startX, y: startY, width: blockWidth, height: blockHeight });
            remainingLandArea -= blockArea;

            for (let i = startY; i < startY + blockHeight; i++) {
                for (let j = startX; j < startX + blockWidth; j++) {
                    this.map[i][j] = 'land';
                }
            }
        }

        this.ensureContinuity(landBlocks);
    }

    ensureContinuity(landBlocks: Array<{ x: number, y: number, width: number, height: number }>) {
        let visited = new Set<string>();
        let queue: Array<{ x: number, y: number }> = [];
        queue.push({ x: landBlocks[0].x, y: landBlocks[0].y });

        while (queue.length > 0) {
            let { x, y } = queue.shift();
            let key = `${x},${y}`;
            if (!visited.has(key)) {
                visited.add(key);
                this.checkNeighbors(queue, x, y);
            }
        }

        for (let block of landBlocks) {
            for (let i = block.y; i < block.y + block.height; i++) {
                for (let j = block.x; j < block.x + block.width; j++) {
                    let key = `${j},${i}`;
                    if (!visited.has(key)) {
                        this.map[i][j] = 'water';
                    }
                }
            }
        }
    }

    checkNeighbors(queue: Array<{ x: number, y: number }>, x: number, y: number) {
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < this.mapWidth && ny >= 0 && ny < this.mapHeight && this.map[ny][nx] === 'land') {
                queue.push({ x: nx, y: ny });
            }
        }
    }

    renderMap() {
        for (let i = 0; i < this.mapHeight; i++) {
            for (let j = 0; j < this.mapWidth; j++) {
                let prefab = this.map[i][j] === 'land' ? this.landPrefab : this.waterPrefab;
                let node = new Node('tile');
                const size = node.getComponent(UITransform)
                node.setPosition(new Vec3(j * size.width, -i * size.height, 0));
                this.mapNode.addChild(node);
            }
        }
    }

    scrollMap() {
        for (let i = this.mapHeight - 1; i > 0; i--) {
            this.map[i] = [...this.map[i - 1]];
        }
        this.map[0] = Array(this.mapWidth).fill('water'); // 可以根据需要生成新行
        this.renderMap();
    }
}