interface Point {
    x: number;
    y: number;
}

interface Shape {
    color: string;
    points: Point[];
}

export const toSvg = (
    data: Uint8ClampedArray,
    width: number,
    height: number
): string => {
    const shapes: Shape[] = [];
    const visited = new Set<string>();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const key = `${x},${y}`;
            if (visited.has(key)) continue;

            const i = (y * width + x) * 4;
            const [r, g, b, a] = data.slice(i, i + 4);

            // Skip fully transparent pixels
            if (a === 0) continue;

            const color = `rgba(${r},${g},${b},${a / 255})`;
            const points = floodFill({ x, y }, color, data, width, height, visited);

            if (points.length > 0) {
                shapes.push({ color, points });
            }
        }
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
${shapes.map(shapeToPath).join("\n")}
</svg>`;
};

const floodFill = (
    start: Point,
    color: string,
    data: Uint8ClampedArray,
    width: number,
    height: number,
    visited: Set<string>
): Point[] => {
    const points: Point[] = [];
    const queue: Point[] = [start];

    while (queue.length > 0) {
        const point = queue.pop()!;
        const key = `${point.x},${point.y}`;

        if (
            visited.has(key) ||
            point.x < 0 ||
            point.x >= width ||
            point.y < 0 ||
            point.y >= height ||
            !isSameColor(point, color, data, width)
        ) {
            continue;
        }

        visited.add(key);
        points.push(point);

        // Add adjacent pixels to queue
        queue.push(
            { x: point.x + 1, y: point.y },
            { x: point.x - 1, y: point.y },
            { x: point.x, y: point.y + 1 },
            { x: point.x, y: point.y - 1 }
        );
    }

    return points;
};

const isSameColor = (
    point: Point,
    color: string,
    data: Uint8ClampedArray,
    width: number
): boolean => {
    const i = (point.y * width + point.x) * 4;
    const [r, g, b, a] = data.slice(i, i + 4);

    if (a === 0) return false;

    return color === `rgba(${r},${g},${b},${a / 255})`;
};

const shapeToPath = (shape: Shape): string => {
    // Use marching squares to create an optimized outline
    const outline = marchingSquares(shape.points);
    const path = pointsToSvgPath(outline);
    return `  <path d="${path}" fill="${shape.color}"/>`;
};

const marchingSquares = (points: Point[]): Point[] => {
    if (points.length === 0) return [];

    // Find bounds
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    // Create grid
    const grid: boolean[][] = Array(maxY - minY + 2).fill(false)
        .map(() => Array(maxX - minX + 2).fill(false));

    // Fill grid
    points.forEach(p => {
        grid[p.y - minY][p.x - minX] = true;
    });

    // Find start point
    let startX = 0;
    let startY = 0;
    findStart: for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x]) {
                startX = x;
                startY = y;
                break findStart;
            }
        }
    }

    const outline: Point[] = [];
    let x = startX;
    let y = startY;
    let direction = 0; // 0: right, 1: down, 2: left, 3: up

    do {
        outline.push({ x: x + minX, y: y + minY });

        // Get 2x2 grid cell state
        const cell = (grid[y]?.[x] ? 1 : 0) +
            (grid[y]?.[x + 1] ? 2 : 0) +
            (grid[y + 1]?.[x + 1] ? 4 : 0) +
            (grid[y + 1]?.[x] ? 8 : 0);

        // Determine next direction based on current cell and direction
        switch (cell) {
            case 1: direction = 0; break;
            case 2: direction = 1; break;
            case 3: direction = 0; break;
            case 4: direction = 1; break;
            case 5: direction = 0; break;
            case 6: direction = 1; break;
            case 7: direction = 0; break;
            case 8: direction = 2; break;
            case 9: direction = 3; break;
            case 10: direction = 2; break;
            case 11: direction = 3; break;
            case 12: direction = 2; break;
            case 13: direction = 3; break;
            case 14: direction = 2; break;
            default: direction = 3;
        }

        // Move to next position
        switch (direction) {
            case 0: x++; break;
            case 1: y++; break;
            case 2: x--; break;
            case 3: y--; break;
        }
    } while (x !== startX || y !== startY);

    return outline;
};

const pointsToSvgPath = (points: Point[]): string => {
    if (points.length === 0) return "";

    return "M" + points.map(p => `${p.x} ${p.y}`).join("L") + "Z";
}; 