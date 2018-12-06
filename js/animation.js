class CellAnimation {
    constructor(cell, direction) {
        this.step1 = 1 / 6
        this.step2 = 1 / 30
        this.progress1 = 0
        this.progress2 = 0
        this.cell = cell
        this.direction = direction
        this.stage = 0
    }

    run() {
        if (this.stage === 0) {
            if (this.direction === CellAnimation.OUT) {
                this.showMainCellAnimation()
            } else {
                this.showNeighborsAnimation()
            }
            if (this.progress1 < 0) {
                this.progress1 = 0
                this.step1 = -this.step1
                this.stage = 1
            }
        }
        if (this.stage === 0 || this.stage === 1) {
            this.showEdgeAnimation()
        }
        if (this.stage === 2) {
            if (this.direction === CellAnimation.OUT) {
                this.showNeighborsAnimation()
            } else {
                this.showMainCellAnimation()
            }
            if (this.progress1 < 0) {
                this.stage = 3
            }
        }
    }

    getNextProgress1() {
        if (this.progress1 > 1) {
            this.step1 = -this.step1
        }
        this.progress1 += this.step1
    }

    showMainCellAnimation() {
        this.getNextProgress1()
        this.showCellAnimation(this.cell)
    }

    showNeighborsAnimation() {
        this.getNextProgress1()
        for (let neighbor of this.cell.neighbors) {
            this.showCellAnimation(neighbor)
        }
    }

    showCellAnimation(cell) {
        cell.showAt((cell.size + this.progress1 * 0.2 * cell.size), color(255, 255 ,0), 49)
    }

    showEdgeAnimation() {
        for (let neighbor of this.cell.neighbors) {
            let animation_pos
            if (this.direction === CellAnimation.OUT) {
                animation_pos = p5.Vector.lerp(this.cell.pos, neighbor.pos, this.progress2)
            } else {
                animation_pos = p5.Vector.lerp(neighbor.pos, this.cell.pos, this.progress2)
            }
            noStroke()
            fill(255, 255, 0)
            ellipse(animation_pos.x, animation_pos.y, 20, 20)
        }
        this.progress2 += this.step2
        if (this.progress2 > 1) {
            this.stage = 2
        }
    }
}

CellAnimation.IN = true
CellAnimation.OUT = false
